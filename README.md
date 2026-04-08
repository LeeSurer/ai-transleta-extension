# AI Translate Assistant - Chrome Extension

AI 助手 Chrome 扩展，选中网页文字即时调用 DeepSeek API 进行翻译和解释。

## 功能

- 在网页上选中英文/中文文字，弹出翻译图标气泡
- 点击图标调用 DeepSeek API 流式翻译
- 自动识别语言方向（中→英 / 英→中）
- 通过 Popup 页面配置 API Key

## 开发

### 安装依赖

```bash
yarn install
```

### 开发模式（监听文件变化自动构建）

```bash
yarn dev
```

### 生产构建

```bash
yarn build
```

## 加载到 Chrome

1. 运行 `yarn build` 构建项目
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角的 **开发者模式**
4. 点击 **加载已解压的扩展程序**
5. 选择项目的 `dist` 目录

## 配置 API Key

1. 点击浏览器工具栏中的扩展图标（拼图图标 → AI Translate Assistant）
2. 在弹出页面中输入你的 DeepSeek API Key
3. 点击 **保存设置**

> API Key 可在 [DeepSeek 开放平台](https://platform.deepseek.com) 获取

## 使用方式

1. 在任意网页上用鼠标选中英文或中文文字
2. 选中文字旁会弹出翻译图标
3. 点击图标，翻译面板将流式展示翻译结果
4. 点击面板外任意区域关闭面板

## 技术栈

- React 18 + TypeScript
- Webpack 5
- Less
- Chrome Extension Manifest V3
- DeepSeek Chat API（流式输出）
