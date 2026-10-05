import React, { useRef, useState, useEffect } from 'react';
import { 
  Pen, Highlighter, Eraser, RotateCcw, 
  Check, Palette, Sparkles, X
} from 'lucide-react';
import { DoodleElement } from '../types/scrapbook';

interface DoodleCanvasProps {
  width: number;
  height: number;
  onSaveDoodle: (doodle: Omit<DoodleElement, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  partner: 'user1' | 'user2';
}

export const DoodleCanvas: React.FC<DoodleCanvasProps> = ({
  width,
  height,
  onSaveDoodle,
  onClose,
  partner,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pen' | 'pencil' | 'marker' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#5c202e'); // burgundy default
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<{ points: { x: number; y: number }[]; color: string; width: number; tool: string }[]>([]);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);

  // Predefined cute doodle stamps
  const addQuickDoodleShape = (shape: 'heart' | 'star' | 'squiggle' | 'sparkle') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (shape === 'heart') {
      ctx.beginPath();
      ctx.moveTo(cx, cy + 20);
      ctx.bezierCurveTo(cx - 30, cy - 20, cx - 60, cy + 20, cx, cy + 50);
      ctx.bezierCurveTo(cx + 60, cy + 20, cx + 30, cy - 20, cx, cy + 20);
      ctx.stroke();
    } else if (shape === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * 35 + cx, -Math.sin((18 + i * 72) * Math.PI / 180) * 35 + cy);
        ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * 15 + cx, -Math.sin((54 + i * 72) * Math.PI / 180) * 15 + cy);
      }
      ctx.closePath();
      ctx.stroke();
    } else if (shape === 'squiggle') {
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy);
      ctx.bezierCurveTo(cx - 30, cy - 15, cx - 10, cy + 15, cx + 20, cy - 15);
      ctx.bezierCurveTo(cx + 40, cy + 15, cx + 60, cy - 10, cx + 70, cy);
      ctx.stroke();
    } else if (shape === 'sparkle') {
      ctx.beginPath();
      ctx.moveTo(cx, cy - 30);
      ctx.quadraticCurveTo(cx, cy, cx + 30, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy + 30);
      ctx.quadraticCurveTo(cx, cy, cx - 30, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy - 30);
      ctx.stroke();
    }
    ctx.restore();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    currentStrokeRef.current = [{ x, y }];
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#fbf8f2' : color;
    ctx.lineWidth = tool === 'marker' ? strokeWidth * 2.5 : tool === 'eraser' ? strokeWidth * 4 : strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = tool === 'marker' ? 0.45 : 1.0;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    currentStrokeRef.current.push({ x, y });
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStrokeRef.current.length > 0) {
      setStrokes((prev) => [
        ...prev,
        {
          points: [...currentStrokeRef.current],
          color,
          width: strokeWidth,
          tool,
        },
      ]);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
  };

  const handleFinish = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Export transparent PNG sticker of doodle
    const dataUrl = canvas.toDataURL('image/png');
    onSaveDoodle({
      type: 'doodle',
      x: 60,
      y: 120,
      width: 260,
      height: 260,
      rotation: 0,
      zIndex: 15,
      points: strokes.map((s) => s.points),
      strokeColor: color,
      strokeWidth,
      tool: tool === 'eraser' ? 'pen' : tool,
      createdBy: partner,
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(20, 16, 14, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--paper-cream)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        border: '1px solid #dcd0bf',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '680px',
        width: '100%',
        overflow: 'hidden',
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid #e7dac5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-serif-title)',
              color: '#3d2e26',
              fontSize: '1.25rem',
            }}>
              Handmade Doodle Studio
            </h3>
            <p style={{
              fontSize: '0.82rem',
              color: '#7b675b',
              fontFamily: 'var(--font-sans)',
            }}>
              Draw a scribble, sweet doodle, or underline for your page
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6e5a4f',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div style={{
          padding: '10px 16px',
          background: '#f4ede1',
          borderBottom: '1px solid #e7dac5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          {/* Tool select */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setTool('pen')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '20px',
                border: tool === 'pen' ? '2px solid #5c202e' : '1px solid #d5c6b4',
                background: tool === 'pen' ? '#fff' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <Pen size={14} />
              <span>Pen</span>
            </button>

            <button
              onClick={() => setTool('marker')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '20px',
                border: tool === 'marker' ? '2px solid #5c202e' : '1px solid #d5c6b4',
                background: tool === 'marker' ? '#fff' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <Highlighter size={14} />
              <span>Highlighter</span>
            </button>

            <button
              onClick={() => setTool('eraser')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '20px',
                border: tool === 'eraser' ? '2px solid #5c202e' : '1px solid #d5c6b4',
                background: tool === 'eraser' ? '#fff' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <Eraser size={14} />
              <span>Eraser</span>
            </button>
          </div>

          {/* Color Palette */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {['#5c202e', '#8b3a4a', '#2d241e', '#c46851', '#849683', '#c59b27', '#233649'].map((c) => (
              <div
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: c,
                  cursor: 'pointer',
                  border: color === c ? '2px solid #000' : '2px solid #fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            ))}
          </div>

          {/* Quick Shapes */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              title="Add Hand-drawn Heart"
              onClick={() => addQuickDoodleShape('heart')}
              style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #d5c6b4', background: '#fff', cursor: 'pointer' }}
            >
              ❤️
            </button>
            <button
              title="Add Star"
              onClick={() => addQuickDoodleShape('star')}
              style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #d5c6b4', background: '#fff', cursor: 'pointer' }}
            >
              ⭐
            </button>
            <button
              title="Add Squiggle Underline"
              onClick={() => addQuickDoodleShape('squiggle')}
              style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #d5c6b4', background: '#fff', cursor: 'pointer' }}
            >
              〰️
            </button>
            <button
              title="Add Hand Sparkle"
              onClick={() => addQuickDoodleShape('sparkle')}
              style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #d5c6b4', background: '#fff', cursor: 'pointer' }}
            >
              ✨
            </button>
          </div>
        </div>

        {/* Drawing Area */}
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          background: '#fcfaf6',
        }}>
          <canvas
            ref={canvasRef}
            width={580}
            height={360}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e1d3c2',
              boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.06)',
              cursor: 'crosshair',
              touchAction: 'none',
            }}
          />
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #e7dac5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <button
            onClick={clearCanvas}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#867265',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            <RotateCcw size={14} />
            <span>Clear Canvas</span>
          </button>

          <button
            onClick={handleFinish}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#5c202e',
              color: '#fff',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            <Check size={16} />
            <span>Place on Scrapbook</span>
          </button>
        </div>
      </div>
    </div>
  );
};
