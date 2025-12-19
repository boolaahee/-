
import React, { useEffect, useRef } from 'react';

const SmokeParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 15 + 2;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = `hsla(${180 + Math.random() * 40}, 100%, 70%, ${this.alpha})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.05;
        this.alpha -= 0.002;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Gradually form a loose palm shape in the center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Randomly spawn around a "hand" silhouette
      if (particles.length < 150) {
        // Simple palm + 5 fingers logic
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 100;
        const px = centerX + Math.cos(angle) * radius;
        const py = centerY + Math.sin(angle) * radius;
        particles.push(new Particle(px, py));
      }

      particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default SmokeParticles;
