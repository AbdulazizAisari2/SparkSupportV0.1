import React, { useEffect, useState } from 'react';
interface ConfettiProps {
  show: boolean;
  onComplete?: () => void;
}
interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
}
const colors = [
  'bg-yellow-400',
  'bg-blue-400', 
  'bg-green-400',
  'bg-red-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-indigo-400',
  'bg-orange-400'
];
export const Confetti: React.FC<ConfettiProps> = ({ show, onComplete }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  useEffect(() => {
    if (show) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2
        }
      }));
      setPieces(newPieces);
      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  if (!show || pieces.length === 0) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute ${piece.color} rounded-sm animate-confetti`}
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random()}s`
          }}
        />
      ))}
    </div>
  );
};