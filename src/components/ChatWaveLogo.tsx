import React from 'react';

interface ChatWaveLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ChatWaveLogo: React.FC<ChatWaveLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', gap: 'gap-2' },
    md: { icon: 'w-10 h-10', text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', gap: 'gap-3' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', gap: 'gap-3.5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center ${currentSize.gap} select-none ${className}`}>
      {/* Cropped Icon SVG */}
      <img
        src="/logo.svg"
        alt="ChatMi Logo"
        className={`${currentSize.icon} object-contain drop-shadow-md hover:scale-105 transition-transform duration-200`}
      />

      {/* Logotype Text */}
      {!iconOnly && (
        <span className={`font-black tracking-tight ${currentSize.text} flex items-center`}>
          <span className="text-sky-400">Chat</span>
          <span className="text-indigo-400">Mi</span>
        </span>
      )}
    </div>
  );
};

export default ChatWaveLogo;
