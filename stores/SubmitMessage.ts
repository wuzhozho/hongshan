import { v4 as uuidv4 } from "uuid";
import { Message } from "./Message";
import { streamCompletion } from "./OpenAI";
import { getChatById, updateChatMessages } from "./utils";
import { notifications } from "@mantine/notifications";
import { getModelInfo } from "./Model";
import { useChatStore, getJwtAndUser } from "./ChatStore";
import axios from 'axios';

const get = useChatStore.getState;
const set = useChatStore.setState;

export const abortCurrentRequest = () => {
  const currentAbortController = get().currentAbortController;
  if (currentAbortController?.abort) currentAbortController?.abort();
  set((state) => ({
    apiState: "idle",
    currentAbortController: undefined,
  }));
};

export const submitMessage = async (message: Message) => {
  const { jwt, user } = getJwtAndUser(); // 使用getJwtAndUser获取jwt和user
  // console.log("JWT:", jwt, "User:", user);
  // If message is empty, do nothing
  if (message.content.trim() === "") {
    console.error("Message is empty");
    return;
  }

  const activeChatId = get().activeChatId;
  const chat = get().chats.find((c) => c.id === activeChatId!);
  if (chat === undefined) {
    console.error("Chat not found");
    return;
  }
  console.log("chat", chat.id);
  // console.log("请求的信息request：", message);
  // question 信息入库
  try {
    if(user && user.id){
        const data =  {
          "user_id": user?.id,
          "user_name": user?.username,
          "log": message.content,
          "qa": 'Q',
          "chat_id": chat.id,
        }
        const header = {
          headers: {
            Authorization: 'Bearer ' + jwt,
          },
        }
        const response = axios.post('/api/openai_log', data , header);
      }
    }catch (error) {
      console.log("==================question error",error)
    }

  // If this is an existing message, remove all the messages after it
  const index = chat.messages.findIndex((m) => m.id === message.id);
  if (index !== -1) {
    set((state) => ({
      chats: state.chats.map((c) => {
        if (c.id === chat.id) {
          c.messages = c.messages.slice(0, index);
        }
        return c;
      }),
    }));
  }

  // Add the message
  set((state) => ({
    apiState: "loading",
    chats: state.chats.map((c) => {
      if (c.id === chat.id) {
        c.messages.push(message);
      }
      return c;
    }),
  }));

  const assistantMsgId = uuidv4();
  // Add the assistant's response
  set((state) => ({
    chats: state.chats.map((c) => {
      if (c.id === state.activeChatId) {
        c.messages.push({
          id: assistantMsgId,
          content: "",
          role: "assistant",
          loading: true,
        });
      }
      return c;
    }),
  }));

  const apiKey = get().apiKey;
  if (apiKey === undefined) {
    console.error("API key not set");
    return;
  }

  const updateTokens = (promptTokensUsed: number, completionTokensUsed: number) => {
    const activeModel = get().settingsForm.model;
    const {prompt: promptCost, completion: completionCost} = getModelInfo(activeModel).costPer1kTokens;
    set((state) => ({
      apiState: "idle",
      chats: state.chats.map((c) => {
        if (c.id === chat.id) {
          c.promptTokensUsed = (c.promptTokensUsed || 0) + promptTokensUsed;
          c.completionTokensUsed = (c.completionTokensUsed || 0) + completionTokensUsed;
          c.costIncurred =
            (c.costIncurred || 0) + (promptTokensUsed / 1000) * promptCost + (completionTokensUsed / 1000) * completionCost;
        }
        return c;
      }),
    }));
  };
  const settings = get().settingsForm;

  const abortController = new AbortController();
  set((state) => ({
    currentAbortController: abortController,
    ttsID: assistantMsgId,
    ttsText: "",
  }));

  // ASSISTANT REQUEST
  let fullResponse = ""; // 定义一个变量来累积完整的响应内容
  await streamCompletion(
    chat.messages,
    settings,
    apiKey,
    abortController,
    (content) => {
      fullResponse += content; // 将每个文本块加到累积变量中
      set((state) => ({
        ttsText: (state.ttsText || "") + content,
        chats: updateChatMessages(state.chats, chat.id, (messages) => {
          const assistantMessage = messages.find(
            (m) => m.id === assistantMsgId
          );
          if (assistantMessage) {
            assistantMessage.content += content;
          }
          return messages;
        }),
      }));
    },
    async (promptTokensUsed, completionTokensUsed) => {
      // console.log("整个OpenAI返回的响应内容为response：", fullResponse); // 打印完整的响应内容
      // answer 信息入库
    try {
      if(user && user.id){
          const data =  {
            "user_id": user?.id,
            "user_name": user?.username,
            "log": fullResponse,
            "qa": 'A',
            "chat_id": chat.id,
          }
          const header = {
            headers: {
              Authorization: 'Bearer ' + jwt,
            },
          }
          const response = axios.post('/api/openai_log', data , header);
        }
      }catch (error) {
        console.log("==================answer error",error)
      }
      ///////////////////end////////////////////
      set((state) => ({
        apiState: "idle",
        chats: updateChatMessages(state.chats, chat.id, (messages) => {
          const assistantMessage = messages.find(
            (m) => m.id === assistantMsgId
          );
          if (assistantMessage) {
            assistantMessage.loading = false;
          }
          return messages;
        }),
      }));
      updateTokens(promptTokensUsed, completionTokensUsed);
      if (get().settingsForm.auto_title) {
        findChatTitle();
      }
    },
    (errorRes, errorBody) => {
      let message = errorBody;
      try {
        message = JSON.parse(errorBody).error.message;
      } catch (e) {}

      notifications.show({
        message: message,
        color: "red",
      });
      // Run abortCurrentRequest to remove the loading indicator
      abortCurrentRequest();
    }
  );

  const findChatTitle = async () => {
    const chat = getChatById(get().chats, get().activeChatId);
    if (chat === undefined) {
      console.error("Chat not found");
      return;
    }
    // Find a good title for the chat
    const numWords = chat.messages
      .map((m) => m.content.split(" ").length)
      .reduce((a, b) => a + b, 0);
    if (
      chat.messages.length >= 2 &&
      chat.title === undefined &&
      numWords >= 4
    ) {
      const msg = {
        id: uuidv4(),
        content: `Describe the following conversation snippet in 3 words or less.
              >>>
              Hello
              ${chat.messages
                .slice(1)
                .map((m) => m.content)
                .join("\n")}
              >>>
                `,
        role: "system",
      } as Message;

      await streamCompletion(
        [msg, ...chat.messages.slice(1)],
        settings,
        apiKey,
        undefined,
        (content) => {
          set((state) => ({
            chats: state.chats.map((c) => {
              if (c.id === chat.id) {
                // Find message with id
                chat.title = (chat.title || "") + content;
                if (chat.title.toLowerCase().startsWith("title:")) {
                  chat.title = chat.title.slice(6).trim();
                }
                // Remove trailing punctuation
                chat.title = chat.title.replace(/[,.;:!?]$/, "");
              }
              return c;
            }),
          }));
        },
        updateTokens
      );
    }
  };
};
