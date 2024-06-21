'use client';
import Header from '@/src/components/Header';
import { useState, useEffect, useRef } from 'react';
import star_icon from '@/public/images/star_icon.png';
import arrow_right_icon from '@/public/images/arrow_next_right_icon.png';
import arrow_left_icon from '@/public/images/arrow_back_left_icon.png';
import styles from '@/src/styles/Editor.module.css';
import Image from 'next/image';
import { CiSearch } from 'react-icons/ci';
import React from 'react';
import ChatBotArea from '@/src/components/ChatBotArea';

const page = () => {
  const [minWidth, maxWidth, defaultWidth] = [300, 500, 350];
  const [minWidth2, maxWidth2, defaultWidth2] = [50, 500, 350];
  const [width, setWidth] = useState(defaultWidth);
  const [width2, setWidth2] = useState(defaultWidth2);
  const [isHovered, setIsHovered] = useState(false);
  const [sidebar2visible, setSidebar2visible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar2Close = () => {
    setSidebar2visible(false);
    setWidth2(minWidth2);
    console.log(width2, sidebar2visible, 'hello');
  };
  const toggleSideBar2Open = () => {
    setSidebar2visible(true);
    setWidth2(defaultWidth2);
  };
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const facts = [
    {
      title: 'La Photosynthèse',
      content:
        "La photosynthèse est un processus utilisé par les plantes et d'autres organismes pour convertir l'énergie lumineuse en énergie chimique. Ce processus se déroule principalement dans les feuilles des plantes grâce à la chlorophylle. En plus de fournir de l'énergie aux plantes, la photosynthèse produit de l'oxygène, essentiel pour la respiration de nombreux organismes.",
    },
    {
      title: "L'Évolution de l'Homme",
      content:
        "L'évolution humaine est le processus de changement et de développement qui a conduit à l'apparition de l'Homo sapiens en tant qu'espèce distincte. Ce processus a commencé il y a environ 7 millions d'années avec les premiers ancêtres bipèdes et s'est poursuivi avec l'apparition d'espèces telles que l'Homo habilis, l'Homo erectus, et enfin l'Homo sapiens.",
    },
    {
      title: "L'Histoire du Cameroun",
      content:
        "Le Cameroun a été colonisé par l'Allemagne en 1884 avant de passer sous le contrôle franco-britannique après la Première Guerre mondiale. En 1960, le Cameroun français a obtenu son indépendance, suivi par le Cameroun britannique en 1961. Depuis lors, le Cameroun est devenu une république unie et a connu divers défis politiques et économiques.",
    },
    {
      title: 'Le Fleuve Congo',
      content:
        "Le fleuve Congo est le deuxième plus long fleuve d'Afrique et le plus profond du monde. Il traverse plusieurs pays, dont la République du Congo et la République Démocratique du Congo, et est une source vitale d'eau et de transport pour des millions de personnes. Sa biodiversité unique comprend des espèces endémiques telles que les poissons du genre 'Microctenopoma'.",
    },
    {
      title: 'Les Premières Civilisations',
      content:
        "Les premières civilisations humaines, telles que la Mésopotamie et l'Égypte ancienne, ont émergé il y a plus de 5 000 ans. Ces civilisations ont développé des systèmes d'écriture, des structures politiques complexes, et des avancées technologiques significatives qui ont jeté les bases de la civilisation moderne.",
    },
  ];
  const [filteredFacts, setFilteredFacts] = useState(facts);
  useEffect(() => {
    const filtered = facts.filter((fact) =>
      fact.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFacts(filtered);
  }, [searchQuery]);

  const isResized = useRef(false);
  const isResized2 = useRef(false);
  const openChatbot = () => {
    setIsHovered(false);
    setChatbotVisible(true);
  };
  const closeChatbot = () => {
    setChatbotVisible(false);
  };
  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      setWidth(parseInt(savedWidth));
    }

    const savedWidth2 = localStorage.getItem('sidebarWidth2');
    if (savedWidth2) {
      setWidth2(parseInt(savedWidth2));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarWidth', width.toString());
  }, [width]);

  useEffect(() => {
    localStorage.setItem('sidebarWidth2', width2.toString());
  }, [width2]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResized.current) {
        setWidth((previousWidth) => {
          const newWidth = previousWidth + e.movementX;
          const isWidthInRange = newWidth >= minWidth && newWidth <= maxWidth;
          return isWidthInRange ? newWidth : previousWidth;
        });
      }
      if (isResized2.current) {
        setWidth2((previousWidth) => {
          const newWidth2 = previousWidth - e.movementX; // Reverse the direction for the right sidebar
          const isWidthInRange2 =
            newWidth2 >= minWidth2 && newWidth2 <= maxWidth2;
          return isWidthInRange2 ? newWidth2 : previousWidth;
        });
      }
    };

    const handleMouseUp = () => {
      isResized.current = false;
      isResized2.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="bg-slate-100 overflow-hidden w-full h-screen">
      <Header />

      <div className="flex w-full h-full">
        {/* Sidebar1 section */}
        <section className="flex p-2">
          <div
            className="h-full flex flex-col justify-between bg-white border-2 rounded-lg  overflow-auto p-2 relative"
            style={{ width: `${width / 16}rem` }}
          >
            Sidebar
          </div>
          <div
            className="w-1 cursor-col-resize bg-slate-100"
            onMouseDown={() => {
              isResized.current = true;
            }}
          />
        </section>

        {/* Main Section  */}
        <section className="w-full bg-white overflow-hidden  relative border-2 rounded-lg mt-2">
          <div className="">EDITION DES CONTENUS</div>
          <div className="px-24 py-2 mx-auto h-full overflow-y-auto">
            <p></p>
          </div>
          {/* ChatBot Icon Area */}
          {!chatbotVisible ? (
            <>
              <div className={styles.chatbot_container}>
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={styles.img_container}
                  onClick={openChatbot}
                >
                  <Image
                    className={styles.img}
                    src={star_icon}
                    alt="chat bot"
                  />
                </div>
              </div>
              {/* chatbot description */}
              <div
                style={{
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                  visibility: isHovered ? 'visible' : 'hidden',
                }}
                className={styles.description_container}
              >
                <p>Demandez à l'IA</p>
                <p className="text-gray-400">
                  Trouvez des pages et obtenez des réponses sur n'importe quoi
                  dans votre composition.
                </p>
              </div>
            </>
          ) : (
            // chatbot display
            <div>
              <ChatBotArea onClose={closeChatbot} />
            </div>
          )}
        </section>

        {/* Sidebar2 section */}

        <section className="flex p-2">
          {/* <div
            className="w-1 cursor-col-resize bg-slate-100"
            onMouseDown={() => {
              isResized2.current = true;
            }}
          /> */}
          <div
            className="h-full flex flex-col justify-between pb-8 bg-white border-2 rounded-lg transition-width duration-200 overflow-auto p-2 relative"
            style={{
              width: `${width2 / 16}rem`,
            }}
          >
            {!sidebar2visible ? (
              <div
                onClick={toggleSideBar2Open}
                className={styles.arrow_container}
              >
                <Image
                  className={styles.right_arrow}
                  src={arrow_left_icon}
                  alt="icon close sidebar"
                />
              </div>
            ) : (
              <div>
                <div
                  onClick={toggleSidebar2Close}
                  className={styles.arrow_container}
                >
                  <Image
                    className={styles.right_arrow}
                    src={arrow_right_icon}
                    alt="icon close sidebar"
                  />
                </div>
                <section className="w-full h-full p-2 flex flex-col justify-between">
                  <div className="h-12 w-full border-2  border-customGray bg-white rounded-lg  flex items-center pr-2">
                    <div className="h-10 w-10 flex items-center justify-center">
                      <CiSearch size={24} />
                    </div>
                    <input
                      type="text"
                      className="bg-transparent h-10 w-full outline-none"
                      placeholder="Rechercher..."
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {filteredFacts.map((value, index) => (
                    <div
                      className="bg-gray-100 w-full h-full m-auto mt-4 p-2 overflow-hidden gap-2 flex flex-col "
                      style={{ borderRadius: 8 }}
                      key={index}
                    >
                      <div className="flex border-b border-customGray items-center gap-2">
                        <p className={styles.node_style}>No</p>
                        <p className={styles.title_node}>{value.title}</p>
                      </div>
                      <p>{value.content}</p>
                    </div>
                  ))}
                </section>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
