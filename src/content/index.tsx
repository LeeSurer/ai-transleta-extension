import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './content.less';

const container = document.createElement('div');
container.id = 'ait-root';
document.body.appendChild(container);

const root = createRoot(container);
root.render(<App />);
