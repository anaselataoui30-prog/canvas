import { Suspense, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox, useTexture } from "@react-three/drei";
import type { Lang, Product } from "@/types";
import { PRODUCTS, sizeLabel } from "@/data/products";
import { makeT } from "@/i18n";
import { Rise } from "./ProductCard";
import { CanvasGuard } from "./CanvasGuard";

const WALL_COLORS = [
  { name: "Cream", hex: "#F8F7E5" },
  { name: "Terracotta", hex: "#c17a56" },
  { name: "Sage", hex: "#a9b39a" },
  { name: "Charcoal", hex: "#3c3a36" },
] as const;

/** framed canvas print hung on a wall (1 three.js unit = 1 meter) */
function WallCanvas({
  url,
  wM,
  hM,
  wallZ,
}: {
  url: string;
  wM: number;
  hM: number;
  wallZ: number;
}) {
  const tex = useTexture(url);
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  }, [tex]);
  const frame = 0.035;
  const y = 1.62; // hanging center height
  return (
    <group position={[0, y, wallZ + 0.03]}>
      <mesh castShadow>
        <planeGeometry args={[wM, hM]} />
        <meshStandardMaterial map={tex} roughness={0.92} />
      </mesh>
      {/* wood frame */}
      {[
        { p: [0, hM / 2 + frame / 2, -0.015] as const, s: [wM + frame * 2, frame, 0.045] as const },
        { p: [0, -hM / 2 - frame / 2, -0.015] as const, s: [wM + frame * 2, frame, 0.045] as const },
        { p: [-wM / 2 - frame / 2, 0, -0.015] as const, s: [frame, hM, 0.045] as const },
        { p: [wM / 2 + frame / 2, 0, -0.015] as const, s: [frame, hM, 0.045] as const },
      ].map((b, i) => (
        <mesh key={i} position={[b.p[0], b.p[1], b.p[2]]} castShadow>
          <boxGeometry args={[b.s[0], b.s[1], b.s[2]]} />
          <meshStandardMaterial color="#2e2419" roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

/** simple parametric two-seat sofa (procedural, cream linen look) */
function Sofa({ position }: { position: [number, number, number] }) {
  const linen = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#e9e2cf", roughness: 0.95 }),
    []
  );
  const wood = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#5c4632", roughness: 0.5 }),
    []
  );
  return (
    <group position={position}>
      <RoundedBox args={[2.1, 0.28, 0.85]} radius={0.05} position={[0, 0.36, 0]} castShadow receiveShadow material={linen} />
      <RoundedBox args={[0.98, 0.16, 0.78]} radius={0.06} position={[-0.52, 0.56, 0.02]} castShadow material={linen} />
      <RoundedBox args={[0.98, 0.16, 0.78]} radius={0.06} position={[0.52, 0.56, 0.02]} castShadow material={linen} />
      <RoundedBox args={[2.1, 0.62, 0.22]} radius={0.06} position={[0, 0.72, -0.34]} castShadow material={linen} />
      <RoundedBox args={[0.24, 0.55, 0.85]} radius={0.06} position={[-1.05, 0.5, 0]} castShadow material={linen} />
      <RoundedBox args={[0.24, 0.55, 0.85]} radius={0.06} position={[1.05, 0.5, 0]} castShadow material={linen} />
      {([[-0.9, 0.35, -0.3], [0.9, 0.35, -0.3], [-0.9, 0.35, 0.3], [0.9, 0.35, 0.3]] as const).map((p, i) => (
        <mesh key={i} position={[p[0], p[1] - 0.22, p[2]]} castShadow material={wood}>
          <cylinderGeometry args={[0.03, 0.024, 0.22, 10]} />
        </mesh>
      ))}
    </group>
  );
}

/** floor vase for life */
function Vase({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.19, 0.6, 20]} />
        <meshStandardMaterial color="#b5552d" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.032, 0.3, 10]} />
        <meshStandardMaterial color="#6b7d4f" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Room({
  product,
  sizeId,
  wallColor,
}: {
  product: Product;
  sizeId: string;
  wallColor: string;
}) {
  const size = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[1];
  const wM = size.w / 100;
  const hM = size.h / 100;
  const floorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d8c9ac", roughness: 0.9 }),
    []
  );
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.5]} receiveShadow material={floorMat}>
        <planeGeometry args={[8, 8]} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 1.6, -1]} receiveShadow>
        <planeGeometry args={[8, 3.4]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>
      {/* side wall */}
      <mesh position={[-3.2, 1.6, 1.5]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 3.4]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      <WallCanvas url={product.image} wM={wM} hM={hM} wallZ={-1} />
      <Sofa position={[0, 0, -0.25]} />
      <Vase position={[-1.85, 0, -0.55]} />

      {/* warm window light */}
      <ambientLight intensity={0.55} color="#fff6e8" />
      <directionalLight
        position={[3.5, 4, 4]}
        intensity={1.7}
        color="#ffe9c4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-2.5, 2.2, 2]} intensity={6} color="#ffd9a0" distance={8} />
    </group>
  );
}

