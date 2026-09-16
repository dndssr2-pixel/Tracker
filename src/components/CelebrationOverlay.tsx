import { useEffect, useState } from 'react';
import { PartyPopper, X } from 'lucide-react';

type CelebrationOverlayProps = {
  show: boolean;
  onClose: () => void;
};

export function CelebrationOverlay({ show, onClose }: CelebrationOverlayProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>(
    []
  );

  useEffect(() => {
    if (!show) return;
    const emojis = ['🎉', '✨', '🚀', '💫', '🌟', '🎊'];
    const newParticles = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
        aria-label="Close"
      >
        <X size={24} />
      </button>
      <div className="relative flex flex-col items-center gap-4 px-8 text-center">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute text-2xl animate-confetti"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.id * 0.05}s`,
            }}
          >
            {p.emoji}
          </span>
        ))}
        <div className="animate-bounce-in">
          <PartyPopper className="text-amber-400" size={64} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-white animate-bounce-in">All done!</h2>
        <p className="text-white/80 text-sm animate-fade-in-delay">
          You completed every task today. Keep the streak going!
        </p>
      </div>
    </div>
  );
}
