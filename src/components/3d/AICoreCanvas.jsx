import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// 3D Particles that pulse and form orbits
function NeuralNetwork({ count = 350, color = "#e5e7eb" }) {
  const pointsRef = useRef();
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 1.6 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  });

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.035}
        sizeAttenuation={true}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Interactive Holographic Core
function HolographicCore({ activeScene, mouse }) {
  const coreRef = useRef();
  const outerRingRef = useRef();
  const innerRingRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Core rotations & responsiveness to mouse
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.2 + mouse.current.x * 0.3;
      coreRef.current.rotation.x = time * 0.1 + mouse.current.y * 0.3;
      
      // Pulse scale gently
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      
      // Scale changes based on scroll storytelling active scene
      let targetScale = 1.0;
      if (activeScene === 0) targetScale = 1.0;
      else if (activeScene === 1) targetScale = 1.15; // Brain
      else if (activeScene === 2) targetScale = 0.9;  // Social
      else if (activeScene === 3) targetScale = 0.85; // Email
      else if (activeScene === 4) targetScale = 1.2;  // Product Description
      else if (activeScene === 5) targetScale = 1.0;  // Ads
      
      const speed = 0.08;
      coreRef.current.scale.x = THREE.MathUtils.lerp(coreRef.current.scale.x, targetScale * pulse, speed);
      coreRef.current.scale.y = THREE.MathUtils.lerp(coreRef.current.scale.y, targetScale * pulse, speed);
      coreRef.current.scale.z = THREE.MathUtils.lerp(coreRef.current.scale.z, targetScale * pulse, speed);
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -time * 0.3;
      outerRingRef.current.rotation.y = time * 0.15;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = time * 0.5;
      innerRingRef.current.rotation.x = -time * 0.2;
    }
  });

  // Get color based on scene
  const getCoreColor = () => {
    switch(activeScene) {
      case 1: return "#9ca3af"; // Brain - Gray
      case 2: return "#e5e7eb"; // Social - Light Gray
      case 3: return "#6b7280"; // Email - Med Gray
      case 4: return "#f9fafb"; // Product - White
      case 5: return "#9ca3af"; // Ads - Gray
      default: return "#e5e7eb"; // Hero - Light Gray
    }
  };

  return (
    <group>
      {/* Outer energy rings */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.5, 0.015, 8, 64]} />
        <meshBasicMaterial color={getCoreColor()} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.2, 0.01, 8, 64]} />
        <meshBasicMaterial color={getCoreColor()} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Main Glassmorphic Sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.8, 64, 64]} />
          <MeshDistortMaterial
            color={getCoreColor()}
            roughness={0.1}
            distort={0.4}
            speed={3}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function AICoreCanvas({ activeScene = 0 }) {
  const mouse = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 60 }}
        gl={{ alpha: true, antialias: !isMobile }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#9ca3af" />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#e5e7eb" />
        
        <HolographicCore activeScene={activeScene} mouse={mouse} />
        
        {/* Render fewer particles on mobile for performance */}
        <NeuralNetwork count={isMobile ? 120 : 350} color={activeScene === 1 ? "#9ca3af" : "#e5e7eb"} />
      </Canvas>
    </div>
  );
}
