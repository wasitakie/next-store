import "dotenv/config";

import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import dotenv from "dotenv";
import pg from "pg";

type MariaConnection = {
  query<T = Row[]>(sql: string): Promise<T>;
  release(): void;
};
type MariaPool = {
  getConnection(): Promise<MariaConnection>;
  end(): Promise<void>;
};

const require = createRequire(import.meta.url);
const adapterEntry = require.resolve("@prisma/adapter-mariadb");
const mariadb = require(
  require.resolve("mariadb", { paths: [path.dirname(adapterEntry)] }),
) as {
  createPool(config: Record<string, unknown>): MariaPool;
};

type Row = Record<string, unknown>;
type TablePlan = {
  source: string;
  target: string;
  columns: string[];
};

const tables: TablePlan[] = [
  {
    source: "User",
    target: "User",
    columns: [
      "id",
      "avatar",
      "email",
      "name",
      "password",
      "role",
      "createdAt",
      "updatedAt",
    ],
  },
  {
    source: "Product",
    target: "Product",
    columns: [
      "id",
      "slug",
      "name_th",
      "name_en",
      "description_th",
      "description_en",
      "price",
      "stock",
      "image",
      "category_th",
      "category_en",
      "createdAt",
      "updatedAt",
    ],
  },
  {
    source: "Account",
    target: "Account",
    columns: [
      "id",
      "userId",
      "type",
      "provider",
      "providerAccountId",
      "refresh_token",
      "access_token",
      "expires_at",
      "token_type",
      "scope",
      "id_token",
      "session_state",
    ],
  },
  {
    source: "Session",
    target: "Session",
    columns: ["id", "sessionToken", "userId", "expires"],
  },
  {
    source: "VerificationToken",
    target: "VerificationToken",
    columns: ["identifier", "token", "expires"],
  },
  {
    source: "Order",
    target: "Order",
    columns: [
      "id",
      "total",
      "status",
      "userId",
      "createdAt",
      "updatedAt",
    ],
  },
  {
    source: "OrderItem",
    target: "OrderItem",
    columns: ["id", "quantity", "price", "orderId", "productId"],
  },
];

function quoteMysql(identifier: string) {
  assert.match(identifier, /^[A-Za-z_][A-Za-z0-9_]*$/);
  return `\`${identifier}\``;
}

function quotePostgres(identifier: string) {
  assert.match(identifier, /^[A-Za-z_][A-Za-z0-9_]*$/);
  return `"${identifier}"`;
}

function readSourceUrl() {
  if (process.env.LEGACY_DATABASE_URL) return process.env.LEGACY_DATABASE_URL;
  const sourceEnv = process.env.LEGACY_ENV_FILE || ".env.prod";
  if (!fs.existsSync(sourceEnv)) {
    throw new Error(
      `Missing ${sourceEnv}. Set LEGACY_DATABASE_URL or LEGACY_ENV_FILE.`,
    );
  }
  const parsed = dotenv.parse(fs.readFileSync(sourceEnv));
  if (!parsed.DATABASE_URL) {
    throw new Error(`${sourceEnv} does not contain DATABASE_URL.`);
  }
  return parsed.DATABASE_URL;
}

function readTargetUrl() {
  const value =
    process.env.SUPABASE_DATABASE_URL ??
    process.env.TARGET_DATABASE_URL ??
    process.env.DATABASE_URL;
  if (!value) {
    throw new Error(
      "Missing target database URL. Set SUPABASE_DATABASE_URL, TARGET_DATABASE_URL, or DATABASE_URL.",
    );
  }
  return value;
}

async function main() {
  const sourceUrl = new URL(readSourceUrl());
  const targetUrl = new URL(readTargetUrl());
  if (!sourceUrl.protocol.startsWith("mysql")) {
    throw new Error("LEGACY_DATABASE_URL must be a MySQL/TiDB URL.");
  }
  if (!targetUrl.protocol.startsWith("postgres")) {
    throw new Error("The target database URL must be a PostgreSQL URL.");
  }
  if (sourceUrl.hostname === targetUrl.hostname) {
    throw new Error("Source and target hosts must be different.");
  }

  const sourcePool = mariadb.createPool({
    host: sourceUrl.hostname,
    port: Number(sourceUrl.port || 3306),
    user: decodeURIComponent(sourceUrl.username),
    password: decodeURIComponent(sourceUrl.password),
    database: sourceUrl.pathname.replace(/^\//, ""),
    ssl: true,
    connectionLimit: 2,
    connectTimeout: 15_000,
  });
  const target = new pg.Client({ connectionString: targetUrl.toString() });

  try {
    await target.connect();
    const source = await sourcePool.getConnection();
    try {
      const sourceRows = new Map<string, Row[]>();
      for (const table of tables) {
        const select = table.columns.map(quoteMysql).join(", ");
        const rows = (await source.query(
          `SELECT ${select} FROM ${quoteMysql(table.source)} ORDER BY ${quoteMysql(table.columns[0])}`,
        )) as Row[];
        sourceRows.set(table.source, rows);
      }

      const targetCounts = new Map<string, number>();
      for (const table of tables) {
        const result = await target.query(
          `SELECT COUNT(*)::int AS count FROM ${quotePostgres(table.target)}`,
        );
        targetCounts.set(table.target, result.rows[0].count);
      }
      const occupied = [...targetCounts].filter(([, count]) => count > 0);
      if (occupied.length > 0) {
        throw new Error(
          `Target is not empty: ${occupied.map(([name, count]) => `${name}=${count}`).join(", ")}. Migration aborted.`,
        );
      }

      console.log(
        "Source rows:",
        Object.fromEntries(
          tables.map((table) => [
            table.source,
            sourceRows.get(table.source)?.length ?? 0,
          ]),
        ),
      );

      if (process.argv.includes("--dry-run")) {
        console.log("Dry run complete. No target data was changed.");
        return;
      }

      await target.query("BEGIN");
      try {
        for (const table of tables) {
          const rows = sourceRows.get(table.source) ?? [];
          const columns = table.columns.map(quotePostgres).join(", ");
          for (const row of rows) {
            const values = table.columns.map((column) => row[column] ?? null);
            const placeholders = values.map((_, index) => `$${index + 1}`);
            await target.query(
              `INSERT INTO ${quotePostgres(table.target)} (${columns}) VALUES (${placeholders.join(", ")})`,
              values,
            );
          }
        }

        for (const table of tables.filter((item) => item.columns[0] === "id")) {
          await target.query(
            `SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE((SELECT MAX("id") FROM ${quotePostgres(table.target)}), 1), EXISTS (SELECT 1 FROM ${quotePostgres(table.target)}))`,
            [quotePostgres(table.target)],
          );
        }
        await target.query("COMMIT");
      } catch (error) {
        await target.query("ROLLBACK");
        throw error;
      }

      for (const table of tables) {
        const expected = sourceRows.get(table.source)?.length ?? 0;
        const result = await target.query(
          `SELECT COUNT(*)::int AS count FROM ${quotePostgres(table.target)}`,
        );
        assert.equal(
          result.rows[0].count,
          expected,
          `${table.target} row count mismatch`,
        );
      }
      console.log("Migration complete. All table row counts match.");
    } finally {
      source.release();
    }
  } finally {
    await Promise.allSettled([sourcePool.end(), target.end()]);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
