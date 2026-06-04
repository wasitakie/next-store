import "dotenv/config";
import { prisma } from "@/lib/prisma";

async function main() {
  const email = process.argv[2] ?? process.env.ADMIN_EMAIL;

  if (!email) {
    throw new Error(
      "Please provide email: npm run promote-admin -- user@example.com"
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new Error(`User not found: ${email}`);
  }

  if (user.role === "admin") {
    console.log(`User ${user.email} is already admin.`);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  });

  console.log(`Promoted ${email} to admin successfully.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
