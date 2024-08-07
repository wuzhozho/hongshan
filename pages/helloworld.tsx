import React, { useState, useEffect, useCallback } from 'react'; // 引入 useCallback
import { useTranslation } from 'react-i18next';
import { useChatStore } from "../stores/ChatStore";

const HelloWorld = () => {
  const { t, i18n } = useTranslation();

  // 从全局状态获取当前语言
  const globalLan = useChatStore((state) => state.lan);
  const [selectedLanguage, setSelectedLanguage] = useState(globalLan);

  // 使用 useCallback 来包装 changeLanguage 函数
  const changeLanguage = useCallback((languageCode: string) => {
    i18n.changeLanguage(languageCode)
      .then(() => {
        console.log('Language changed to ', languageCode);
        setSelectedLanguage(languageCode); // 更新本地 selectedLanguage 状态
        useChatStore.setState({ lan: languageCode }); // 更新全局 lan 状态
      })
      .catch((err) => console.error('Error occurred while changing language: ', err));
  }, [i18n]); // 把 i18n 作为依赖项传入 useCallback，因为它可能是变化的

  // useEffect 的依赖数组中移除了 changeLanguage，因为现在它是用 useCallback 包装后稳定的
  useEffect(() => {
    if (typeof selectedLanguage === 'string') {
      changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage,changeLanguage]);

  // 组件其他部分保持不变
  return (
    <div>
      <h1>{t('helloWorld')}</h1>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ja')}>Japanese</button>
      <button onClick={() => changeLanguage('zh-CN')}>Chinese简体</button>
      <button onClick={() => changeLanguage('zh-TW')}>Chinese繁体</button>
      <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="ja">Japanese</option>
        <option value="zh-CN">Chinese简体</option>
        <option value="zh-TW">Chinese繁体</option>
      </select>
    </div>
  );
}

export default HelloWorld;



// import React, { useCallback } from 'react';
// import { useTranslation } from 'react-i18next';

// const HelloWorld = () => {
//   const { t, i18n } = useTranslation();

//   const changeLanguage = useCallback((languageCode: string) => {
//     i18n.changeLanguage(languageCode)
//       .then(() => console.log('Language changed to ', languageCode))
//       .catch((err: Error) => console.log('Error occurred while changing language: ', err));
//   }, [i18n]);

//   return (
//     <div>
//       <h1>{t('helloWorld')}</h1>
//       <button onClick={() => changeLanguage('en')}>English</button>
//       <button onClick={() => changeLanguage('ja')}>Japanese</button>
//       <button onClick={() => changeLanguage('zh-CN')}>Chinese简体</button>
//       <button onClick={() => changeLanguage('zh-TW')}>Chinese繁体</button>
//     </div>
//   );
// };

// export default HelloWorld;