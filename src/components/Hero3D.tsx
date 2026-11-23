import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import type { Lang } from "@/types";
import { PRODUCTS } from "@/data/products";
import { makeT } from "@/i18n";
import { CanvasGuard } from "./CanvasGuard";

const GOLD = "#b39c4f";

/** one framed artwork: thin wood frame + canvas print */
function FramedArt({
  url,
  width = 1,
  height = 1.4,
  position,
  rotationY = 0,
  floatSpeed = 1.2,
}: {
  url: string;
  width?: number;
  height?: number;
  position: [number, number, number];
  rotationY?: number;
  floatSpeed?: number;
}) {
  const tex = useTexture(url);
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  }, [tex]);
  const frame = 0.045;
  const d = 0.05;
  return (
    <Float speed={floatSpeed} rotationIntensity={0.12} floatIntensity={0.9}>
      <group position={position} rotation={[0, rotationY, 0]}>
        {/* canvas print */}
        <mesh castShadow>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial map={tex} roughness={0.9} />
        </mesh>
        {/* frame */}
        {[
          { pos: [0, height / 2 + frame / 2, 0] as const, size: [width + frame * 2, frame, d] as const },
          { pos: [0, -height / 2 - frame / 2, 0] as const, size: [width + frame * 2, frame, d] as const },
          { pos: [-width / 2 - frame / 2, 0, 0] as const, size: [frame, height, d] as const },
          { pos: [width / 2 + frame / 2, 0, 0] as const, size: [frame, height, d] as const },
        ].map((b, i) => (
          <mesh key={i} position={[b.pos[0], b.pos[1], -d / 2]} castShadow>
            <boxGeometry args={[b.size[0], b.size[1], b.size[2]]} />
            <meshStandardMaterial color="#3a2e22" roughness={0.6} />
          </mesh>
        ))}
        {/* backing */}
        <mesh position={[0, 0, -d]}>
          <boxGeometry args={[width + frame * 2, height + frame * 2, 0.015]} />
          <meshStandardMaterial color="#241c14" roughness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

function GalleryRig({ lang }: { lang: Lang }) {
  const rig = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const featured = PRODUCTS.slice(0, 5);
  const positions: [number, number, number][] = useMemo(() => {
    const mirror = lang === "ar" ? -1 : 1;
    return [
      [-2.6 * mirror, 0.35, -1.2],
      [-1.15 * mirror, 0.95, -2.2],
      [0.25 * mirror, 0.15, -0.6],
      [1.7 * mirror, 0.8, -2.0],
      [2.9 * mirror, 0.2, -1.1],
    ];
  }, [lang]);

  useFrame((state, delta) => {
    pointer.current = state.pointer;
    if (rig.current) {
      const target = pointer.current.x * 0.22;
      rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, target, 2.2, delta);
    }
  });

  return (
    <group ref={rig}>
      {featured.map((p, i) => (
        <FramedArt
          key={p.slug}
          url={p.image}
          width={1.05}
          height={1.5}
          position={positions[i]}
          rotationY={(lang === "ar" ? 1 : -1) * (i - 2) * 0.16}
          floatSpeed={1 + i * 0.18}
        />
      ))}
    </group>
  );
}

export function Hero3D({
  lang,
  onBrowse,
  onTry3d,
}: {
  lang: Lang;
  onBrowse: () => void;
  onTry3d: () => void;
}) {
  const t = makeT(lang);
  const [ready, setReady] = useState(false);

  return (
    <section id="top" className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      {/* poster fallback until the first GPU frame */}
      {!ready && (
        <div className="absolute inset-0 flex items-end justify-center gap-3 px-4 pb-24 opacity-70 sm:gap-5" aria-hidden="true">
          {PRODUCTS.slice(0, 3).map((p, i) => (
            <img
              key={p.slug}
              src={p.image}
              alt=""
              className="w-28 border border-foreground/20 object-cover shadow-xl sm:w-40"
              style={{ aspectRatio: "2/3", transform: `translateY(${i * 14}px) rotate(${(i - 1) * 3}deg)` }}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0" aria-hidden="true">
        <CanvasGuard
          fallback={
            <div className="flex h-full items-end justify-center gap-3 px-4 pb-24 opacity-70 sm:gap-5">
              {PRODUCTS.slice(0, 3).map((p, i) => (
                <img
                  key={p.slug}
                  src={p.image}
                  alt=""
                  className="w-28 border border-foreground/20 object-cover shadow-xl sm:w-40"
                  style={{ aspectRatio: "2/3", transform: `translateY(${i * 14}px) rotate(${(i - 1) * 3}deg)` }}
                />
              ))}
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0.35, 5.2], fov: 42 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true }}
            flat
            onCreated={() => setReady(true)}
            frameloop={"always"}
          >
            <fog attach="fog" args={["#F8F7E5", 5.5, 10]} />
            <ambientLight intensity={0.85} />
            <directionalLight position={[4, 6, 5]} intensity={1.6} color="#fff2dd" />
            <directionalLight position={[-5, 2, -3]} intensity={0.4} color="#b39c4f" />
            <Suspense fallback={null}>
              <GalleryRig lang={lang} />
            </Suspense>
          </Canvas>
        </CanvasGuard>
      </div>

      {/* legibility scrim above the canvas, behind the copy */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[80%]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to top, hsl(60 33% 93% / 0.98) 25%, hsl(60 33% 93% / 0.9) 50%, hsl(60 33% 93% / 0.45) 75%, hsl(60 33% 93% / 0) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-10 pt-24 sm:px-6">
        <div className="fx-fade active max-w-2xl">
          <p className="label-spec mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-foreground/40" />
            {t("hero_kicker")}
          </p>
          <h1 className="text-[11vw] font-black leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
            {t("hero_title_1")}
            <br />
            <span className="italic" style={{ color: GOLD }}>
              {t("hero_title_2")}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed opacity-80 sm:text-base">
            {t("hero_sub")}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-gold" onClick={onBrowse}>
              {t("hero_cta")}
            </button>
            <button type="button" className="btn-ghost" onClick={onTry3d}>
              {t("hero_cta2")}
            </button>
          </div>

          <p className="label-spec mt-6 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="7" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="17.5" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {t("hero_note")}
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-5 sm:px-6">
        <div className="dotted-line" />
      </div>
    </section>
  );
}
