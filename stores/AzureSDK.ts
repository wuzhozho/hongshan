import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import axios from "axios";

export async function testKey(
  subscriptionKey: string,
  serviceRegion?: string
): Promise<boolean> {
  var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    subscriptionKey,
    serviceRegion || "eastus"
  );

  // @ts-ignore - null is for audioConfig to prevent it from auto-speaking
  const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, null);

  let inputText = "Key saved.";

  const resultPromise = new Promise<boolean>((resolve) => {
    synthesizer.speakTextAsync(
      inputText,
      function (result) {
        synthesizer.close();
        if (
          result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
        ) {
          console.log(
            "Speech synthesized to speaker for text [",
            inputText,
            "]."
          );
          resolve(true);
        } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
          console.log("Speech synthesis canceled.");
          resolve(false);
        }
      },
      function (error) {
        synthesizer.close();
        console.log("Error:", error);
        resolve(false);
      }
    );
  });

  return resultPromise;
}

function isChinese(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text); 
}

async function createSSML(
  text: string,
  // voice: string = "en-US-JaneNeural",
  voice: string = "zh-CN-XiaoxiaoNeural",
  style: string = "serious",
  rate: string = "0%", // 添加 rate 参数，默认值为 "0%"
  pitch: string = "0%", // 添加 pitch 参数，默认值为 "0%"
  breakTimeMs: string = '2'
): Promise<string> {
  let expressAs = "";
  let prosodyOpenTag = `<prosody rate="${rate}" pitch="${pitch}">`; 
  let prosodyCloseTag = `</prosody>`;
  let breakTag = `<break time="${breakTimeMs}ms"/>`;
  if (breakTimeMs == "0" || breakTimeMs == "" ){
    breakTag = ''
  }

  text = removeEmoji(escapeChars(removeQuotes(text)));
  // text = nodejieba.cut(text).join(" ");
  // console.log("--==-==--=-=-=-=-=-=",text)
  if(breakTag!=''){
    try {
      if (isChinese(text)) {
        const response = await axios.post("/api/segment", { text: text });
        const segments = response.data.segments; // 使用 segments 接收分词结果
        text = segments.join(breakTag)
        console.log("-=-=-=-=-=-=-=-=中文:", text); 
      } else {
        const words = text.split(' ');
        text = words.join(` ${breakTag} `);
        console.log("-=-=-=-=-=-=-=-=E words:", text); 
      }
      
    } catch (error) {
      console.error(error);
    }
  }
  
  if (style) {
    // expressAs = `<mstts:express-as style="${style}">${text}</mstts:express-as>`;
    expressAs = `<mstts:express-as style="${style}">${prosodyOpenTag}${text}${prosodyCloseTag}</mstts:express-as>`;
  } else {
    // expressAs = text;
    expressAs = `${prosodyOpenTag}${text}${prosodyCloseTag}`;
  }

//   return `<speak xmlns="http://www.w3.org/2001/10/synthesis"
//                 xmlns:mstts="http://www.w3.org/2001/mstts"
//                 xmlns:emo="http://www.w3.org/2009/10/emotionml"
//                 version="1.0"
//                 xml:lang="en-US">
//                   <voice name="${voice}">
//                     ${expressAs}
//                   </voice>
//                 </speak>`;
// }

  return `<speak xmlns="http://www.w3.org/2001/10/synthesis"
                xmlns:mstts="http://www.w3.org/2001/mstts"
                xmlns:emo="http://www.w3.org/2009/10/emotionml"
                version="1.0"
                xml:lang="zh-CN">
                  <voice name="${voice}">
                    ${expressAs}
                  </voice>
                </speak>`;
}

export async function genAudio({
  text,
  key,
  region,
  voice,
  style,
  rate,
  pitch,
  breakms,
}: {
  text: string;
  key: string;
  region?: string;
  voice?: string;
  style?: string;
  rate?: string;
  pitch?: string;
  breakms?: string;
}): Promise<string | null> {
  var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    key,
    region || "eastus"
  );
  speechConfig.speechSynthesisOutputFormat =
    SpeechSDK.SpeechSynthesisOutputFormat.Audio16Khz64KBitRateMonoMp3;

  // @ts-ignore - null is for audioConfig to prevent it from auto-speaking
  const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, null);

  const ssmlText = await createSSML(text, voice, style, rate, pitch, breakms);

  const resultPromise = new Promise<string | null>((resolve) => {
    synthesizer.speakSsmlAsync(
      ssmlText,
      function (result) {
        synthesizer.close();
        if (
          result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
        ) {
          const audioData = result.audioData;
          const blob = new Blob([audioData], { type: "audio/mpeg" });
          const url = URL.createObjectURL(blob);

          resolve(url);
        } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
          console.log("Speech synthesis canceled.", result);
          resolve(null);
        }
      },
      function (error) {
        synthesizer.close();
        console.log("Error:", error);
        resolve(null);
      }
    );
  });

  return resultPromise;
}

export async function getVoices(
  key: string,
  region?: string
): Promise<SpeechSDK.VoiceInfo[] | null> {
  try {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      key,
      region || "eastus"
    );
    // @ts-ignore - null is for audioConfig to prevent it from auto-speaking
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, null);
    const result = await synthesizer.getVoicesAsync();
    return result.voices;
  } catch (error) {
    console.error("Error getting available voices:", error);
    return null;
  }
}

const removeEmoji = (text: string) => {
  return text.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ""
  );
};

const removeQuotes = (text: string) => {
  // Quotes are read as "end quote" by the TTS, and are very annoying
  return text.replace(/"/g, "");
};

const escapeChars = (text: string) => {
  text = text.replace(/"/g, "&quot;");
  text = text.replace(/&/g, "&amp;");
  text = text.replace(/</g, "&lt;");
  text = text.replace(/>/g, "&gt;");
  return text;
};

export type Voice = SpeechSDK.VoiceInfo;
