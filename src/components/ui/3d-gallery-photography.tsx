"use client";

/**
 * Galeri foto 3D (WebGL): foto melayang maju dari kejauhan, buram -> tajam -> memudar.
 * Diadaptasi dari komponen "3d-gallery-photography" dengan perubahan agar cocok untuk undangan:
 *  - Foto BISA DIKLIK / DIKETUK (onSelect) -> dipakai untuk membuka lightbox.
 *  - Tidak membajak scroll halaman: scroll halaman justru menambah kecepatan gerak foto.
 *  - Tanpa setState per frame (semua lewat ref), jadi ringan di HP.
 *  - Berhenti merender saat tidak terlihat, dan ada fallback grid jika WebGL tidak tersedia.
 */

import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

export type GalleryImage = { src: string; alt?: string };

interface InfiniteGalleryProps {
  images: GalleryImage[];
  /** Dipanggil dengan indeks foto (di array `images`) saat foto diklik/diketuk. */
  onSelect?: (index: number) => void;
  /** Jumlah foto yang beredar bersamaan. */
  visibleCount?: number;
  /** Kecepatan jalan otomatis (satuan dunia / detik). */
  autoSpeed?: number;
  className?: string;
  style?: CSSProperties;
}

/* ---------------- Parameter ruang ---------------- */
const FAR = 30; // posisi paling jauh dari kamera
const NEAR = 6; // posisi paling dekat sebelum foto menghilang
const RANGE = FAR - NEAR;
const MAX_W = 3.8;
const MAX_H = 4.8;
const MAX_BLUR = 7;
const CLICKABLE_OPACITY = 0.55;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

const VERTEX = /* glsl */ `
  uniform float scrollForce;
  uniform float time;
  uniform float isHovered;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Lengkung halus mengikuti kecepatan gerak
    float curveIntensity = scrollForce * 0.3;
    float distanceFromCenter = length(pos.xy);
    float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

    // Riak kain tipis
    float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
    float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
    float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

    // Efek bendera berkibar saat disentuh / di-hover
    float flagWave = 0.0;
    if (isHovered > 0.5) {
      float wavePhase = pos.x * 3.0 + time * 8.0;
      float dampening = smoothstep(-0.5, 0.5, pos.x);
      flagWave = sin(wavePhase) * 0.1 * dampening;
      flagWave += sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
    }

    pos.z -= (curve + clothEffect + flagWave);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D map;
  uniform float opacity;
  uniform float blurAmount;
  uniform float scrollForce;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(map, vUv);

    if (blurAmount > 0.01) {
      vec2 texel = vec2(1.0 / 512.0);
      vec4 blurred = vec4(0.0);
      float total = 0.0;
      for (float x = -2.0; x <= 2.0; x += 1.0) {
        for (float y = -2.0; y <= 2.0; y += 1.0) {
          vec2 offset = vec2(x, y) * texel * blurAmount;
          float weight = 1.0 / (1.0 + length(vec2(x, y)));
          blurred += texture2D(map, vUv + offset) * weight;
          total += weight;
        }
      }
      color = blurred / total;
    }

    color.rgb += vec3(abs(scrollForce) * 0.005);
    gl_FragColor = vec4(color.rgb, color.a * opacity);
  }
`;

function createMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      map: { value: null },
      opacity: { value: 0 },
      blurAmount: { value: 0 },
      scrollForce: { value: 0 },
      time: { value: 0 },
      isHovered: { value: 0 },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  });
}

/* ---------------- Posisi sebar (x,y) tiap foto ---------------- */
function spreadPositions(count: number) {
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const hAngle = (i * 2.618) % (Math.PI * 2);
    const vAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
    const hRadius = 0.7 + (i % 3) * 0.55;
    const vRadius = 0.6 + ((i + 1) % 4) * 0.4;
    out.push({
      x: Math.sin(hAngle) * hRadius * 2.4,
      y: Math.cos(vAngle) * vRadius * 1.5,
    });
  }
  return out;
}

interface PlaneState {
  /** 0 = paling jauh, RANGE = paling dekat */
  z: number;
  imageIndex: number;
}

