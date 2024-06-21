'use client';
import React, { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from '@/src/styles/Chatbot.module.css';
import Image from 'next/image';
import cross from '@/public/images/cross.svg';
import arrow_up from '@/public/images/arrow_up_icon.svg';
import chat_image from '@/public/images/chat_component.png';
import { IoMdSend } from 'react-icons/io';
import { BiBot, BiUser } from 'react-icons/bi';
import axios from 'axios';
interface ChatMessage {
  sender: string;
  sender_id?: string;
  recipient_id?: string;
  msg: string;
}
interface YourComponentProps {
  onClose: () => void;
}

const ChatBotArea: React.FC<YourComponentProps> = ({ onClose }) => {
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      sender_id: 'user',
      recipient_id: 'bot',
      msg: "Bienvenue ! Comment puis-je vous aider aujourd'hui ?",
    },
    // {
    //   sender: 'user',
    //   sender_id: 'user',
    //   recipient_id: 'bot',
    //   msg: 'Hi  Q&A combines all of GPT-4 general knowledge with the unique context of your Notion workspace. Ask me about anything! eral knowledge with the unique context of your Notion workspace. Ask me about anything!eral knowledge with the unique context of your Notion workspace. Ask me about anything!',
    // },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [botTyping, setbotTyping] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    const objDiv = document.getElementById('messageArea');
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }, [chat]);

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    const name = 'Xccm';
   
    const request_temp = { sender: 'user', sender_id: name, msg: inputMessage };

    if (inputMessage !== '') {
      setChat((chat) => [...chat, request_temp]);
      setbotTyping(true);
      setInputMessage('');
      console.log(inputMessage, 'i hope');
      //   rasaAPI(name, inputMessage);
      geminiAPI(name, inputMessage);
    } else {
      window.alert('Veuillez saisir un message valide');
    }
  };

  useEffect(() => {
    const textareaEle = textAreaRef.current;

    if (!textareaEle) return;

    const adjustTextareaHeight = () => {
      textareaEle.style.height = 'auto';
      textareaEle.style.height = `${textareaEle.scrollHeight}px`;
    };

    textareaEle.addEventListener('input', adjustTextareaHeight);

    return () => {
      textareaEle.removeEventListener('input', adjustTextareaHeight);
    };
  }, []);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  const geminiAPI = async function handleClick(name: string, msg: string) {
    try {
      const response = await axios.post(
        'http://192.168.66.245:3001/api/v1/gemini/ask',
        {
          question: msg,
        }
      );

      console.log(response.data, 'hello');

      if (response.data && response.data.length > 0) {
        const temp = response.data;
        const recipient_id = 'bot';
        const recipient_msg = response.data;
        const response_temp = {
          sender: 'bot',
          recipient_id: recipient_id,
          msg: recipient_msg,
        };
        setbotTyping(false);
        setChat((chat) => [...chat, response_temp]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const rasaAPI = async function handleClick(name: String, msg: String) {
    //chatData.push({sender : "user", sender_id : name, msg : msg});

    await fetch('http://localhost:5005/webhooks/rest/webhook', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        charset: 'UTF-8',
      },
      credentials: 'same-origin',
      body: JSON.stringify({ sender: name, message: msg }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          const temp = response[0];
          const recipient_id = temp['recipient_id'];
          const recipient_msg = temp['text'];
          const response_temp = {
            sender: 'bot',
            recipient_id: recipient_id,
            msg: recipient_msg,
          };
          setbotTyping(false);
          setChat((chat) => [...chat, response_temp]);
          // scrollBottom();
        }
      });
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <div className={styles.chatBot_container}>
      <div className={styles.header_container}>
        <p className="text-white font-semibold">XCCMBot</p>
        <div className={styles.img_container} onClick={onClose}>
          <Image style={{ width: '24px' }} src={cross} alt="close chat area" />
        </div>
      </div>

      <div id="messageArea" className={styles.chatbot_body}>
        {chat.map((user, key) => (
          <div key={key} className={styles.chatbot_body_2}>
            {user.sender === 'bot' ? (
              <div className={styles.bot_response}>
                <div className="flex items-start gap-2">
                  <Image
                    style={{ width: '28px', alignSelf: 'flex-start' }}
                    src={chat_image}
                    alt="bot_logo"
                  />
                  <p>{user.msg}</p>
                </div>
              </div>
            ) : (
              <div className={styles.user_response}>
                <p className="usermsg">{user.msg}</p>
              </div>
            )}
          </div>
        ))}
        {botTyping && (
          <div className="flex items-center gap-2">
            <p className='text-gray-500'><i>En train d'écrire</i> </p>
            <div className={styles.loader}> </div>
          </div>
        )}
      </div>
      <div className={styles.send_container}>
        <div
          className={`${styles.input_body} ${
            isFocused ? styles.blueOutline : ''
          }`}
        >
          <textarea
            ref={textAreaRef}
            rows={1}
            value={inputMessage}
            onKeyDown={handleKeyDown}
            className={styles.input}
            onChange={(e) => setInputMessage(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          ></textarea>
          <div
            className={styles.send_img_container}
            style={{
              backgroundColor: inputMessage.trim() === '' ? '#ccc' : 'black',
            }}
            onClick={handleSubmit}
          >
            <Image style={{ width: '20px' }} src={arrow_up} alt="send_btn" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotArea;
