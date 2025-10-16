import { ThemeProvider } from "@/context/ThemeContext";
import Particles from "@/components/common/Particles";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark relative p-6 bg-black z-1 sm:p-0">
      <ThemeProvider>
        <div className="relative flex w-full h-screen justify-center items-center bg-black overflow-hidden">
          {/* Particle Background */}
          <Particles
            particleColors={['#ffffff', '#e0e0e0', '#c0c0c0']}
            particleCount={150}
            particleSpread={8}
            speed={0.05}
            particleBaseSize={80}
            moveParticlesOnHover={true}
            particleHoverFactor={0.5}
            alphaParticles={true}
            sizeRandomness={0.8}
            disableRotation={false}
          />
          {/* Login Form */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
