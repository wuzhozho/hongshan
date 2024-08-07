import React, { useState } from 'react';
import { useChatStore } from "../stores/ChatStore";

const Hello = () => {
  // 从Zustand状态中获取jwt和apiKey
  const {jwt, apiKey} = useChatStore(state => ({jwt: state.jwt, apiKey: state.apiKey}));
  const { user } = useChatStore();

  // 创建状态变量保存用户输入的JWT和新的apiKey
  const [newJWT, setNewJWT] = useState("");
  const [newKey, setNewKey] = useState("");

  // 定义更新JWT和apiKey的函数
  const changeJWT = () => {
    useChatStore.setState(prevState => ({
      ...prevState,
      jwt: newJWT
    }));
  }

  const changeOpenAIKey = () => {
    useChatStore.setState(prevState => ({
      ...prevState,
      apiKey: newKey
    }));
  }

  // 渲染组件UI
  return (
    <div>
      <h1>Hello, Zustand!</h1>
      <p>Current JWT: {jwt}</p>
      <input
        type="text"
        value={newJWT}
        onChange={e => setNewJWT(e.target.value)}
        placeholder="Enter new JWT..."
      />
      <button onClick={changeJWT}>Change JWT</button>
      <p>Current OpenAI Key: {apiKey}</p>
      <input
        type="text"
        value={newKey}
        onChange={e => setNewKey(e.target.value)}
        placeholder="Enter new OpenAI key..."
      />
      <button onClick={changeOpenAIKey}>Change OpenAI Key</button>
      <div>
      用户信息：
      {/* 其他UI部分 */}
      {user && (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          {/* 展示更多用户信息 */}
        </div>
      )}
    </div>
    </div>
  );
}

export default Hello;