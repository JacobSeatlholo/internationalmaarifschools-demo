"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

export type ModelKey = "molecule" | "gears" | "solids";

interface PartInfo {
  name: string;
  detail: string;
}

const PART_INFO: Record<ModelKey, PartInfo[]> = {
  molecule: [
    { name: "Carbon (C)", detail: "Atomic number 6. Central atom of organic chemistry — four covalent bonds arranged in a tetrahedron at 109.5°." },
    { name: "Hydrogen (H)", detail: "Atomic number 1. Shares one electron with carbon, forming the strongest single-bond network in nature." },
    { name: "Covalent bond", detail: "A shared electron pair. Bond enthalpy ≈ 413 kJ/mol — the energy Grade 10 learns to calculate." },
  ],
  gears: [
    { name: "Drive gear", detail: "Input torque source. 12 teeth — gear ratio sets speed vs. force trade-off." },
    { name: "Idle gear", detail: "18 teeth. Transmits rotation and reverses direction between drive and output." },
    { name: "Output gear", detail: "24 teeth. 2:1 reduction — halves speed, doubles torque. Mechanical advantage in action." },
  ],
  solids: [
    { name: "Tetrahedron", detail: "4 faces, 4 vertices, 6 edges. Euler's formula: V − E + F = 2 — always." },
    { name: "Cube (hexahedron)", detail: "6 faces, 8 vertices, 12 edges. The only platonic solid that tessellates 3D space." },
    { name: "Icosahedron", detail: "20 triangular faces. Found in viruses, geodesic domes and footballs." },
  ],
};

