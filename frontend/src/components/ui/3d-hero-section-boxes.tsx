"use client";

import React, { useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { ChevronRight, Github } from 'lucide-react';
import { Button } from '../shared/Button';
import { useAuthStore } from '../../stores/authStore.js';
import { toast } from '../shared/Toast';

function HeroSplineBackground() {
  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100vh',
      pointerEvents: 'auto',
      overflow: 'hidden',
      zIndex: 0
    }}>
      <Spline
        style={{
          width: '100%',
          height: '100vh',
          pointerEvents: 'auto',
        }}
        scene="https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode"
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: `
            linear-gradient(to right, var(--bg-primary) 0%, transparent 30%, transparent 70%, var(--bg-primary) 100%),
            linear-gradient(to bottom, var(--bg-primary) 0%, transparent 30%, var(--bg-primary) 100%)
          `,
          pointerEvents: 'none',
        }}
        className="opacity-90 dark:opacity-100"
      />
    </div>
  );
}

function ScreenshotSection({ screenshotRef }: { screenshotRef: React.RefObject<HTMLDivElement> }) {
  return (
    <section className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 mt-16 md:mt-24 pb-24">
      <div ref={screenshotRef} className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[var(--border)] w-full md:w-[90%] lg:w-[85%] mx-auto transform transition-all duration-700 hover:scale-[1.01]">
        <div className="flex items-center px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
        </div>
        <div className="relative aspect-[16/9] w-full bg-[var(--bg-code)] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
            alt="Code Explainer Interface"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-primary)]/10 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

export function HeroSection() {
  const screenshotRef = useRef<HTMLDivElement>(null);
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const handleLaunch = async () => {
    try {
      await login("developer@codeexplainer.org", "guestpass123");
      toast.success("Welcome to the sandbox!");
    } catch (err) {
      toast.error("Failed to launch sandbox.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-32 overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <HeroSplineBackground />
      
      {/* Theme Toggler (Top-Right) handled by AuthPage wrapper ideally, or we can just render here */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center flex flex-col items-center max-w-4xl">
        <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--bg-secondary)]/50 backdrop-blur-md px-3 py-1 text-sm font-medium mb-8 text-[var(--text-secondary)] shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-[var(--accent-primary)] mr-2 animate-pulse"></span>
          Introducing Code Explainer V2
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] mb-6 drop-shadow-sm">
          Understand Any Code <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-purple-500">
            In Seconds
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl leading-relaxed">
          AI-powered code analysis, translation, and optimization. 
          Stop struggling with legacy codebases and start building faster.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Button 
            size="lg" 
            disabled={isLoading}
            onClick={handleLaunch}
            className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-[var(--accent-primary)]/20 hover:shadow-[var(--accent-primary)]/40 hover:-translate-y-0.5 transition-all"
          >
            {isLoading ? "Launching..." : "Enter Sandbox"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-semibold border-2 border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-all">
            <Github className="mr-2 h-5 w-5" />
            View on GitHub
          </Button>
        </div>
      </div>

      <ScreenshotSection screenshotRef={screenshotRef} />
    </div>
  );
}

export default HeroSection;
