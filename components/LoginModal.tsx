import React, { useState, useEffect } from 'react';
import { TextInput, Button, Modal, Notification } from "@mantine/core";
import { createStyles } from "@mantine/core";
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useChatStore } from "../stores/ChatStore";
import { update } from "@/stores/ChatActions";
import { useTranslation } from 'react-i18next';

const useStyles = createStyles((theme) => ({
  loginRegisterButton: {
    backgroundColor: theme.colors.dark[6], // 使用了指定的背景色
    // 其他需要的样式，如边距、字体颜色、圆角等
  },
}));

type Props = { 
  isOpen: boolean; 
  onClose: () => void; 
  onLogin: (user:object) => void; 
};

const LoginPage: React.FC<Props> = ({ isOpen, onClose, onLogin }) => {
  
  const { classes } = useStyles();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [usernameError, setUsernameError] = useState<string | null>(null);

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.currentTarget.value;
    setUsername(newUsername);
    setUsernameError(newUsername === '' ? t('user-check-usernotempty') : null);
  };
  
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.currentTarget.value;
    setPassword(newPassword);
    setPasswordError(newPassword === '' ? t('user-check-pwdnotempty') : null);
  }


  const handleLogin = async () => {
    setUsernameError(username === '' ? t('user-check-usernotempty') : null);
    setPasswordError(password === '' ? t('user-check-pwdnotempty') : null);

    if(username !== '' && password !== '') {
      const data = {identifier: `${username}`, password: `${password}`}
      console.log(data);
      // 登录
      try {
        const response = await axios.post('/api/auth/login', data);
        if (response.status === 201) {
          // console.log("==================")
          // console.log(response)
          const jwt = response.data.jwt
          const user = response.data.user
          // console.log("==============")
          // console.log("==============jwt,",jwt)
          // console.log("==============user,",user)
          // 存储到全局状态
          useChatStore.setState({ jwt: jwt, user: user,
            "apiKeyAzure": "f53343f59d4d4047a6799344f267f61a",
            "apiKeyAzureRegion": "southeastasia",
            "autoSendStreamingSTT": false,
           });
          
          showNotification({
            title: 'success',
            message: t('user-login-success'),
            color: 'teal',
          });
          // 取配置信息
          await fetchConfig(jwt)
          onClose();
          onLogin(user);
        }
      }catch (error:any) {
        // console.log("==================")
        // console.log(error)
        let errorMsg = t('user-login-fail'); 

        showNotification({
          title: 'fail',
          message: errorMsg+": " + error.response.data.error,
          color: 'red', 
        });
      }
      
    }
  };

  // 定义获取配置信息的函数
// 定义获取配置信息的函数
const fetchConfig = async (jwt: string) => {
  try {
    const response = await axios.get('/api/config', {
      headers: {
        Authorization: 'Bearer ' + jwt,
      },
    });
    if (response.status === 201) { 
      const config = response.data.data;
      console.log("----------------config:", config);

      // 获取当前的 settingsForm
      const currentSettingsForm = useChatStore.getState().settingsForm;
      const azure_role_id = config.attributes.azure_role.split("--")[0]
      let rate = config.attributes.azure_rate
      if (rate == undefined || rate == "")
        rate = "0";
      if (!rate.includes('%'))
        rate = rate + "%";
      let pitch = config.attributes.azure_pitch
      if (pitch == undefined || pitch == "")
        pitch = "0";
      if (!pitch.includes('%'))
        pitch = pitch + "%";
      let breakms = config.attributes.breakms
      if (breakms == undefined || breakms == "")
        breakms = "0";
      // 沉浸式状态
      let isImmersive = useChatStore.getState().isImmersive
      if (isImmersive == undefined || isImmersive == null){
        isImmersive = false;
      }
        
      update({
        apiKey: config.attributes.OPENAI_KEY,
        colorScheme: config.attributes.theme,
        baseUrl: config.attributes.BASE_URL,
        prompt: config.attributes.prompt,
        azureRate: rate,
        azurePitch: pitch,
        azureBreakms: breakms,
        isImmersive: isImmersive,
        settingsForm: {
          ...currentSettingsForm, // 先保留现有的 settingsForm 值
          // ...config.attributes.settingsForm, // 合并新的 settingsForm 值
          model: config.attributes.model, // 设置新的模型值
          voice_id_azure: azure_role_id,
          auto_detect_language_azure: false
        }
      });
    }
  } catch (error) {
    console.log("================== get config error", error)
  }
}

useEffect(() => {
  // 每当语言改变时，重置校验错误消息
  setUsernameError(username === '' ? t('user-check-usernotempty') : null);
  setPasswordError(password === '' ? t('user-check-pwdnotempty') : null);
}, [t, username, password]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={t('user-login')}
      size="lg"
    >
      <div style={{ marginBottom: '20px' }}>
        <TextInput 
          placeholder={t('user-username')}
          value={username}
          onChange={handleChangeUsername}
        />
        {usernameError && <Notification title={usernameError} color="red" />}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <TextInput 
          placeholder={t('user-password')}
          type="password"
          value={password}
          onChange={handleChangePassword}
        />
        {passwordError && <Notification title={passwordError} color="red" />}
      </div>
      <Button  className={classes.loginRegisterButton} onClick={handleLogin} color="violet">{t('user-login')}</Button>
    </Modal>
  );
};

export default LoginPage;