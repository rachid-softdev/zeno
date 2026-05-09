import { useEffect, useRef } from 'react';

// Animated mesh gradient canvas for the landing hero
export function MeshGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', handleMouse);

    // Animated blobs
    const blobs = [
      { x: 0.3, y: 0.4, r: 300, color: '59, 130, 246', speed: 0.0003, amp: 80 },
      { x: 0.7, y: 0.3, r: 250, color: '139, 92, 246', speed: 0.0004, amp: 60 },
      { x: 0.5, y: 0.6, r: 350, color: '16, 185, 129', speed: 0.00025, amp: 100 },
      { x: 0.2, y: 0.7, r: 200, color: '59, 130, 246', speed: 0.00035, amp: 70 },
    ];

    const animate = () => {
      time += 1;
      const { width, height } = canvas;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, width, height);

      // Dark base
      ctx.fillStyle = '#080B10';
      ctx.fillRect(0, 0, width, height);

      // Render blobs
      blobs.forEach((blob) => {
        const parallaxX = (mx - 0.5) * 60;
        const parallaxY = (my - 0.5) * 60;
        const cx = blob.x * width + Math.sin(time * blob.speed) * blob.amp + parallaxX;
        const cy = blob.y * height + Math.cos(time * blob.speed * 1.3) * blob.amp + parallaxY;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, blob.r);
        gradient.addColorStop(0, `rgba(${blob.color}, 0.15)`);
        gradient.addColorStop(0.5, `rgba(${blob.color}, 0.05)`);
        gradient.addColorStop(1, 'rgba(8, 11, 16, 0)');

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(cx, cy, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Scan lines overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}
