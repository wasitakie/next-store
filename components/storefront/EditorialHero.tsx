import Image from "next/image";

export const editorialImages = {
  workspace: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=2000&q=85",
  headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=2000&q=85",
  desk: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85",
};

export default function EditorialHero({title, description, image, centered = false}: {title: string; description: string; image: string; centered?: boolean}) {
  return <section className={`relative isolate flex min-h-[440px] items-end overflow-hidden bg-neutral-800 px-5 py-16 text-white sm:px-8 md:min-h-[620px] lg:px-12 ${centered ? "items-center text-center" : ""}`}>
    <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
    <div className="absolute inset-0 -z-10 bg-black/45" />
    <div className={`mx-auto w-full max-w-[1504px] ${centered ? "flex flex-col items-center" : ""}`}>
      <h1 className="text-5xl font-normal leading-tight tracking-tight sm:text-7xl lg:text-8xl">{title}</h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">{description}</p>
    </div>
  </section>;
}