function Molecule({ explode, onSelect }: { explode: number; onSelect: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const bonds = useMemo(() => {
    // tetrahedral directions
    const dirs: [number, number, number][] = [
      [1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1],
    ];
    return dirs.map((d) => new THREE.Vector3(...d).normalize());
  }, []);
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.35;
  });
  const dist = 1.6 + explode * 1.8;
  return (
    <group ref={group}>
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(0); }}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.55} roughness={0.25} emissive="#3d2f08" />
      </mesh>
      {bonds.map((d, i) => {
        const pos = d.clone().multiplyScalar(dist);
        const mid = pos.clone().multiplyScalar(0.5);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
        return (
          <group key={i}>
            <mesh position={mid.toArray()} quaternion={quat} onClick={(e) => { e.stopPropagation(); onSelect(2); }}>
              <cylinderGeometry args={[0.13, 0.13, dist, 12]} />
              <meshStandardMaterial color="#8fa3b5" metalness={0.4} roughness={0.4} />
            </mesh>
            <mesh position={pos.toArray()} onClick={(e) => { e.stopPropagation(); onSelect(1); }}>
              <sphereGeometry args={[0.38, 24, 24]} />
              <meshStandardMaterial color="#e8eef4" metalness={0.2} roughness={0.35} emissive="#16283a" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Gear({ teeth, radius, position, speed, color, offset = 0, onSelect }: {
  teeth: number; radius: number; position: [number, number, number];
  speed: number; color: string; offset?: number; onSelect?: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * speed + offset;
  });
  const toothGeo = useMemo(() => new THREE.BoxGeometry(0.16, 0.2, 0.34), []);
  const toothPositions = useMemo(() => {
    return Array.from({ length: teeth }, (_, i) => {
      const a = (i / teeth) * Math.PI * 2;
      return [Math.cos(a) * (radius + 0.08), Math.sin(a) * (radius + 0.08), 0] as [number, number, number];
    });
  }, [teeth, radius]);
  return (
    <group ref={ref} position={position}>
      <mesh onClick={(e) => { e.stopPropagation(); onSelect?.(); }}>
        <cylinderGeometry args={[radius, radius, 0.3, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius * 0.28, radius * 0.28, 0.36, 16]} />
        <meshStandardMaterial color="#0f2537" metalness={0.7} roughness={0.2} />
      </mesh>
      {toothPositions.map((p, i) => (
        <mesh key={i} position={p} rotation={[Math.PI / 2, 0, (i / teeth) * Math.PI * 2]} geometry={toothGeo}>
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function GearTrain({ explode, onSelect }: { explode: number; onSelect: (i: number) => void }) {
  const gap = explode * 1.2;
  return (
    <group rotation={[0.35, 0, 0]}>
      <Gear teeth={12} radius={0.9} position={[-2.2 - gap, 0, 0]} speed={1.4} color="#d4af37" onSelect={() => onSelect(0)} />
      <Gear teeth={18} radius={1.35} position={[0.4, 0, gap * 0.5]} speed={-0.93} color="#10b981" onSelect={() => onSelect(1)} />
      <Gear teeth={24} radius={1.8} position={[3.4 + gap * 1.6, 0, gap]} speed={0.7} color="#5b8db8" onSelect={() => onSelect(2)} />
    </group>
  );
}

function Solids({ explode, onSelect }: { explode: number; onSelect: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.3;
  });
  const gap = explode * 2.2;
  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.6}>
        <mesh position={[-2.6 - gap, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelect(0); }}>
          <tetrahedronGeometry args={[0.95]} />
          <meshStandardMaterial color="#d4af37" metalness={0.5} roughness={0.25} wireframe={false} flatShading />
        </mesh>
        <mesh position={[-2.6 - gap, 0, 0]}>
          <tetrahedronGeometry args={[0.96]} />
          <meshBasicMaterial color="#e8cf7a" wireframe />
        </mesh>
      </Float>
      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelect(1); }}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#10b981" metalness={0.45} roughness={0.3} flatShading />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.52, 1.52, 1.52]} />
          <meshBasicMaterial color="#7ff0c8" wireframe />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.7} floatIntensity={0.7}>
        <mesh position={[2.6 + gap, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelect(2); }}>
          <icosahedronGeometry args={[1.1]} />
          <meshStandardMaterial color="#5b8db8" metalness={0.5} roughness={0.25} flatShading />
        </mesh>
        <mesh position={[2.6 + gap, 0, 0]}>
          <icosahedronGeometry args={[1.12]} />
          <meshBasicMaterial color="#a8d0f0" wireframe />
        </mesh>
      </Float>
    </group>
  );
}

const MODELS: { key: ModelKey; label: string; subject: string; blurb: string }[] = [
  { key: "molecule", label: "Methane Molecule", subject: "Chemistry", blurb: "Rotate, explode and inspect the tetrahedral geometry of CH₄ — bond angles, covalent bonding and molecular shape." },
  { key: "gears", label: "Gear Train", subject: "Physics & Mechanics", blurb: "Drive ratios, torque multiplication and rotational direction — mechanical systems, live in 3D." },
  { key: "solids", label: "Platonic Solids", subject: "Mathematics", blurb: "The five perfect solids: faces, vertices, edges and Euler's formula, rendered as objects you can hold." },
];

export function StemLab() {
  const [model, setModel] = useState<ModelKey>("molecule");
  const [explode, setExplode] = useState(0.25);
  const [info, setInfo] = useState<PartInfo | null>(null);

  const showInfo = (idx: number) => setInfo(PART_INFO[model][idx] ?? null);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="relative h-[420px] sm:h-[520px] overflow-hidden rounded-2xl border border-navy/10 bg-gradient-to-b from-navy-deep to-navy shadow-xl">
        <Canvas
          camera={{ position: [0, 1.4, 7.2], fov: 46 }}
          dpr={[1, 2]}
          onPointerMissed={() => setInfo(null)}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 8, 4]} intensity={1.35} color="#fff4d6" />
          <pointLight position={[-6, -4, -4]} intensity={0.5} color="#10b981" />
          {model === "molecule" && <Molecule explode={explode} onSelect={showInfo} />}
          {model === "gears" && <GearTrain explode={explode} onSelect={showInfo} />}
          {model === "solids" && <Solids explode={explode} onSelect={showInfo} />}
          <OrbitControls enablePan={false} minDistance={4.2} maxDistance={11} makeDefault />
        </Canvas>

        {/* Interaction hint (DOM overlay, avoids drei Html root race) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <div className="select-none whitespace-nowrap rounded-full bg-white/10 px-4 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
            Drag to rotate · Pinch/scroll to zoom · Tap parts to inspect
          </div>
        </div>

        {/* Inspect panel */}
        {info && (
          <div className="absolute left-4 top-4 max-w-[280px] rounded-xl glass-dark p-4 text-white shadow-2xl animate-in fade-in slide-in-from-left-2">
            <div className="text-[11px] font-bold uppercase tracking-widest text-gold">Inspecting</div>
            <div className="mt-1 font-serif text-lg font-bold">{info.name}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-white/75">{info.detail}</p>
            <button onClick={() => setInfo(null)} className="mt-2 text-[11px] text-gold-soft underline underline-offset-2">
              Close
            </button>
          </div>
        )}
      </div>

      {/* Control panel */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Choose a construct</div>
          <div className="mt-3 space-y-2">
            {MODELS.map((m) => (
              <button
                key={m.key}
                onClick={() => { setModel(m.key); setInfo(null); }}
                className={`w-full rounded-xl border p-3 text-left transition-all ${
                  model === m.key
                    ? "border-gold bg-gold/10 shadow-sm"
                    : "border-border hover:border-gold/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{m.label}</span>
                  <span className="rounded-full bg-navy/5 px-2 py-0.5 text-[10px] font-semibold text-navy">{m.subject}</span>
                </div>
                {model === m.key && <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{m.blurb}</p>}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">Exploded view</span>
            <span className="text-xs font-mono text-muted-foreground">{Math.round(explode * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={explode}
            onChange={(e) => setExplode(parseFloat(e.target.value))}
            className="mt-3 w-full accent-gold"
            aria-label="Explode amount"
          />
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Slide to deconstruct the model — exactly how our learners dissect systems in the STREAM lab,
            then put them back together with understanding.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StemLab;
