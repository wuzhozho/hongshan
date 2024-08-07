/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  i18n: {
    locales: ['en', 'zh-CN','zh-TW'], 
    defaultLocale: 'zh-CN',
  },
};

module.exports = nextConfig;
