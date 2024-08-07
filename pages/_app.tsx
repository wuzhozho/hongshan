import { AppProps } from "next/app";
import Head from "next/head";
import {
  Aside,
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "highlight.js/styles/stackoverflow-dark.css";

import { useChatStore } from "@/stores/ChatStore";

import Nav from "@/components/Nav";
import { useEffect, useState } from "react";
import UIController from "@/components/UIController";
import { setColorScheme } from "@/stores/ChatActions";
import AudioPlayer from "@/components/AudioPlayer";
import '../i18n';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const colorScheme = useChatStore((state) => state.colorScheme);

  // 使用 useChatStore 获取 isImmersive 状态
  const isImmersive = useChatStore((state) => state.isImmersive);
  
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
  };

  const apiKey = useChatStore((state) => state.apiKey);
  const playerMode = useChatStore((state) => state.playerMode);

  const [isHydrated, setIsHydrated] = useState(false);

  //Wait till NextJS rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>红山/C龙文化-Chatbot Voicebot平台</title>
        <meta name="description" content="红山/C龙文化-Chatbot Voicebot平台" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme,
            primaryColor: "bluu",
            colors: {
              // https://smart-swatch.netlify.app/#5E6AD2
              bluu: [
                "#e8edff",
                "#c2c8f3",
                "#9aa3e5",
                "#727ed9",
                "#4c59cd",
                "#3240b3",
                "#26318d",
                "#1a2366",
                "#0e1540",
                "#04061b",
              ],
              // https://smart-swatch.netlify.app/#2A2D3D
              dark: [
                "#eef1fd",
                "#d1d4e3",
                "#b3b7cb",
                "#959ab5",
                "#787e9f",
                "#5f6486",
                "#494e69",
                "#34384c",
                "#1e212f",
                "#070b16",
              ],
            },
          }}
        >
          <Notifications />
          <AppShell
            padding={0}
            navbar={isImmersive ?  <></> : <Nav />}
            layout="alt"
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
          >
            {/* <div className="main-container" 
              style={{ display: 'grid', gridTemplateColumns: '20% 80%', height: '100%' }}>
              <div style={{backgroundImage: 'url("/leftpic.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div> 
                <Component {...pageProps} />
                {apiKey && <UIController />}
              </div>
            </div> */}
            <div style={{ position: "relative", height: "100%" }}>
              <Component {...pageProps} />

              {apiKey && <UIController />}
            </div>
            {playerMode && <AudioPlayer />}
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
