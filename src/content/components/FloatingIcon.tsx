import React from 'react';

interface Props {
  position: { x: number; y: number };
  onClick: () => void;
}

const FloatingIcon: React.FC<Props> = ({ position, onClick }) => {
  return (
    <div
      className="ait-floating-icon"
      style={{
        left: `${position.x + 8}px`,
        top: `${position.y - 36}px`,
      }}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title="AI 翻译"
    >
      <img
        src={chrome.runtime.getURL('icons/icon48.png')}
        width="30"
        height="30"
        alt="AI 翻译"
      />
    </div>
  );
};

export default FloatingIcon;
