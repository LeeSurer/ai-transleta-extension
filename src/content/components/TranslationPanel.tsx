import React, { useRef, useEffect, useState } from 'react';

interface Props {
  text: string;
  translation: string;
  loading: boolean;
  error: string;
  position: { x: number; y: number };
  onClose: () => void;
}

const TranslationPanel: React.FC<Props> = ({
  text,
  translation,
  loading,
  error,
  position,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const initialLeft = Math.min(position.x, window.innerWidth - 380);
  const initialTop = position.y + 15;

  useEffect(() => {
    setOffset({ x: 0, y: 0 });
  }, [position]);

  useEffect(() => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let dx = 0;
    let dy = 0;

    if (rect.right > vw) dx = vw - rect.right - 10;
    if (rect.bottom > vh) dy = vh - rect.bottom - 10;
    if (rect.left < 0) dx = -rect.left + 10;
    if (rect.top < 0) dy = -rect.top + 10;

    if (dx !== 0 || dy !== 0) {
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    }
  }, [translation, loading]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.current) return;
      e.preventDefault();
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      setOffset({
        x: dragState.current.origX + dx,
        y: dragState.current.origY + dy,
      });
    };

    const handleMouseUp = () => {
      dragState.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.ait-panel-close')) return;
    e.preventDefault();
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: offset.x,
      origY: offset.y,
    };
  };

  return (
    <div
      ref={panelRef}
      className="ait-panel"
      style={{
        left: `${initialLeft + offset.x}px`,
        top: `${initialTop + offset.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="ait-panel-header"
        onMouseDown={handleDragStart}
      >
        <span className="ait-panel-title">AI 翻译解释</span>
        <button className="ait-panel-close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="ait-panel-body">
        <div className="ait-original-text">{text}</div>
        <div className="ait-divider" />
        {error ? (
          <div className="ait-error">{error}</div>
        ) : (
          <div className="ait-translation">
            {translation}
            {loading && <span className="ait-cursor">▊</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationPanel;
