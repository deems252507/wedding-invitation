import { useEffect, useRef, type ReactNode } from "react";

/** Scroll-triggered clipped text reveal. Keeps text readable when motion is reduced. */
export function ImageTextReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-revealed");
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add("is-revealed");
        observer.disconnect();
      }
    }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`image-text-reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
}
