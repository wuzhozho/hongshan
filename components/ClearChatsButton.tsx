import React, { useEffect, useState, MouseEvent } from "react"
import { IconCheck, IconTrash } from "@tabler/icons-react"
import { useTranslation } from 'react-i18next';
import { useChatStore } from "@/stores/ChatStore";

interface Props {
  clearHandler: () => void
  classes: {
    link: string
    linkIcon: string
  }
}

const ClearChatsButton: React.FC<Props> = ({ clearHandler, classes }) => {
  const [awaitingConfirmation, setAwaitingConfirmation] = useState<boolean>(false)
  const { t, i18n } = useTranslation();
  const language = useChatStore((state) => state.lan);

  const clickHandler = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    
    if (awaitingConfirmation) {
      clearHandler()
      setAwaitingConfirmation(false)
    } else {
      setAwaitingConfirmation(true)
    }
  }

  const cancelConfirmation = () => {
    setAwaitingConfirmation(false)
  }

  useEffect(() => {
    // 从全局状态读取登录信息
    const userState = useChatStore.getState().user;
    if (language) {
      i18n.changeLanguage(language); // 根据全局状态改变语言
    }
  }, [language, i18n]);

  return (
    <a href="#" className={classes.link} onClick={clickHandler} onBlur={cancelConfirmation}>
      {
        awaitingConfirmation
          ? <>
              <IconCheck className={classes.linkIcon} stroke={1.5} />
              <span>{t('menu-clearchats_confirm')}</span>
            </>
          : <>
              <IconTrash className={classes.linkIcon} stroke={1.5} />
              <span>{t('menu-clearchats')}</span>
            </>
      }
    </a>
  )
}

export default ClearChatsButton
