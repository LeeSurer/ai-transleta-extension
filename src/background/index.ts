chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'translate') return;

  port.onMessage.addListener(async (msg: { type: string; text: string }) => {
    if (msg.type !== 'TRANSLATE') return;

    try {
      const { apiKey } = await chrome.storage.sync.get('apiKey');
      if (!apiKey) {
        port.postMessage({
          type: 'ERROR',
          message: '请先点击扩展图标，在设置中配置 DeepSeek API Key',
        });
        return;
      }

      const response = await fetch(
        'https://api.deepseek.com/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content:
                  `你是一个简洁的帮忙翻译并解释的助手，需要对收到的内容做翻译并简要解释，回复内容为以下两个部分：
                  一、翻译结果(有以下情况)：
                    1.当收到一个英文单词时，给出这个单词的几个常见中文翻译，并给出这个单词的词性，常见用法等简要解释；
                    2.当收到几个单词或者一段句子时需要帮我翻译文本；
                    3.收到例如stackName或data.length或其他格式的英文文本时，也需要翻译为中文；
                    4.当收到的文本很长很长时，只需要帮我翻译文本的摘要，不需要翻译全文。
                  二、简要解释
                  输出格式：第一行给出翻译结果，空一行后给出简要解释（用中文）（收到的文本是什么，什么作用等等），做个简要介绍，保持简短精炼。`,
              },
              {
                role: 'user',
                content: msg.text,
              },
            ],
            stream: true,
            temperature: 0.3,
            max_tokens: 500,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        port.postMessage({
          type: 'ERROR',
          message: `API 请求失败 (${response.status}): ${errorText}`,
        });
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        port.postMessage({ type: 'ERROR', message: '无法读取响应' });
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;

          const data = trimmed.slice(6);
          if (data === '[DONE]') {
            port.postMessage({ type: 'DONE' });
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              port.postMessage({ type: 'CHUNK', content });
            }
          } catch {
            // 跳过无效 JSON
          }
        }
      }

      port.postMessage({ type: 'DONE' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '未知错误';
      port.postMessage({ type: 'ERROR', message: `翻译出错: ${message}` });
    }
  });
});
