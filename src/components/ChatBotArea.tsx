'use client';
import React, { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from '@/src/styles/Chatbot.module.css';
import copy_icon from '@/public/images/copy_icon.svg';
import Image from 'next/image';
import cross from '@/public/images/cross.svg';
import arrow_up from '@/public/images/arrow_up_icon.svg';
import chat_image from '@/public/images/chat_component.png';
import { IoMdSend } from 'react-icons/io';
import { BiBot, BiUser } from 'react-icons/bi';
import axios from 'axios';
import { ACTION_REFRESH } from 'next/dist/client/components/router-reducer/router-reducer-types';
import { FaKeybase } from 'react-icons/fa';
interface ChatMessage {
  sender: string;
  sender_id?: string;
  msg: string;
}
interface YourComponentProps {
  onClose: () => void;
}

const ChatBotArea: React.FC<YourComponentProps> = ({ onClose }) => {
  const [chatRasa, setChatRasa] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      sender_id: 'user',
      msg: "Bienvenue ! Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  
  const [chatGemini, setChatGemini] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      sender_id: 'user',
      msg: "Bienvenue ! Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const [inputMessageGemini, setInputMessageGemini] = useState<string>('');
  const [inputMessageRasa, setInputMessageRasa] = useState<string>('');
  const [botTyping, setbotTyping] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [rasaActive, setRasaActive] = useState(false);
  const [geminiActive, setGeminiActive] = useState(true);
  const [minWidth, maxWidth, defaultWidth] = [380, 600, 420];
  const [width, setWidth] = useState(defaultWidth);

  // handle resizable chatbot
  const isResized = useRef(false);
  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      setWidth(parseInt(savedWidth));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('sidebarWidth', width.toString());
  }, [width]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResized.current) {
        setWidth((previousWidth) => {
          const newWidth = previousWidth - e.movementX;
          const isWidthInRange = newWidth >= minWidth && newWidth <= maxWidth;
          return isWidthInRange ? newWidth : previousWidth;
        });
      }
    };
    const handleMouseUp = () => {
      isResized.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  //ends here

  // handle which api is active
  const handleRasaActive = () => {
    setRasaActive(true);
    setGeminiActive(false);
    setMenuVisible(false);
  };
  const handleGeminiActive = () => {
    setGeminiActive(true);
    setRasaActive(false);
    setMenuVisible(false);
  };

  //ends here

  //rasa api call and functions
  useEffect(() => {
    const objDiv = document.getElementById('rasaMessageArea');
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }, [chatRasa]);
  const handleSubmitRasa = (evt: FormEvent) => {
    evt.preventDefault();
    const name = 'Xccm';

    const request_temp = {
      sender: 'user',
      sender_id: name,
      msg: inputMessageRasa,
    };

    if (inputMessageRasa !== '') {
      setChatRasa((chat) => [...chat, request_temp]);
      setbotTyping(true);
      setInputMessageRasa('');
      console.log(inputMessageRasa, 'i hope');
      rasaAPI(name, inputMessageRasa);
    } else {
      window.alert('Veuillez saisir un message valide');
    }
    // console.log(chatRasa, 'chatRasa');
  };

  const handleKeyDownRasa = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitRasa(e);
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
          const recipient_msg = temp['text'];
          const response_temp = {
            sender: 'bot',
            msg: recipient_msg,
          };
          setbotTyping(false);
          setChatRasa((chatRasa) => [...chatRasa, response_temp]);
          // scrollBottom();
        }
      });
  };
  const postRasaChats = async () => {
    try {
      const response = await axios.post('https://api.', chatRasa);
      if (response.data.success) {
        console.log('Sent rasa chat successfully');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getRasaChats = async () => {
    try {
      const response = await axios.get('your_backend_url/rasa/chat');
      setChatRasa(response.data);
    } catch (error) {
      console.error('Error getting Rasa chats:', error);
      return null;
    }
  };
  ////////////////////////////////////////////////////////////////////////

  // gemini api calls and functions
  useEffect(() => {
    const objDiv = document.getElementById('geminiMessageArea');
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }, [chatGemini]);

  const handleSubmitGemini = (evt: FormEvent) => {
    evt.preventDefault();
    const name = 'Xccm';

    const request_temp = {
      sender: 'user',
      sender_id: name,
      msg: inputMessageGemini,
    };

    if (inputMessageGemini !== '') {
      setChatGemini((chat) => [...chat, request_temp]);
      setbotTyping(true);
      setInputMessageGemini('');
      console.log(inputMessageGemini, 'i hope');
      geminiAPI(name, inputMessageGemini);
    } else {
      window.alert('Veuillez saisir un message valide');
    }
    console.log(chatGemini, 'chat Gemini');
  };

  const handleKeyDownGemini = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitGemini(e);
    }
  };
  const geminiAPI = async function handleClick(name: string, msg: string) {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/gemini/ask',
        {
          question: msg,
        }
      );

      console.log(response.data, 'hello');

      if (response.data && response.data.length > 0) {
        const temp = response.data;
        const recipient_msg = response.data;
        const response_temp = {
          sender: 'bot',
          msg: recipient_msg,
        };
        setbotTyping(false);
        setChatGemini((chatGemini) => [...chatGemini, response_temp]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //parse Gemini message
  const parseMessageGemini = (msg: string) => {
    const lines = msg.split('\n');
    return lines.map((line, index) => (
      <p key={index}>
        {line.startsWith('**') && line.endsWith('**') ? (
          <strong>{line.slice(2, -2)}</strong>
        ) : line.startsWith('*') ? (
          <>• {line.slice(1)}</>
        ) : (
          line
        )}
      </p>
    ));
  };
  const postGeminiChats = async () => {
    try {
      const response = await axios.post('https://api.', chatGemini);
      if (response.data.success) {
        console.log('Sent rasa chat successfully');
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getGeminiChats = async () => {
    try {
      const response = await axios.get('your_backend_url/rasa/chat');
      setChatGemini(response.data);
    } catch (error) {
      console.error('Error getting Rasa chats:', error);
      return null;
    }
  };
  ////////////////////////////////////////////////////////////////

  // handle menu visibility
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // handle text area height change
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

  // handle focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  ////// copy to clipboard
  const copyLastBotMessageGemini = () => {
    // Find the index of the last message sent by the bot
    let lastIndex = -1;
    for (let i = chatGemini.length - 1; i >= 0; i--) {
      if (chatGemini[i].sender === 'bot') {
        lastIndex = i;
        break;
      }
    }

    // If a bot message was found, copy it to the clipboard
    if (lastIndex !== -1) {
      const lastBotMessage = chatGemini[lastIndex].msg;
      navigator.clipboard
        .writeText(lastBotMessage)
        .then(() => console.log('Message copied'))
        .catch((error) => console.error('Error copying message:', error));
    } else {
      console.log('No bot message found');
    }
  };

  const copyLastBotMessageRasa = () => {
    // Find the index of the last message sent by the bot
    let lastIndex = -1;
    for (let i = chatRasa.length - 1; i >= 0; i--) {
      if (chatRasa[i].sender === 'bot') {
        lastIndex = i;
        break;
      }
    }
    // If a bot message was found, copy it to the clipboard
    if (lastIndex !== -1) {
      const lastBotMessage = chatRasa[lastIndex].msg;
      navigator.clipboard
        .writeText(lastBotMessage)
        .then(() => console.log('Message copied'))
        .catch((error) => console.error('Error copying message:', error));
    } else {
      console.log('No bot message found');
    }
  };

  return (
    <>
      <section
        style={{ width: `${width / 16}rem` }}
        className={styles.chatBot_container2}
      >
        <div
          className=" cursor-col-resize "
          style={{
            borderRadius: '8px',
            backgroundColor: 'rgb(239, 239, 238)',
            width: '2px',
          }}
          onMouseDown={() => {
            isResized.current = true;
          }}
        />

        <div className={styles.chatBot_container}>
          <div className={styles.header_container}>
            <p className="text-white font-semibold">
              XCCMBot{geminiActive ? `: Gemini` : `: Rasa`}
            </p>
            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                className={styles.loaderbtn}
              ></button>
              <div className={styles.img_container} onClick={onClose}>
                <Image
                  style={{ width: '24px' }}
                  src={cross}
                  alt="close chat area"
                />
              </div>
            </div>
          </div>
          {/* menu to choose rasa or gemini */}
          {menuVisible && (
            <div className={styles.description_container}>
              <button onClick={handleGeminiActive} className={styles.btn_text}>
                Gemini API
              </button>
              <button onClick={handleRasaActive} className={styles.btn_text}>
                Rasa ChatBot
              </button>
            </div>
          )}
          {/* Gemini Active */}
          {geminiActive && (
            <>
              <div className={styles.chatbot_body} id="geminiMessageArea">
                {chatGemini.map((actor, key) => (
                  <div key={key} className={styles.chatbot_body_2}>
                    {actor.sender === 'bot' ? (
                      <div className={styles.bot_response}>
                        <div className="flex items-start gap-2">
                          <Image
                            style={{ width: '28px', alignSelf: 'flex-start' }}
                            src={chat_image}
                            alt="bot_logo"
                          />
                          <div>
                            <div className="flex gap-1 flex-col">
                              <p>{parseMessageGemini(actor.msg)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.user_response}>
                        <p className="usermsg">{actor.msg}</p>
                      </div>
                    )}
                  </div>
                ))}
                {!botTyping && chatGemini.length > 2 && (
                  <div
                    onClick={copyLastBotMessageGemini}
                    className={styles.copy_style}
                  >
                    <Image
                      style={{ width: '20px' }}
                      src={copy_icon}
                      alt="copy_text_icon"
                    />
                    <p className="font-medium" style={{ fontSize: '14px' }}>
                      Copier
                    </p>
                  </div>
                )}
                {botTyping && (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-500">
                      <i>En train d'écrire</i>{' '}
                    </p>
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
                    value={inputMessageGemini}
                    onKeyDown={handleKeyDownGemini}
                    className={styles.input}
                    onChange={(e) => setInputMessageGemini(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  ></textarea>
                  <div
                    className={styles.send_img_container}
                    style={{
                      backgroundColor:
                        inputMessageGemini.trim() === '' ? '#ccc' : 'black',
                    }}
                    onClick={handleSubmitGemini}
                  >
                    <Image
                      style={{ width: '20px' }}
                      src={arrow_up}
                      alt="send_btn"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* rasa Active */}
          {rasaActive && (
            <>
              <div className={styles.chatbot_body} id="rasaMessageArea">
                {chatRasa.map((actor, key) => (
                  <div key={key} className={styles.chatbot_body_2}>
                    {actor.sender === 'bot' ? (
                      <div className={styles.bot_response}>
                        <div className="flex items-start gap-2">
                          <Image
                            style={{ width: '28px', alignSelf: 'flex-start' }}
                            src={chat_image}
                            alt="bot_logo"
                          />
                          <div className="">{actor.msg}</div>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.user_response}>
                        <p className="usermsg">{actor.msg}</p>
                      </div>
                    )}
                  </div>
                ))}
                {!botTyping && chatRasa.length > 2 && (
                  <div
                    onClick={copyLastBotMessageRasa}
                    className={styles.copy_style}
                  >
                    <Image
                      style={{ width: '20px' }}
                      src={copy_icon}
                      alt="copy_text_icon"
                    />
                    <p className="font-medium" style={{ fontSize: '14px' }}>
                      Copier
                    </p>
                  </div>
                )}
                {botTyping && (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-500">
                      <i>En train d'écrire</i>{' '}
                    </p>
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
                    value={inputMessageRasa}
                    onKeyDown={handleKeyDownRasa}
                    className={styles.input}
                    onChange={(e) => setInputMessageRasa(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  ></textarea>
                  <div
                    className={styles.send_img_container}
                    style={{
                      backgroundColor:
                        inputMessageRasa.trim() === '' ? '#ccc' : 'black',
                    }}
                    onClick={handleSubmitRasa}
                  >
                    <Image
                      style={{ width: '20px' }}
                      src={arrow_up}
                      alt="send_btn"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ChatBotArea;
