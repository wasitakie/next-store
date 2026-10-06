"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Content stays readable before hydration and when reduced motion is enabled. */
export default function StoreMotion({children, className = ""}: {children: ReactNode; className?: string}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const animations = new Set<Animation>();
    function setup() {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      if (media.matches || !root) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const animation = entry.target.animate([
            {opacity:0,transform:"translateY(28px)"},
            {opacity:1,transform:"translateY(0)"},
          ], {duration:700,easing:"cubic-bezier(.22,1,.36,1)"});
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
          observer?.unobserve(entry.target);
        });
      }, {threshold:0.08});
      root.querySelectorAll("h1, h2, article, [data-store-reveal]").forEach(element => observer?.observe(element));
    }
    setup();
    media.addEventListener("change",setup);
    return () => {observer?.disconnect(); animations.forEach(animation => animation.cancel()); media.removeEventListener("change",setup);};
  },[]);
  return <main ref={ref} className={`store-motion ${className}`}>{children}</main>;
}
