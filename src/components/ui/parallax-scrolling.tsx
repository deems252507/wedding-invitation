"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { cn } from "@/lib/utils";

// Local wedding assets – full photo, never cropped by object-fit cover at layer level
import heroImg from "@/assets/hero.jpg";
import coverImg from "@/assets/cover.jpg";
import story2 from "@/assets/story-2.jpg";
import gal1 from "@/assets/gal-1.jpg";

export interface ParallaxLayer {
  /** Image src (imported or URL) */
  src?: string;
  /** Layer depth: 1 = farthest (moves most), 4 = closest */
  layer: "1" | "2" | "3" | "4";
  /** Optional title text rendered on layer 3 */
  title?: string;
  alt?: string;
}

export interface ParallaxScrollingProps
  extends React.ComponentPropsWithoutRef<"div"> {
  /** Layers to render */
  layers?: ParallaxLayer[];
  /** Main title shown on the middle layer */
  title?: string;
  /** Subtitle / kicker above the title */
  kicker?: string;
  /** Whether to enable global smooth scroll (Lenis). Default true. */
  smoothScroll?: boolean;
  /** Extra content below the parallax header */
  children?: React.ReactNode;
}

const DEFAULT_LAYERS: ParallaxLayer[] = [
  { layer: "1", src: heroImg, alt: "Shopia & Nathan – background" },
  { layer: "2", src: coverImg, alt: "Cover mid layer" },
  { layer: "3", title: "Shopia & Nathan" },
  { layer: "4", src: story2, alt: "Foreground detail" },
];

export function ParallaxScrolling({
  layers = DEFAULT_LAYERS,
  title = "Shopia & Nathan",
  kicker = "THE WEDDING OF",
  smoothScroll = true,
  children,
  className,
  ...props
}: ParallaxScrollingProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = rootRef.current?.querySelector(
      "[data-parallax-layers]",
    ) as HTMLElement | null;

    if (!triggerElement) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 0%",
        end: "100% 0%",
        scrub: true,
      },
    });

    const layerConfig = [
      { layer: "1", yPercent: 70 },
      { layer: "2", yPercent: 55 },
      { layer: "3", yPercent: 40 },
      { layer: "4", yPercent: 10 },
    ];

    layerConfig.forEach((layerObj, idx) => {
      const targets = triggerElement.querySelectorAll(
        `[data-parallax-layer="${layerObj.layer}"]`,
      );
      if (targets.length) {
        tl.to(
          targets,
          {
            yPercent: layerObj.yPercent,
            ease: "none",
          },
          idx === 0 ? undefined : "<",
        );
      }
    });

    let lenis: Lenis | null = null;
    if (smoothScroll && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.1,
      });

      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
        gsap.killTweensOf(triggerElement);
        gsap.ticker.remove(ticker);
        lenis?.destroy();
        gsap.ticker.lagSmoothing(500);
      };
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf(triggerElement);
    };
  }, [smoothScroll]);

  return (
    <div ref={rootRef} className={cn("parallax", className)} {...props}>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow" />
          <div data-parallax-layers className="parallax__layers">
            {layers.map((item, i) => {
              if (item.layer === "3" || item.title) {
                return (
                  <div
                    key={`layer-title-${i}`}
                    data-parallax-layer={item.layer}
                    className="parallax__layer-title"
                  >
                    {kicker && <p className="parallax__kicker">{kicker}</p>}
                    <h2 className="parallax__title">{item.title || title}</h2>
                  </div>
                );
              }
              if (item.src) {
                return (
                  <img
                    key={`layer-img-${item.layer}-${i}`}
                    src={item.src}
                    loading="eager"
                    width={1200}
                    height={1600}
                    data-parallax-layer={item.layer}
                    alt={item.alt || ""}
                    className="parallax__layer-img"
                  />
                );
              }
              return null;
            })}
          </div>
          <div className="parallax__fade" />
        </div>
      </section>

      {children ? (
        <section className="parallax__content">{children}</section>
      ) : null}
    </div>
  );
}

export default ParallaxScrolling;
