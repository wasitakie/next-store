import { Link } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ArrowUpRight, Asterisk, CreditCard } from "lucide-react";

const linkClass = "inline-block py-1 text-sm leading-6 text-neutral-200 transition-colors hover:text-white hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const contact = await getTranslations("ContactPage");
  const locale = await getLocale();
  const categories = await prisma.product.findMany({
    select: { category_en: true, category_th: true },
    distinct: ["category_en"],
    orderBy: { category_en: "asc" },
    take: 6,
  });
  const pages = [["/",t("home")],["/products",t("products")],["/about",t("about")],["/contact",t("contact")],["/contact#faq",t("faq")]];
  const account = [["/wishlist",t("wishlist")],["/cart",t("cart")],["/checkout",t("checkout")],["/login",t("login")],["/register",t("register")]];
  const support = [["/contact",t("support")],["/contact#faq-4",t("shipping")],["/contact#faq-4",t("returns")],["/contact#faq-1",t("availability")]];
  return <footer className="overflow-hidden bg-[#171717] pt-14 text-white md:pt-20">
    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-[1fr_1.15fr_1fr_1fr_2fr] lg:gap-x-8">
        <FooterLinks title={t("pages")} links={pages} />
        <nav aria-label={t("collections")}><h2 className="mb-3 text-xs font-normal text-neutral-400">{t("collections")}</h2><ul>{categories.filter(category => category.category_en || category.category_th).map(category => <li key={category.category_en || category.category_th}><Link href={{pathname:"/products",query:{category:category.category_en || category.category_th || ""}}} className={linkClass}>{locale === "en" ? category.category_en || category.category_th : category.category_th || category.category_en}</Link></li>)}</ul></nav>
        <FooterLinks title={t("account")} links={account} />
        <FooterLinks title={t("customerService")} links={support} />
        <div className="col-span-2 max-w-lg md:col-span-4 lg:col-span-1">
          <h2 className="text-base font-normal">{t("stayConnected")}</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-400">{t("contactDescription")}</p>
          <a href={`mailto:${contact("channels.1.value")}`} className="mt-5 flex min-h-12 items-center justify-between gap-3 rounded-full border border-neutral-600 px-5 text-sm text-neutral-200 transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><span className="break-all">{contact("channels.1.value")}</span><ArrowUpRight className="size-5 shrink-0" /></a>
          <a href={`tel:${contact("channels.0.value")}`} className={`mt-2 ${linkClass}`}>{contact("channels.0.value")}</a>
          <div className="mt-7 flex items-center gap-3 text-neutral-400"><CreditCard className="size-5 shrink-0 stroke-[1.25]" /><p className="text-xs leading-5">{t("paymentNote")}<span className="ml-2 inline-block rounded border border-neutral-600 px-2 py-0.5 text-neutral-200">THB</span></p></div>
        </div>
      </div>
      <div className="mt-16 flex flex-col gap-3 text-xs leading-5 text-neutral-400 sm:flex-row sm:items-center sm:justify-between lg:mt-24">
        <p>{t("copyrightYear",{year:new Date().getFullYear()})}</p>
        <p>{contact("channels.2.value")}</p>
      </div>
      <Link href="/" aria-label="NextStore" className="mt-5 flex w-full items-center justify-between gap-2 pb-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:pb-10">
        <span aria-hidden="true" className="select-none bg-gradient-to-b from-white from-20% to-[#171717] bg-clip-text text-[clamp(3rem,15.8vw,15.8rem)] font-medium leading-[1.05] tracking-[-0.065em] text-transparent">NextStore</span>
        <Asterisk aria-hidden="true" className="h-auto w-[16%] shrink-0 text-neutral-100 [mask-image:linear-gradient(to_bottom,black_20%,transparent)]" strokeWidth={3} />
      </Link>
    </div>
  </footer>;
}

function FooterLinks({title,links}: {title: string; links: string[][]}) {
  return <nav aria-label={title}><h2 className="mb-3 text-xs font-normal text-neutral-400">{title}</h2><ul>{links.map(([href,label]) => <li key={href+label}><Link href={href} className={linkClass}>{label}</Link></li>)}</ul></nav>;
}
