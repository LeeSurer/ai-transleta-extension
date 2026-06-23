import React, { useState, useEffect } from 'react';
import { DEFAULT_PROMPT } from '../background/index';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(
      ['apiKey', 'prompt'],
      (result: { apiKey?: string; prompt?: string }) => {
        if (result.apiKey) {
          setApiKey(result.apiKey);
        }
        if (result.prompt) {
          setPrompt(result.prompt);
        }
      }
    );
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({ apiKey, prompt }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="ait-popup">
      <div className="ait-popup-header">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M493.226667 152.519111l9.386666 34.247111 0.170667 1.024 41.528889 140.344889 132.892444 0.113778a170.382222 170.382222 0 0 1 170.097778 160.256l0.284445 10.012444v11.377778A51.370667 51.370667 0 0 1 910.222222 559.786667v70.200889a51.2 51.2 0 0 1-62.577778 49.948444v23.153778a170.325333 170.325333 0 0 1-170.439111 170.268444H306.005333a170.382222 170.382222 0 0 1-170.439111-170.268444v-25.031111A59.335111 59.335111 0 0 1 56.888889 621.909333v-54.044444A59.278222 59.278222 0 0 1 135.566222 512v-13.482667A170.325333 170.325333 0 0 1 306.062222 328.192h160.711111L436.906667 227.157333l-107.633778 27.989334a22.414222 22.414222 0 0 1-27.306667-15.815111l-9.272889-34.247112a22.357333 22.357333 0 0 1 16.042667-27.477333l157.354667-40.96a22.414222 22.414222 0 0 1 27.306666 15.758222l-0.113777 0.056889z m183.978666 234.951111H306.005333a111.160889 111.160889 0 0 0-111.217777 111.047111v204.572445c0 61.326222 49.777778 110.990222 111.217777 110.990222h371.256889a111.104 111.104 0 0 0 111.217778-110.990222V498.517333a111.104 111.104 0 0 0-111.217778-111.047111h-0.056889z m-363.52 130.958222a29.582222 29.582222 0 0 1 29.297778 25.258667l0.341333 4.380445v118.385777A29.582222 29.582222 0 0 1 284.444444 670.833778l-0.341333-4.380445V548.067556a29.582222 29.582222 0 0 1 29.582222-29.582223z m363.747556-1.422222a28.785778 28.785778 0 0 1 40.732444 40.732445l-38.286222 38.229333 38.627556 38.570667a28.728889 28.728889 0 0 1 0.967111 39.594666l-1.024 1.137778a28.842667 28.842667 0 0 1-39.651556 0.967111l-1.024-1.024-56.433778-56.32a28.672 28.672 0 0 1-2.730666-43.178666l58.823111-58.709334zM571.619556 113.777778a41.528889 41.528889 0 1 1 0 83.114666h-0.113778a41.528889 41.528889 0 0 1 0-83.114666h0.113778z" fill="#ffffff" /></svg>
        <h1>AI 文本解释助手</h1>
      </div>
      <div className="ait-popup-body">
        <div className="ait-field">
          <label htmlFor="apiKeyInput">DeepSeek API Key</label>
          <input
            id="apiKeyInput"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="请输入你的 API Key"
          />
        </div>
        <div className="ait-field">
          <label htmlFor="promptInput">提示词</label>
          <textarea
            id="promptInput"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="请输入系统提示词"
          />
        </div>
        <button className="ait-save-btn" onClick={handleSave}>
          {saved ? '✓ 已保存' : '保存设置'}
        </button>
        <div className="ait-tips">
          <p>使用说明：</p>
          <ol>
            <li>
              在{' '}
              <a
                href="https://platform.deepseek.com"
                target="_blank"
                rel="noreferrer"
              >
                DeepSeek 开放平台
              </a>{' '}
              获取 API Key
            </li>
            <li>在上方输入框中填入 API Key 并保存</li>
            <li>在任意网页选中文字，点击弹出的图标即可</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default App;
