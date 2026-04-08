import React, { useState, useEffect } from 'react';
import FloatingIcon from './components/FloatingIcon';
import TranslationPanel from './components/TranslationPanel';

const App: React.FC = () => {
  const [showIcon, setShowIcon] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('#ait-root')) return;

      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();
        if (text && text.length > 0) {
          setSelectedText(text);
          setPosition({ x: e.clientX, y: e.clientY });
          setShowIcon(true);
          setShowPanel(false);
          setTranslation('');
          setError('');
        }
      }, 10);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#ait-root')) {
        setShowIcon(false);
      }
    };

    const handleScroll = () => {
      setShowIcon(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const handleTranslate = () => {
    setShowIcon(false);
    setShowPanel(true);
    setLoading(true);
    setTranslation('');
    setError('');

    try {
      const port = chrome.runtime.connect({ name: 'translate' });

      port.onDisconnect.addListener(() => {
        if (chrome.runtime.lastError) {
          setError('连接失败，请刷新页面后重试');
        }
        setLoading(false);
      });

      port.onMessage.addListener((msg: { type: string; content?: string; message?: string }) => {
        if (msg.type === 'CHUNK') {
          setTranslation((prev) => prev + msg.content);
        } else if (msg.type === 'DONE') {
          setLoading(false);
        } else if (msg.type === 'ERROR') {
          setError(msg.message || '翻译失败');
          setLoading(false);
        }
      });

      port.postMessage({ type: 'TRANSLATE', text: selectedText });
    } catch {
      setError('连接失败，请刷新页面后重试');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowPanel(false);
    setShowIcon(false);
  };

  return (
    <>
      {showIcon && (
        <FloatingIcon position={position} onClick={handleTranslate} />
      )}
      {showPanel && (
        <TranslationPanel
          text={selectedText}
          translation={translation}
          loading={loading}
          error={error}
          position={position}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default App;
