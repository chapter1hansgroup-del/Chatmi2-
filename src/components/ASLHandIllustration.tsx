import React from 'react';

interface ASLHandIllustrationProps {
  handShapeType: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showMotionArrow?: boolean;
  motionDirection?: 'forward' | 'up' | 'down' | 'circle' | 'wave' | 'arc' | 'side';
}

export const ASLHandIllustration: React.FC<ASLHandIllustrationProps> = ({
  handShapeType,
  size = 'md',
  className = '',
  showMotionArrow = false,
  motionDirection = 'forward',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const normalized = (handShapeType || '').toLowerCase();

  // Renders precise vector anatomical SVG diagrams for ASL
  const renderSVGPaths = () => {
    // 1. A-Hand / Fist with thumb upright at side
    if (normalized.includes('letter a') || normalized.includes('a-hand') || normalized.includes('thumb upright side') || normalized.includes('letter_a')) {
      return (
        <g>
          {/* Palm & 4 folded fingers */}
          <rect x="26" y="32" width="48" height="42" rx="14" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="38" y1="34" x2="38" y2="58" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="34" x2="50" y2="58" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="62" y1="36" x2="62" y2="58" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          {/* Thumb upright pressed straight against side of index */}
          <path d="M 22 66 C 18 52, 18 36, 24 24 C 28 16, 34 20, 32 32 L 30 54" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="28" cy="22" r="3" fill="#67e8f9" />
          <text x="50" y="90" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">A (Thumb on Side)</text>
        </g>
      );
    }

    // 2. S-Hand / Fist with thumb locked ACROSS front of fingers (Crucial ASL distinction from A)
    if (normalized.includes('letter s') || normalized.includes('s-hand') || normalized.includes('s-fist') || normalized.includes('letter_s') || normalized.includes('yes')) {
      return (
        <g>
          {/* 4 curled fingers */}
          <rect x="24" y="32" width="52" height="42" rx="14" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="37" y1="34" x2="37" y2="50" stroke="#38bdf8" strokeWidth="2" />
          <line x1="50" y1="34" x2="50" y2="50" stroke="#38bdf8" strokeWidth="2" />
          <line x1="63" y1="36" x2="63" y2="50" stroke="#38bdf8" strokeWidth="2" />
          {/* Thumb locked horizontally across all 4 fingers */}
          <path d="M 18 60 C 22 46, 32 44, 52 46 C 66 48, 70 54, 66 60 C 58 64, 30 64, 20 62" fill="#0ea5e9" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="50" y="90" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">S (Thumb Across Front)</text>
        </g>
      );
    }

    // 3. B-Hand / Flat 4 fingers upright, thumb folded in
    if (normalized.includes('letter b') || normalized.includes('b-hand') || normalized.includes('flat hand') || normalized.includes('hello') || normalized.includes('letter_b')) {
      return (
        <g>
          {/* 4 fingers extended straight upright together */}
          <path d="M 32 68 L 32 20 C 32 14, 40 14, 40 20 L 40 68" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2.5" />
          <path d="M 42 68 L 42 16 C 42 10, 50 10, 50 16 L 50 68" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2.5" />
          <path d="M 52 68 L 52 18 C 52 12, 60 12, 60 18 L 60 68" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2.5" />
          <path d="M 62 68 L 62 26 C 62 20, 70 20, 70 26 L 70 68" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Palm base */}
          <path d="M 30 65 C 30 80, 72 80, 72 65 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Thumb folded across lower palm */}
          <path d="M 24 64 C 28 50, 48 54, 52 62" fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" />
          <text x="50" y="92" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">B (4 Straight, Thumb Tucked)</text>
        </g>
      );
    }

    // 4. C-Hand / Curved half-circle cup
    if (normalized.includes('letter c') || normalized.includes('c-hand') || normalized.includes('curved') || normalized.includes('letter_c') || normalized.includes('computer')) {
      return (
        <g>
          {/* Top fingers curving right */}
          <path d="M 28 48 C 30 22, 68 22, 74 34 C 76 38, 70 42, 64 38 C 56 30, 40 32, 38 48 C 40 64, 56 66, 64 58 C 70 54, 76 58, 74 62 C 68 74, 30 74, 28 48 Z" fill="#0284c7" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="50" y="90" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">C (Open Curved Cup)</text>
        </g>
      );
    }

    // 5. D-Hand (Index pointing straight up, thumb touching middle forming O)
    if (normalized.includes('letter d') || normalized.includes('d-hand') || normalized.includes('letter_d')) {
      return (
        <g>
          {/* Index pointing straight up */}
          <path d="M 32 64 L 32 16 C 32 10, 40 10, 40 16 L 40 64" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Middle, Ring, Pinky touching thumb forming an "O" loop */}
          <circle cx="54" cy="52" r="14" fill="#0284c7" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="50" y="90" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">D (Index Up, Circle)</text>
        </g>
      );
    }

    // 6. F-Hand / OK Hand (Index and thumb form circle, 3 other fingers spread up)
    if (normalized.includes('letter f') || normalized.includes('f-hand') || normalized.includes('letter_f') || normalized.includes('ok-sign')) {
      return (
        <g>
          {/* Index and thumb circle */}
          <circle cx="36" cy="50" r="12" fill="#0284c7" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2.5" />
          {/* 3 fingers extended up: Middle, Ring, Pinky */}
          <path d="M 48 48 L 50 16 C 50 10, 56 10, 56 16 L 56 50" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />
          <path d="M 58 48 L 62 18 C 62 12, 68 12, 68 18 L 68 50" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />
          <path d="M 70 52 L 74 24 C 74 18, 80 18, 80 24 L 78 54" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />
          <text x="50" y="90" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">F (OK Circle + 3 Up)</text>
        </g>
      );
    }

    // 7. I-LOVE-YOU (ILY: Thumb, Index, and Pinky Extended)
    if (normalized.includes('i-love-you') || normalized.includes('ily') || normalized.includes('love') || normalized.includes('sign_ily')) {
      return (
        <g>
          {/* Thumb extended out 45° */}
          <path d="M 32 64 L 14 46 C 10 42, 16 36, 20 40 L 34 56" fill="#ec4899" fillOpacity="0.3" stroke="#f472b6" strokeWidth="2.5" />
          {/* Index extended straight up */}
          <path d="M 34 62 L 34 16 C 34 10, 42 10, 42 16 L 42 62" fill="#ec4899" fillOpacity="0.3" stroke="#f472b6" strokeWidth="2.5" />
          {/* Middle & Ring folded tightly down */}
          <path d="M 44 60 C 44 48, 58 48, 58 60" fill="#db2777" stroke="#f472b6" strokeWidth="2" />
          <path d="M 58 60 C 58 50, 70 50, 70 60" fill="#db2777" stroke="#f472b6" strokeWidth="2" />
          {/* Pinky extended straight up */}
          <path d="M 70 62 L 74 22 C 74 16, 82 16, 82 22 L 80 64" fill="#ec4899" fillOpacity="0.3" stroke="#f472b6" strokeWidth="2.5" />
          {/* Base palm */}
          <rect x="30" y="58" width="50" height="20" rx="6" fill="#be185d" stroke="#f472b6" strokeWidth="2" />
          <text x="50" y="92" fill="#f472b6" fontSize="10" textAnchor="middle" fontWeight="bold">I-L-Y (Thumb + Index + Pinky)</text>
        </g>
      );
    }

    // 8. W-Hand / Water (3 fingers spread upright, thumb holds pinky)
    if (normalized.includes('w-hand') || normalized.includes('water') || normalized.includes('letter w') || normalized.includes('letter_w')) {
      return (
        <g>
          {/* 3 spread fingers: Index, Middle, Ring */}
          <path d="M 30 65 L 24 18 C 24 12, 32 12, 32 18 L 36 65" fill="#06b6d4" fillOpacity="0.3" stroke="#22d3ee" strokeWidth="2.5" />
          <path d="M 44 65 L 46 12 C 46 6, 54 6, 54 12 L 52 65" fill="#06b6d4" fillOpacity="0.3" stroke="#22d3ee" strokeWidth="2.5" />
          <path d="M 58 65 L 68 18 C 68 12, 76 12, 76 18 L 68 65" fill="#06b6d4" fillOpacity="0.3" stroke="#22d3ee" strokeWidth="2.5" />
          {/* Thumb holding down pinky */}
          <circle cx="68" cy="54" r="7" fill="#0891b2" stroke="#22d3ee" strokeWidth="2" />
          <path d="M 34 60 C 44 52, 60 52, 66 54" fill="none" stroke="#67e8f9" strokeWidth="2.5" />
          <text x="50" y="92" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">W (3 Spread Fingers)</text>
        </g>
      );
    }

    // 9. V-Hand / Peace / 2-Fingers Spread
    if (normalized.includes('v-hand') || normalized.includes('peace') || normalized.includes('letter v') || normalized.includes('letter_v') || normalized.includes('see')) {
      return (
        <g>
          {/* Index & Middle spread in a V */}
          <path d="M 36 64 L 28 16 C 28 10, 36 10, 36 16 L 44 64" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2.5" />
          <path d="M 48 64 L 62 16 C 62 10, 70 10, 70 16 L 56 64" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Folded Ring, Pinky, and Thumb */}
          <rect x="36" y="52" width="30" height="24" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <text x="50" y="90" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">V (Open V Shape)</text>
        </g>
      );
    }

    // 10. U-Hand (Index & Middle pressed tightly together)
    if (normalized.includes('u-hand') || normalized.includes('letter u') || normalized.includes('letter_u')) {
      return (
        <g>
          {/* Index & Middle held tightly together */}
          <path d="M 38 64 L 38 16 C 38 10, 46 10, 46 16 L 46 64" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2.5" />
          <path d="M 48 64 L 48 16 C 48 10, 56 10, 56 16 L 56 64" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2.5" />
          <rect x="36" y="52" width="28" height="24" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <text x="50" y="90" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">U (2 Fingers Touching)</text>
        </g>
      );
    }

    // 11. L-Hand (Index up, Thumb out 90°)
    if (normalized.includes('l-hand') || normalized.includes('letter l') || normalized.includes('letter_l')) {
      return (
        <g>
          {/* Index up */}
          <path d="M 44 64 L 44 16 C 44 10, 52 10, 52 16 L 52 64" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Thumb extended horizontally 90° */}
          <path d="M 48 58 L 18 58 C 12 58, 12 66, 18 66 L 48 66" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2.5" />
          <rect x="46" y="54" width="24" height="24" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <text x="50" y="90" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">L (90° Angle L-Shape)</text>
        </g>
      );
    }

    // 12. 5-Hand / Open Palm (Please, Happy, Fine)
    if (normalized.includes('5-hand') || normalized.includes('open 5') || normalized.includes('please') || normalized.includes('happy') || normalized.includes('applause')) {
      return (
        <g>
          <path d="M 22 56 L 12 36 C 8 30, 16 26, 20 32 L 28 50" fill="#10b981" fillOpacity="0.3" stroke="#34d399" strokeWidth="2" />
          <path d="M 32 60 L 28 18 C 26 12, 34 10, 36 16 L 38 58" fill="#10b981" fillOpacity="0.3" stroke="#34d399" strokeWidth="2" />
          <path d="M 44 60 L 46 12 C 46 6, 54 6, 54 12 L 52 58" fill="#10b981" fillOpacity="0.3" stroke="#34d399" strokeWidth="2" />
          <path d="M 58 60 L 64 18 C 64 12, 72 14, 70 20 L 64 60" fill="#10b981" fillOpacity="0.3" stroke="#34d399" strokeWidth="2" />
          <path d="M 68 62 L 80 28 C 82 22, 90 26, 86 32 L 74 64" fill="#10b981" fillOpacity="0.3" stroke="#34d399" strokeWidth="2" />
          <rect x="28" y="56" width="48" height="24" rx="10" fill="#059669" stroke="#34d399" strokeWidth="2" />
          <text x="50" y="92" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">Open 5-Hand (Spread)</text>
        </g>
      );
    }

    // Default universal clear hand gesture
    return (
      <g>
        <rect x="30" y="24" width="40" height="52" rx="12" fill="#6366f1" fillOpacity="0.25" stroke="#818cf8" strokeWidth="2.5" />
        <circle cx="50" cy="46" r="10" fill="#4f46e5" stroke="#818cf8" strokeWidth="2" />
        <path d="M 36 76 L 64 76" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
        <text x="50" y="90" fill="#a5b4fc" fontSize="10" textAnchor="middle" fontWeight="bold">ASL Gesture Pose</text>
      </g>
    );
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${sizeMap[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {renderSVGPaths()}
        {showMotionArrow && (
          <g className="animate-pulse">
            {motionDirection === 'forward' && (
              <path d="M 50 78 L 50 96 M 44 90 L 50 96 L 56 90" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            )}
            {motionDirection === 'up' && (
              <path d="M 50 20 L 50 4 M 44 10 L 50 4 L 56 10" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
            )}
            {motionDirection === 'circle' && (
              <path d="M 68 44 A 20 20 0 1 1 50 24 L 56 22" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
