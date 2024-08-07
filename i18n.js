import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// 使用 environment variables 来处理不同环境的基础 URL
// 例如在 development 环境中，您可以用 'http://localhost:3000'
// 在 production 环境中，则为 'https://yourdomain.com'
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

if (!i18n.isInitialized) {
    i18n
    .use(HttpApi)
    .use(LanguageDetector) 
    .use(initReactI18next) 
    .init({
        fallbackLng: "en", 
        debug: true, 
        detection: {
            order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
        },
        backend: {
            // 这里使用绝对 URL
            // loadPath: `${baseUrl}/locales/{{lng}}/translation.json`
            loadPath: `/locales/{{lng}}/translation.json`
        },
    });
}

export default i18n;