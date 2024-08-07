import React, { useState, useEffect } from 'react';
import { TextInput, Button, Modal, Notification } from "@mantine/core";
import { createStyles } from "@mantine/core";
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
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
  onRegister: () => void; 
};


const RegisterPage: React.FC<Props> = ({ isOpen, onClose, onRegister }) => {
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

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.currentTarget.value;
    setUsername(newUsername);
    setUsernameError(newUsername === '' ? t('user-check-usernotempty') : null);
  }

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.currentTarget.value;
    setEmail(newEmail);
    if (newEmail === '') {
      setEmailError(t('user-check-emailnotempty'));
    } else if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
      setEmailError(t('user-check-emailvalidator'))
    } else {
      setEmailError(null);
    }
  }
  
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

  const  handleRegister = async () => {
    setUsernameError(username === '' ? t('user-check-usernotempty') : null);
    setEmailError(email === '' ? t('user-check-pwdnotempty') : null);
    setPasswordError(password === '' ? t('user-check-emailnotempty') : null);
    setConfirmPasswordError(password !== confirmPassword ? t('user-check-pwdnotsame') : null);

    if(username !== '' && password !== '' && email !== '' && password === confirmPassword) {
      const data = {username: `${username}`, password: `${password}`, email: `${email}`}
      console.log(data);
      // 注册用户
      try {
            const response = await axios.post('/api/auth/register', data);
            if (response.status === 201) {
              // console.log("==================")
              // console.log(response)

              showNotification({
                title: 'success',
                message: t('user-reg-success'),
                color: 'teal',
              });

            }
        }catch (error:any) {
          // console.log("==================")
          // console.log(error)
          let errorMsg = t('user-reg-fail'); 
          
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
    setUsernameError(username === '' ? t('user-check-usernotempty') : null);
    setEmailError(email === ''
        ? t('user-check-emailnotempty')
        : (!/^\S+@\S+\.\S+$/.test(email) ? t('user-check-emailvalidator') : null)
    );
    setPasswordError(password === ''
        ? t('user-check-pwdnotempty')
        : (password.length < 6 ? t('user-check-pwdmin6') : null)
    );
    setConfirmPasswordError(confirmPassword !== password ? t('user-check-pwdnotsame') : null);
  }, [t, username, email, password, confirmPassword]);
  
  
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={t('user-reg')}
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
          type="email"
          placeholder={t('user-email')}
          value={email}
          onChange={handleChangeEmail}
        />
        {emailError && <Notification title={emailError} color="red" />}
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
      <div style={{ marginBottom: '20px' }}>
        <TextInput 
          placeholder={t('user-pwd-confirm')}
          type="password"
          value={confirmPassword}
          onChange={handleChangeConfirmPassword}
        />
        {confirmPasswordError && <Notification title={confirmPasswordError} color="red" />}
      </div>
      <Button className={classes.loginRegisterButton} onClick={handleRegister} color="violet">{t('user-reg')}</Button>
    </Modal>
  );
};

export default RegisterPage;