// 多语言只显示
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatStore } from "../stores/ChatStore";

const HelloWorld = () => {
  const { t, i18n } = useTranslation();
  
  const globalLan = useChatStore((state) => state.lan); // 来自全局状态的当前选中的语言

  useEffect(() => {
    if (globalLan) {
      i18n.changeLanguage(globalLan); // 根据全局状态改变语言
    }
  }, [globalLan, i18n]);

  return <h1>{t('helloWorld')}</h1>; // 显示 "Hello, World" 的翻译版本
};

export default HelloWorld;