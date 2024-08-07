import React, { useState, useEffect } from 'react';
import { TextInput, Button, Modal, Notification } from "@mantine/core";
import { createStyles } from "@mantine/core";
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useChatStore } from "../stores/ChatStore";
import { useTranslation } from 'react-i18next';

// 修改密码
const useStyles = createStyles((theme) => ({
  loginRegisterButton: {
    backgroundColor: theme.colors.dark[6], // 使用了指定的背景色
  },
  // 可能还有其他样式定义...
}));

type Props = { 
  isOpen: boolean; 
  onClose: () => void; 
  onRegister: () => void; 
};

const RegisterPage2: React.FC<Props> = ({ isOpen, onClose, onRegister }) => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const {jwt} = useChatStore(state => ({jwt: state.jwt}));
  
  // const handleChangeUsername = (event) => {
  //   const newUsername = event.currentTarget.value;
  //   setUsername(newUsername);
  //   setUsernameError(newUsername === '' ? '用户名不能为空。' : null);
  // }

  // const handleChangeEmail = (event) => {
  //   const newEmail = event.currentTarget.value;
  //   setEmail(newEmail);
  //   setEmailError(newEmail === '' ? '邮箱不能为空。' : null);
  // }
  
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.currentTarget.value;
    setPassword(newPassword);
    if (newPassword === '') {
      setPasswordError(t('user-check-pwdnotempty'));
    } else if (newPassword.length < 6) {
      setPasswordError(t('user-check-pwdmin6'));
    } else {
      setPasswordError(null);
    }
  }

  const handleChangeConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = event.currentTarget.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordError(newConfirmPassword !== password ? t('user-check-pwdnotsame') : null);
  }

  const handleChangeCurrentPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCurrentPassword = event.currentTarget.value;
    setCurrentPassword(newCurrentPassword);
    if (newCurrentPassword === '') {
      setCurrentPasswordError(t('user-check-pwdnotempty'));
    } else if (newCurrentPassword.length < 6) {
      setCurrentPasswordError(t('user-check-pwdmin6'));
    } else {
      setCurrentPasswordError(null);
    }
  }

  const handleRegister = async () => {
    // setUsernameError(username === '' ? '用户名不能为空。' : null);
    // setEmailError(email === '' ? '邮箱不能为空。' : null);
    setCurrentPasswordError(currentPassword === '' ? t('user-check-pwdnotempty') : null);
    setPasswordError(password === '' ? t('user-check-pwdnotempty') : null);
    setConfirmPasswordError(password !== confirmPassword ? t('user-check-pwdnotsame') : null);

    if(currentPassword !== '' && password !== '' && confirmPassword !== '' && password === confirmPassword) {
      const data = {
        currentPassword: `${currentPassword}`,
        password: `${password}`,
        passwordConfirmation: `${confirmPassword}`
      }
      console.log(data);
      // 修改密码
      try {
        const response = await axios.post('/api/auth/changepwd', data, {
                headers: {
                  Authorization: 'Bearer ' + jwt,
                },
              });
        if (response.status === 201) {
          // console.log("==================")
          console.log(response)

          showNotification({
            title: 'success',
            message: t('user-pwd-success'),
            color: 'teal',
          });

        }
      }catch (error:any) {
        // console.log("==================")
        // console.log(error)
        let errorMsg = t('user-pwd-fail'); 
        
        showNotification({
          title: 'fail',
          message: errorMsg+": " + error.response.data.error,
          color: 'red', 
        });
      }
      onClose();
      onRegister();
    }
  };

  useEffect(() => {
    setCurrentPasswordError(currentPassword === '' 
        ? t('user-check-pwdnotempty') 
        : (currentPassword.length < 6 ? t('user-check-pwdmin6') : null)
    );
    setPasswordError(password === '' 
        ? t('user-check-pwdnotempty') 
        : (password.length < 6 ? t('user-check-pwdmin6') : null)
    );
    setConfirmPasswordError(password !== confirmPassword 
        ? t('user-check-pwdnotsame') 
        : null
    );
  }, [t, currentPassword, password, confirmPassword]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={t('user-changepwd')}
      size="lg"
    >
      {/* <div style={{ marginBottom: '20px' }}>
        <TextInput 
          placeholder="用户名" 
          value={username}
          onChange={handleChangeUsername}
        />
        {usernameError && <Notification title={usernameError} color="red" />}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <TextInput 
          type="email"
          placeholder="邮箱" 
          value={email}
          onChange={handleChangeEmail}
        />
        {emailError && <Notification title={emailError} color="red" />}
      </div> */}
      <div style={{ marginBottom: '20px' }}>
        <TextInput
          placeholder={t('user-pwd-old')}
          type="password"
          value={currentPassword}
          onChange={handleChangeCurrentPassword}
        />
        {currentPasswordError && <Notification title={currentPasswordError} color="red" />}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <TextInput 
          placeholder={t('user-pwd-new')}
          type="password"
          value={password}
          onChange={handleChangePassword}
        />
        {passwordError && <Notification title={passwordError} color="red" />}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <TextInput 
          placeholder={t('user-pwd-confirm')}
          type="password"
          value={confirmPassword}
          onChange={handleChangeConfirmPassword}
        />
        {confirmPasswordError && <Notification title={confirmPasswordError} color="red" />}
      </div>
      <Button className={classes.loginRegisterButton} onClick={handleRegister} color="violet">{t('user-changepwd')}</Button>
    </Modal>
  );
};

export default RegisterPage2;