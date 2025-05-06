
import React, { useEffect, useRef } from 'react';

interface AnimatedGradientProps {
  className?: string;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Handle resize
    window.addEventListener('resize', setCanvasDimensions);
    setCanvasDimensions();

    // Create points
    const points: {x: number; y: number; vx: number; vy: number}[] = [];
    const createPoints = () => {
      const pointCount = Math.floor(canvas.width * canvas.height / 15000);
      for (let i = 0; i < pointCount; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }
    };
    createPoints();

    // Animation
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw points and connections
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        
        // Move point
        point.x += point.vx;
        point.y += point.vy;
        
        // Bounce off edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
        
        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 180, 216, 0.6)';
        ctx.fill();
        
        // Connect nearby points
        for (let j = i + 1; j < points.length; j++) {
          const otherPoint = points[j];
          const dx = point.x - otherPoint.x;
          const dy = point.y - otherPoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(otherPoint.x, otherPoint.y);
            ctx.strokeStyle = `rgba(0, 180, 216, ${(1 - distance / 100) * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`}
    />
  );
};

export default AnimatedGradient;
