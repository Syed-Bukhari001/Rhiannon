import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { asset } from "../utils/assets.js";

const clamp01 = (value) => THREE.MathUtils.clamp(value, 0, 1);

function buildTerrain() {
  const geometry = new THREE.PlaneGeometry(18, 24, 90, 120);
  const position = geometry.attributes.position;

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const ridge =
      Math.sin(x * 1.4) * 0.45 +
      Math.cos(y * 0.65) * 0.75 +
      Math.sin((x + y) * 0.85) * 0.32;
    const valley = Math.max(0, 1.2 - Math.abs(x * 0.25 + y * 0.08));
    position.setZ(index, ridge + valley * 0.45);
  }

  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function Terrain() {
  const geometry = useMemo(buildTerrain, []);

  return (
    <mesh geometry={geometry} position={[0, -2.2, -1.3]}>
      <meshStandardMaterial
        color="#1f3328"
        roughness={0.96}
        metalness={0.02}
        emissive="#09120d"
        emissiveIntensity={0.16}
      />
    </mesh>
  );
}

function TrailPath({ progress, reducedMotion }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.8, -1.2, 6.3),
        new THREE.Vector3(-2.4, -1.0, 3.9),
        new THREE.Vector3(0.3, -0.8, 2.1),
        new THREE.Vector3(-0.9, -0.35, 0.2),
        new THREE.Vector3(1.8, 0.1, -1.8),
        new THREE.Vector3(0.5, 0.45, -4.1),
        new THREE.Vector3(3.7, 0.9, -6.3),
      ]),
    [],
  );
  const baseGeometry = useMemo(() => new THREE.TubeGeometry(curve, 120, 0.034, 10, false), [curve]);
  const routeProgress = clamp01(progress * 1.18 + 0.06);
  const activeStep = Math.max(10, Math.round(routeProgress * 96));
  const activeGeometry = useMemo(() => {
    const activeCurve = new THREE.CatmullRomCurve3(curve.getSpacedPoints(activeStep));
    return new THREE.TubeGeometry(activeCurve, Math.max(18, activeStep), 0.058, 12, false);
  }, [activeStep, curve]);
  const markerPoints = useMemo(
    () =>
      curve.getPoints(6).slice(1, 6).map((point, index) => ({
        point,
        threshold: (index + 1) / 6,
      })),
    [curve],
  );
  const pulsePoint = useMemo(() => curve.getPoint(routeProgress), [curve, routeProgress]);

  return (
    <group>
      <mesh geometry={baseGeometry}>
        <meshStandardMaterial color="#f3d7a6" opacity={0.2} transparent roughness={0.6} />
      </mesh>
      <mesh geometry={activeGeometry}>
        <meshStandardMaterial
          color="#f2a85e"
          emissive="#f1a45c"
          emissiveIntensity={0.8 + progress * 0.85}
          roughness={0.38}
        />
      </mesh>
      <Float speed={reducedMotion ? 0 : 1.8} rotationIntensity={0.08} floatIntensity={reducedMotion ? 0 : 0.24}>
        <mesh position={pulsePoint}>
          <sphereGeometry args={[0.16, 28, 28]} />
          <meshStandardMaterial color="#fff4dc" emissive="#f6a75b" emissiveIntensity={1.2} />
        </mesh>
      </Float>
      {markerPoints.map(({ point, threshold }, index) => {
        const active = routeProgress >= threshold ? 1 : 0;

        return (
          <Float
            key={point.x}
            speed={reducedMotion ? 0 : 1.2 + index * 0.2}
            rotationIntensity={0.12}
            floatIntensity={reducedMotion ? 0 : 0.18}
          >
            <mesh position={point}>
              <sphereGeometry args={[0.13 + active * 0.035, 24, 24]} />
              <meshStandardMaterial
                color={active ? "#fff3d7" : "#c9d2c4"}
                emissive="#d98643"
                emissiveIntensity={0.22 + active * 0.62}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function RidgeCards({ progress, reducedMotion }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y = -0.24 + progress * 0.3;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
  });

  return (
    <group ref={group} position={[3.8, 1.25, -1.9]} rotation={[0.08, -0.32, -0.05]}>
      {[
        ["#f5ecdd", 0, 0, 0],
        ["#d7e7e6", -0.35, -0.55, 0.18],
        ["#f0d4b4", 0.28, -1.06, 0.32],
      ].map(([color, x, y, z], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0, 0, -0.08 + index * 0.07]}>
          <boxGeometry args={[1.45, 0.82, 0.035]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function ExpeditionPostcards({ progress, reducedMotion }) {
  const group = useRef(null);
  const textures = useTexture([
    asset("assets/trip-greece.png"),
    asset("assets/trip-georgia.png"),
    asset("assets/group-sunset.png"),
  ]);

  useMemo(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 6;
    });
  }, [textures]);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    group.current.position.x = -3.5 + progress * 0.7;
    group.current.rotation.y = 0.34 - progress * 0.38;
    group.current.position.y = 1.08 + Math.sin(state.clock.elapsedTime * 0.42) * 0.08;
  });

  const cards = [
    { position: [0, 0.16, 0], rotation: [0.06, 0.18, -0.12], scale: 1 },
    { position: [0.64, -0.52, -0.28], rotation: [-0.02, -0.14, 0.09], scale: 0.86 },
    { position: [-0.58, -0.9, -0.44], rotation: [0.04, 0.24, -0.04], scale: 0.78 },
  ];

  return (
    <group ref={group} position={[-3.5, 1.08, -1.25]} rotation={[0.04, 0.34, 0.05]}>
      {cards.map((card, index) => (
        <Float
          key={textures[index].uuid}
          speed={reducedMotion ? 0 : 1 + index * 0.18}
          rotationIntensity={reducedMotion ? 0 : 0.08}
          floatIntensity={reducedMotion ? 0 : 0.16}
        >
          <group position={card.position} rotation={card.rotation} scale={card.scale}>
            <mesh position={[0, 0, -0.028]}>
              <boxGeometry args={[1.68, 1.12, 0.04]} />
              <meshStandardMaterial color="#f6f1e8" roughness={0.82} />
            </mesh>
            <mesh>
              <planeGeometry args={[1.52, 0.96]} />
              <meshStandardMaterial map={textures[index]} roughness={0.74} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
}

function SceneRig({ progress, reducedMotion }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (reducedMotion) return;
    cameraTarget.set(
      THREE.MathUtils.lerp(-1.55, 1.2, progress) + Math.sin(progress * Math.PI) * 0.8,
      THREE.MathUtils.lerp(5.25, 3.25, progress),
      THREE.MathUtils.lerp(10.6, 5.6, progress),
    );
    target.set(THREE.MathUtils.lerp(-0.7, 0.7, progress), -0.62 + progress * 0.24, -0.8 - progress * 2.2);
    camera.position.lerp(cameraTarget, 0.05);
    camera.fov = THREE.MathUtils.lerp(camera.fov, 52 - progress * 5, 0.04);
    camera.updateProjectionMatrix();
    camera.lookAt(target);
  });

  return null;
}

function TrailWorld({ progress, reducedMotion }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y = -0.16 + progress * 0.48 + Math.sin(state.clock.elapsedTime * 0.16) * 0.015;
    group.current.rotation.x = -0.04 + progress * 0.08;
  });

  return (
    <>
      <fog attach="fog" args={["#07100d", 8, 17]} />
      <ambientLight intensity={0.38} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} />
      <pointLight position={[-3, 2, 3]} intensity={0.8} color="#d98643" />
      <pointLight position={[2.5, 1.4, -3.8]} intensity={0.65 + progress * 0.55} color="#83c3c8" />
      <group ref={group}>
        <Terrain />
        <TrailPath progress={progress} reducedMotion={reducedMotion} />
        <RidgeCards progress={progress} reducedMotion={reducedMotion} />
        <ExpeditionPostcards progress={progress} reducedMotion={reducedMotion} />
        <Sparkles
          count={44}
          scale={[8, 2.2, 8]}
          size={2}
          speed={0.12}
          color="#f0c086"
          opacity={0.36}
          position={[0, 1.3, -1]}
        />
      </group>
      <SceneRig progress={progress} reducedMotion={reducedMotion} />
    </>
  );
}

export function TrailScene({ progress = 0, reducedMotion = false }) {
  return (
    <Canvas
      className="trail-scene"
      dpr={[1, 1.5]}
      camera={{ position: [0, 3.8, 8.7], fov: 48, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <TrailWorld progress={progress} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