export function WallPreview({
  lang,
  product,
  onSelect,
}: {
  lang: Lang;
  product: Product;
  onSelect: (p: Product) => void;
}) {
  const t = makeT(lang);
  const [sizeId, setSizeId] = useState("m");
  const [wallColor, setWallColor] = useState<string>(WALL_COLORS[0].hex);
  const [ready, setReady] = useState(false);

  return (
    <section id="preview" className="scroll-mt-14 bg-foreground py-14 text-background sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Rise>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t("wall_title")}</h2>
              <p className="mt-2 max-w-lg text-[15px] opacity-70">{t("wall_sub")}</p>
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {[product, ...[...shuffle(product.slug)]].map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => onSelect(p)}
                  aria-pressed={p.slug === product.slug}
                  className={`h-16 w-11 shrink-0 cursor-pointer overflow-hidden border transition-all ${
                    p.slug === product.slug
                      ? "border-primary opacity-100"
                      : "border-background/25 opacity-45 hover:opacity-80"
                  }`}
                  aria-label={p.name[lang]}
                >
                  <img src={p.image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </Rise>

        <Rise>
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-background/20 sm:aspect-[16/9]">
            {!ready && (
              <img
                src={product.image}
                alt={product.name[lang]}
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />
            )}
            <div className="absolute inset-0" aria-hidden="true">
              <CanvasGuard
                fallback={
                  <img
                    src={product.image}
                    alt={product.name[lang]}
                    className="h-full w-full object-cover opacity-60"
                  />
                }
              >
                <Canvas
                  camera={{ position: [0, 1.45, 3.4], fov: 40 }}
                  dpr={[1, 1.75]}
                  gl={{ antialias: true }}
                  flat
                  shadows
                  onCreated={() => setReady(true)}
                >
                  <Suspense fallback={null}>
                    <Room product={product} sizeId={sizeId} wallColor={wallColor} />
                  </Suspense>
                  <OrbitControls
                    target={[0, 1.3, -0.6]}
                    minDistance={1.6}
                    maxDistance={5.5}
                    minPolarAngle={0.55}
                    maxPolarAngle={1.52}
                    enablePan={false}
                  />
                </Canvas>
              </CanvasGuard>
            </div>
          </div>
        </Rise>

        <Rise className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5">
            <div>
              <p className="label-spec mb-2 !text-background/50">{t("size_label")}</p>
              <div className="flex border border-background/25">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={sizeId === s.id}
                    onClick={() => setSizeId(s.id)}
                    className={`cursor-pointer px-4 py-2.5 text-[13px] font-bold transition-colors ${
                      sizeId === s.id ? "bg-primary text-primary-foreground" : "hover:bg-background/10"
                    }`}
                  >
                    {sizeLabel(s, t("inch"))}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label-spec mb-2 !text-background/50">{t("wall_color")}</p>
              <div className="flex gap-2.5" role="group" aria-label={t("wall_color")}>
                {WALL_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setWallColor(c.hex)}
                    aria-pressed={wallColor === c.hex}
                    aria-label={c.name}
                    className="h-9 w-9 cursor-pointer border-2 transition-transform"
                    style={{
                      backgroundColor: c.hex,
                      borderColor: wallColor === c.hex ? "#b39c4f" : "rgba(248,247,229,0.3)",
                      transform: wallColor === c.hex ? "scale(1.12)" : "none",
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-lg font-bold">
              {product.name[lang]}
              <span className="mx-2 opacity-40">·</span>
              <span style={{ color: "#d8bc72" }}>
                {(product.sizes.find((s) => s.id === sizeId)?.price ?? 0)} {lang === "ar" ? "د.م." : "MAD"}
              </span>
            </p>
          </div>
        </Rise>
      </div>
    </section>
  );
}

/** deterministic mini-rotation of other products */
function shuffle(current: string): Product[] {
  return PRODUCTS.filter((p) => p.slug !== current).slice(0, 6);
}