function Scene({
  images,
  onSelect,
  visibleCount,
  autoSpeed,
}: {
  images: GalleryImage[];
  onSelect: ((index: number) => void) | undefined;
  visibleCount: number;
  autoSpeed: number;
}) {
  const total = images.length;
  const gl = useThree((s) => s.gl);
  const urls = useMemo(() => images.map((i) => i.src), [images]);
  const textures = useLoader(THREE.TextureLoader, urls);

  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createMaterial()),
    [visibleCount],
  );
  useEffect(
    () => () => {
      materials.forEach((m) => m.dispose());
    },
    [materials],
  );

  const spread = useMemo(() => spreadPositions(visibleCount), [visibleCount]);

  // Ukuran tiap foto (menjaga rasio asli, muat dalam kotak MAX_W x MAX_H)
  const sizes = useMemo(
    () =>
      textures.map((t) => {
        const img = t.image as { width?: number; height?: number } | undefined;
        const w = img?.width || 3;
        const h = img?.height || 4;
        const k = Math.min(MAX_W / w, MAX_H / h);
        return { w: w * k, h: h * k };
      }),
    [textures],
  );

  const planes = useRef<PlaneState[]>([]);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const velocity = useRef(0);

  // Inisialisasi / reset saat jumlah berubah
  useEffect(() => {
    planes.current = Array.from({ length: visibleCount }, (_, i) => ({
      z: (RANGE / visibleCount) * i,
      imageIndex: total > 0 ? i % total : 0,
    }));
  }, [visibleCount, total]);

  // Scroll halaman -> dorongan kecepatan (tanpa memblokir scroll)
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      velocity.current = clamp(velocity.current + dy * 0.035, -16, 16);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "pan-y";
    return () => {
      el.style.cursor = "";
    };
  }, [gl]);

  useFrame((state, delta) => {
    if (total === 0) return;
    const dt = Math.min(delta, 0.05);
    const aspect = state.size.width / Math.max(1, state.size.height);
    const xScale = clamp(aspect, 0.45, 1.1);
    const time = state.clock.getElapsedTime();

    velocity.current *= Math.exp(-dt * 2.6);
    const v = velocity.current;
    const force = clamp(v / 5, -2, 2);
    const advance = Math.max(0, visibleCount % total || total);

    planes.current.forEach((p, i) => {
      p.z += (autoSpeed + v) * dt;

      if (p.z >= RANGE) {
        const wraps = Math.floor(p.z / RANGE);
        p.z -= RANGE * wraps;
        p.imageIndex = (p.imageIndex + wraps * advance) % total;
      } else if (p.z < 0) {
        const wraps = Math.ceil(-p.z / RANGE);
        p.z += RANGE * wraps;
        p.imageIndex = (((p.imageIndex - wraps * advance) % total) + total) % total;
      }

      const mesh = meshes.current[i];
      const mat = materials[i];
      const tex = textures[p.imageIndex];
      const size = sizes[p.imageIndex];
      const pos = spread[i];
      if (!mesh || !mat || !tex || !size || !pos) return;

      const u = p.z / RANGE; // 0 jauh .. 1 dekat
      const opacity = smooth(0.0, 0.22, u) * (1 - smooth(0.8, 1.0, u));
      const blur =
        MAX_BLUR * (1 - smooth(0.04, 0.34, u)) + MAX_BLUR * 0.7 * smooth(0.86, 1.0, u);

      mesh.position.set(pos.x * xScale, pos.y, -FAR + u * RANGE);
      mesh.scale.set(size.w, size.h, 1);
      mesh.visible = opacity > 0.003;

      const uni = mat.uniforms as Record<string, THREE.IUniform>;
      if (uni["map"]!.value !== tex) uni["map"]!.value = tex;
      uni["opacity"]!.value = opacity;
      uni["blurAmount"]!.value = blur;
      uni["scrollForce"]!.value = force;
      uni["time"]!.value = time;
    });
  });

  if (total === 0) return null;

  const isClickable = (i: number) => {
    const m = materials[i];
    return !!m && (m.uniforms["opacity"]?.value as number) > CLICKABLE_OPACITY;
  };

  return (
    <>
      {Array.from({ length: visibleCount }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          material={materials[i]}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            if (!isClickable(i)) return;
            if (e.delta > 8) return; // seret/geser, bukan ketukan
            e.stopPropagation();
            const idx = planes.current[i]?.imageIndex;
            if (idx !== undefined) onSelect?.(idx);
          }}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            if (!isClickable(i)) return;
            e.stopPropagation();
            const m = materials[i];
            if (m) (m.uniforms["isHovered"] as THREE.IUniform).value = 1;
            gl.domElement.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            const m = materials[i];
            if (m) (m.uniforms["isHovered"] as THREE.IUniform).value = 0;
            gl.domElement.style.cursor = "";
          }}
        >
          <planeGeometry args={[1, 1, 24, 24]} />
        </mesh>
      ))}
    </>
  );
}

/* ---------------- Fallback tanpa WebGL / saat gagal memuat ---------------- */
function FallbackGrid({
  images,
  onSelect,
}: {
  images: GalleryImage[];
  onSelect: ((index: number) => void) | undefined;
}) {
  return (
    <div className="h-full w-full overflow-y-auto px-4 pb-28 pt-40" data-lenis-prevent>
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
        {images.map((img, i) => (
          <button
            key={`${img.src}-${i}`}
            type="button"
            onClick={() => onSelect?.(i)}
            aria-label={img.alt ? `Perbesar foto: ${img.alt}` : `Perbesar foto ${i + 1}`}
            className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10"
          >
            <img src={img.src} alt={img.alt || ""} loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(err: unknown) {
    console.warn("Galeri 3D gagal dimuat, memakai tampilan biasa:", err);
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function InfiniteGallery({
  images,
  onSelect,
  visibleCount = 9,
  autoSpeed = 1.5,
  className = "h-96 w-full",
  style,
}: InfiniteGalleryProps) {
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [active, setActive] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebgl(hasWebGL());
    setMounted(true);
  }, []);

  // Hentikan render saat galeri di luar layar (hemat baterai)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setActive(!!e?.isIntersecting), {
      rootMargin: "120px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fallback = <FallbackGrid images={images} onSelect={onSelect} />;

  return (
    <div ref={wrapRef} className={className} style={style}>
      {!mounted ? null : !webgl ? (
        fallback
      ) : (
        <Boundary fallback={fallback}>
          <Canvas
            frameloop={active ? "always" : "never"}
            dpr={[1, 1.75]}
            camera={{ position: [0, 0, 0], fov: 55, near: 0.1, far: 80 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Scene
              images={images}
              onSelect={onSelect}
              visibleCount={visibleCount}
              autoSpeed={autoSpeed}
            />
          </Canvas>
        </Boundary>
      )}
    </div>
  );
}
