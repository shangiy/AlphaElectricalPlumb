'use client';

import { useState, useEffect, useRef } from 'react';
import { getStorefrontSetting } from '@/app/actions/cms-actions';
import { cn } from '@/lib/utils';

/**
 * Utility to convert hex to rgba components for Canvas usage
 */
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 128, b: 141 }; // Default Teal
}

/**
 * Interactive Spider Web Background:
 * A high-performance HTML5 Canvas engine that renders reactive particles.
 */
function SpiderWebBackground({ color = "#00808d" }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rgb = hexToRgb(color);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let mouse = { x: null as number | null, y: null as number | null, radius: 180 };

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      init();
    };

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
        ctx.fill();
      }

      update() {
        if (this.x > canvas!.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas!.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particles = [];
      const numberOfParticles = (canvas!.width * canvas!.height) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * 2) + 1;
        const x = (Math.random() * ((canvas!.width - size * 2) - (size * 2)) + size * 2);
        const y = (Math.random() * ((canvas!.height - size * 2) - (size * 2)) + size * 2);
        const directionX = (Math.random() * 0.6) - 0.3;
        const directionY = (Math.random() * 0.6) - 0.3;

        particles.push(new Particle(x, y, directionX, directionY, size));
      }
    }

    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = (dx * dx) + (dy * dy);

          if (distance < (canvas!.width / 7) * (canvas!.height / 7)) {
            const opacityValue = 1 - (distance / 20000);
            ctx!.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacityValue * 0.15})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dxMouse = particles[a].x - mouse.x;
          const dyMouse = particles[a].y - mouse.y;
          const distanceMouse = (dxMouse * dxMouse) + (dyMouse * dyMouse);
          
          if (distanceMouse < mouse.radius * mouse.radius) {
            const opacityValue = 1 - (distanceMouse / (mouse.radius * mouse.radius));
            ctx!.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacityValue * 0.4})`;
            ctx!.lineWidth = 1.5;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [color, rgb.r, rgb.g, rgb.b]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none opacity-40 z-0"
    />
  );
}

export default function HomepageAbout() {
  const [content, setAboutContent] = useState({ text: '', alignment: 'center', fontSize: 'lg' });

  useEffect(() => {
    async function loadAbout() {
        const data = await getStorefrontSetting('about_us_content');
        if (data) setAboutContent(data);
    }
    loadAbout();
  }, []);

  const defaultText = "Alpha Electricals & Plumbing Ltd is committed to providing quality tanks, plumbing equipment, lighting, décor, and construction products across the region. Our platform serves as a resourceful destination for homeowners, contractors, and businesses seeking expert advice, innovative products, and reliable services.";

  return (
    <section className="relative bg-background py-32 border-y overflow-hidden group/about">
      {/* Interactive Particle Network Layer */}
      <SpiderWebBackground color="#00808d" />

      <div className={cn(
          "container mx-auto px-4 max-w-5xl relative z-10",
          content.alignment === 'center' ? 'text-center' : content.alignment === 'right' ? 'text-right' : 'text-left'
      )}>
        <h2 className="text-5xl font-black font-headline mb-10 text-accent tracking-tighter uppercase">About Us</h2>
        <div className={cn(
            "space-y-6 text-muted-foreground font-medium leading-relaxed",
            content.fontSize === 'xl' ? 'text-2xl' : content.fontSize === 'lg' ? 'text-xl' : content.fontSize === 'sm' ? 'text-sm' : 'text-base'
        )}>
            {content.text ? (
                content.text.split('\n').map((para, i) => <p key={i}>{para}</p>)
            ) : (
                <p>{defaultText}</p>
            )}
        </div>
        <div className={cn(
            "w-32 h-2 bg-primary/20 rounded-full mt-12",
            content.alignment === 'center' ? 'mx-auto' : content.alignment === 'right' ? 'ml-auto' : 'mr-auto'
        )} />
      </div>
    </section>
  );
}
