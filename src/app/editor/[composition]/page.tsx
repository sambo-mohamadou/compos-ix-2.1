"use client";
import Header from "@/src/components/Header";
import { useState, useEffect, useRef } from "react";
import star_icon from "@/public/images/star_icon.png";
import arrow_right_icon from "@/public/images/arrow_next_right_icon.png";
import arrow_left_icon from "@/public/images/arrow_back_left_icon.png";
import styles from "@/src/styles/Editor.module.css";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import React from "react";
import ChatBotArea from "@/src/components/ChatBotArea";
import "../../../styles/editor.css";
import { NodesCard } from "@/src/components/editorTools";
import { AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import htmlToPdfmake from "html-to-pdfmake";
import { generateDocx } from "./word-saver";
import { RichTextEditor } from "../../../components/editorTools";
import DOMPurify from "dompurify";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const createEmptyNotion = () => {
  return {
    id: new Date().getTime(), // Unique identifier for each Notion
    content: "",
    editorOpen: true,
  };
};

const EditorPage = ({ params }) => {
  //States for the width sizes
  const [minWidth, maxWidth, defaultWidth] = [300, 500, 350];
  const [minWidth2, maxWidth2, defaultWidth2] = [50, 500, 350];
  const [width, setWidth] = useState(defaultWidth);
  const [width2, setWidth2] = useState(defaultWidth2);
  const [isHovered, setIsHovered] = useState(false);
  const [sidebar2visible, setSidebar2visible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullContentIndex, setShowFullContentIndex] = useState<
    number | null
  >(null);

  const toggleSidebar2Close = () => {
    setSidebar2visible(false);
    setWidth2(minWidth2);
    console.log(width2, sidebar2visible, "hello");
  };
  const toggleSideBar2Open = () => {
    setSidebar2visible(true);
    setWidth2(defaultWidth2);
  };
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const facts = [
    {
      title: "La Photosynthèse",
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
      title: "Le Fleuve Congo",
      content:
        "Le fleuve Congo est le deuxième plus long fleuve d'Afrique et le plus profond du monde. Il traverse plusieurs pays, dont la République du Congo et la République Démocratique du Congo, et est une source vitale d'eau et de transport pour des millions de personnes. Sa biodiversité unique comprend des espèces endémiques telles que les poissons du genre 'Microctenopoma'.",
    },
    {
      title: "Les Premières Civilisations",
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

  /////Former States
  const [tableOfContents, setTableOfcontents] = useState([
    {
      nodeType: "DOC",
      nodeTitle: decodeURIComponent(params.composition),
      nodeLevel: "Co0",
      parent: undefined,
      htmlContent: "",
      isClicked: false,
      isChevronClicked: true,
      isEnterPressed: false,
    },
  ]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isNodeTitleModalActive, setIsNodeTitleActive] = useState(false);
  const [isNotionEditorActive, setIsNotionEditorActive] = useState(false);

  const [richTextValue, setRichTextValue] = useState("");

  const handleRichTextChange = (value: string) => {
    setRichTextValue(value);
  };

  const [renderingHtml, setRenderingHtml] = useState("");

  const [isHtmlHovered, setIsHtmlHovered] = useState(false);
  const [isPdfHovered, setIsPdfHovered] = useState(false);
  const [isWordHovered, setIsWordHovered] = useState(false);
  const [tableOfContentsComponents, setTableOfContentsComponents] = useState(
    []
  ); //Contiendra les composants de la table of content qui serront affichés (les NodeCard)
  const [selectedNode, setSelectedNode] = useState(null);
  const [enterPressedNotion, setEnterPressedNotion] = useState(null);

  //const sampleHTML = '<p>Alfred Hetsron Yepnjio</p><ul><li><strong>Sample</strong></li></ul><ol type="1"><li>you</li></ol><ul><li>content</li><li>state</li></ul><p></p>'
  const [htmlEditorContent, setHtmlEditorContent] = useState(null);
  const [defaultDraftHTML, setDefaultDraftHTML] = useState("");

  const [addNodeOptions, setAddNodeOptions] = useState(null);
  const [addNodeInfo, setAddNodeInfo] = useState(null);
  const [addNodeTitle, setAddNodeTitle] = useState("");
  /////

  /////For the resizabe propertiy of the main sections

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
    const savedWidth = localStorage.getItem("sidebarWidth");
    if (savedWidth) {
      setWidth(parseInt(savedWidth));
    }

    const savedWidth2 = localStorage.getItem("sidebarWidth2");
    if (savedWidth2) {
      setWidth2(parseInt(savedWidth2));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarWidth", width.toString());
  }, [width]);

  useEffect(() => {
    localStorage.setItem("sidebarWidth2", width2.toString());
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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  /////

  ///////Modal functions
  const handleOpenAddNodeModal = () => {
    if (selectedNode && selectedNode.isClicked) {
      setIsModalActive(true);
      setAddNodeTypes(selectedNode);
    }
  };
  const handleOpenAddTitleModal = (nodeInfo) => {
    setAddNodeInfo(nodeInfo);
    setIsNodeTitleActive(true);
  };
  const handleExitModal = () => {
    setSelectedNode(null);
    setIsModalActive(false);
    setIsNodeTitleActive(false);
    setAddNodeOptions([]);
    setAddNodeInfo(null);
    setAddNodeTitle("");
    let tempTOC = [...tableOfContents];
    setTableOfcontents([]);
    setTableOfContentsComponents([]);
    setTableOfcontents(tempTOC);
  };
  /////

  /////Some Useful functions for the tableOfContent and Nodes
  const insertElementAtPosition = (array, element, index) => {
    const newArray = [...array];
    newArray.splice(index, 0, element);
    return newArray;
  };

  const InsertionSort = (tab) => {
    //nombre des éléments dans le tableau
    var len = tab.length;
    var tmp, i, j;

    for (i = 1; i < len; i++) {
      //stocker la valeur actuelle
      tmp = tab[i];
      j = i - 1;
      while (
        j >= 0 &&
        Number.parseInt(tab[j].nodeLevel[tab[j].nodeLevel.length - 1]) >
          Number.parseInt(tmp.nodeLevel[tmp.nodeLevel.length - 1])
      ) {
        // déplacer le nombre
        tab[j + 1] = tab[j];
        j--;
      }
      //Insère la valeur temporaire à la position
      //correcte dans la partie triée.
      tab[j + 1] = tmp;
    }
    return tab;
  };

  const sortTOC = (newTable) => {
    const newTOC = [...newTable];
    const emptyTOC = [];
    //search for the three root: {DOC}
    for (let i = 0, c = newTOC.length; i < c; i++) {
      if (newTOC[i].parent === undefined) {
        emptyTOC.push(newTOC[i]);
        i = newTOC.length;
      }
    }
    //console.log(emptyTOC)
    const filtered = findChildIndexArrayInTOC(newTOC[0], newTable);
    console.log(filtered);
    //search for the direct children of each node
    for (let i = 0, c = newTOC.length; i < c; i++) {
      const children = findChildIndexArrayInTOC(newTOC[i].nodeLevel, newTable);
      const subTab = [];
      for (let j = 0, d = children.length; j < d; j++) {
        if (!emptyTOC.includes(children[j])) {
          subTab.push(children[j]);
        }
      }
      const indexOfNode = emptyTOC.indexOf(newTOC[i]);
      emptyTOC.splice(indexOfNode + 1, 0, ...subTab);
      console.log(emptyTOC);
    }
    console.log(emptyTOC);
    return emptyTOC;
  };

  const findChildIndexArrayInTOC = (parentNodeLevel, newTable) => {
    let tempTOC = [...newTable];
    let newChildren = [];
    for (let i = 0, c = tempTOC.length; i < c; i++) {
      if (
        tempTOC[i].parent !== undefined &&
        tempTOC[i].parent === parentNodeLevel
      ) {
        newChildren.push(tempTOC[i]);
      }
    }
    newChildren = InsertionSort(newChildren);
    console.log(newChildren);
    return newChildren;
  };

  /////Node Functions
  const updateEditedNodeTitle = (nodeInfo) => {
    if (nodeInfo) {
      setSelectedNode(nodeInfo);
      let tempTOC = [...tableOfContents];
      setTableOfcontents([]);
      tempTOC[nodeInfo.index].nodeTitle = nodeInfo.nodeTitle;
      setTableOfcontents(tempTOC);
    }
  };

  const setSelectedNodeInTOC = (nodeInfo) => {
    setSelectedNode(nodeInfo);
    if (nodeInfo) {
      let tempTOC = [...tableOfContents];
      setTableOfcontents([]);
      tempTOC[nodeInfo.index].isClicked = nodeInfo.isClicked;
      tempTOC[nodeInfo.index].isChevronClicked = nodeInfo.isChevronClicked;
      tempTOC[nodeInfo.index].isEnterPressed = nodeInfo.isEnterPressed;
      setTableOfcontents(tempTOC);
    }
  };

  const setEnterPressNotionInTOC = (nodeInfo) => {
    setEnterPressedNotion(nodeInfo);
    console.log(nodeInfo.htmlContent);
    setDefaultDraftHTML(nodeInfo.htmlContent);
    if (nodeInfo) {
      let tempTOC = [...tableOfContents];
      setTableOfcontents([]);
      tempTOC[nodeInfo.index].isClicked = nodeInfo.isClicked;
      tempTOC[nodeInfo.index].isChevronClicked = nodeInfo.isChevronClicked;
      tempTOC[nodeInfo.index].isEnterPressed = nodeInfo.isEnterPressed;
      setTableOfcontents(tempTOC);

      /* We Display the Editor if all condiions satisfy*/
      setIsNotionEditorActive(true);
    }
  };

  const setAddNodeTypes = (selectedNode) => {
    switch (selectedNode.nodeType) {
      case "DOC":
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
          {
            nodeType: "PART",
            nodeInitial: "Pt",
            nodeColor: "#34A853",
            textColor: "white",
          },
        ]);
        break;
      case "PART":
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
          {
            nodeType: "CHAPTER",
            nodeInitial: "Ch",
            nodeColor: "#FBBC05",
            textColor: "white",
          },
        ]);
        break;
      case "CHAPTER":
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
          {
            nodeType: "PARAGRAPH",
            nodeInitial: "Pr",
            nodeColor: "#EA4335",
            textColor: "white",
          },
        ]);
        break;
      case "PARAGRAPH":
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
        ]);
        break;
      default:
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
        ]);
        break;
    }
  };

  const handleAddNewNodeToTOC = (nodeTitle) => {
    setAddNodeTitle(nodeTitle);
    /* Add to TOC Logic Here */
    let tempTOC = [...tableOfContents];
    setTableOfcontents([]);
    setTableOfContentsComponents([]);
    tempTOC[selectedNode.index].isClicked = false;
    tempTOC[selectedNode.index].isChevronClicked = true;
    const newNode = {
      nodeType: addNodeInfo.nodeType,
      nodeTitle: nodeTitle,
      nodeLevel:
        selectedNode.nodeType !== "NOTION"
          ? `${addNodeInfo.nodeInitial}${tempTOC.length}`
          : `${selectedNode.nodeLevel}${tempTOC.length}`,
      parent: `${selectedNode.nodeLevel}`,
      htmlContent: "",
      isClicked: false,
      isChevronClicked: true,
      isEnterPressed: false,
    };
    const newTOC = insertElementAtPosition(
      tempTOC,
      newNode,
      selectedNode.index + 1
    );
    const sortedTOC = sortTOC(newTOC);
    setTableOfcontents(sortedTOC);
    /* before the code bellow */
    setSelectedNode(null);
    setIsModalActive(false);
    setIsNodeTitleActive(false);
    setAddNodeOptions([]);
    setAddNodeInfo(null);
  };
  /////

  ////Construction de la sidebar
  function generateHTMLFromGraph(graph) {
    let htmlString = "";

    function generateNodeHTML(node) {
      let nodeHTML = "";

      switch (node.nodeType) {
        case "DOC":
          nodeHTML += `<div class="node" data-node-type="DOC">
                <h1 class="node-doc">${node.nodeTitle}</h1>`;
          break;
        case "PART":
          nodeHTML += `<div class="node" data-node-type="PART">
                <h2 class="node-part">${node.nodeTitle}</h2>`;
          break;
        case "CHAPTER":
          nodeHTML += `<div class="node" data-node-type="CHAPTER">
                <h3 class="node-chapter">${node.nodeTitle}</h3>`;
          break;
        case "PARAGRAPH":
          nodeHTML += `<div class="node" data-node-type="PARAGRAPH">
                <h4 class="node-paragraph">${node.nodeTitle}</h4>`;
          break;
        case "NOTION":
          nodeHTML += `<div class="node" data-node-type="NOTION">
                <h5 class="node-notion">${node.nodeTitle}</h5>
                <p class="notion-body">${node.htmlContent}</p>`;
          break;
        default:
          break;
      }

      const children = graph.filter((n) => n.parent === node.nodeLevel);
      if (children.length > 0) {
        nodeHTML += '<div class="node-children">';
        children.forEach((child) => {
          nodeHTML += generateNodeHTML(child);
        });
        nodeHTML += "</div>";
      }

      nodeHTML += "</div>";

      return nodeHTML;
    }

    if (graph && graph.length > 0) {
      const root = graph.find((n) => n.parent === undefined);
      if (root) {
        htmlString = generateNodeHTML(root);
      }
    }

    return htmlString;
  }

  const buildLeftCorner = (newTable) => {
    const leftCornerContent = [];
    for (let index = 0, c = newTable.length; index < c; index++) {
      leftCornerContent.push(
        <NodesCard
          key={index}
          index={index}
          nodeObject={newTable[index]}
          updateNode={updateEditedNodeTitle}
          setSelectedNode={setSelectedNodeInTOC}
          selectedNode={selectedNode}
          setEnterPressedNotion={setEnterPressNotionInTOC}
          allNodes={newTable}
          setTableOfcontents={setTableOfcontents}
          setTableOfContentsComponents={setTableOfContentsComponents}
          tableOfContents={tableOfContents}
          sortTOC={sortTOC}
          insertElementAtPosition={insertElementAtPosition}
        />
      );
    }
    setTableOfContentsComponents(leftCornerContent);
  };

  useEffect(() => {
    const renderingHtml = generateHTMLFromGraph(tableOfContents);
    setRenderingHtml(renderingHtml);
    buildLeftCorner(tableOfContents);
  }, [tableOfContents]);

  /////Génération du PDF et du document word
  const generateDocument = async (title, value) => {
    return await generateDocx(title, value);
  };

  const generatePdf = () => {
    const combinedHtml = `<div>${renderingHtml}</div><div>${richTextValue}</div>`;

    const documentDefinition = {
      content: htmlToPdfmake(combinedHtml),
    };

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

    // You can open the PDF in a new window or download it
    pdfDocGenerator.open();
    // OR
    // pdfDocGenerator.download('example.pdf');
  };
  const handlePdfMouseEnter = () => {
    setIsPdfHovered(true);
  };

  const handlePdfMouseLeave = () => {
    setIsPdfHovered(false);
  };

  const handleWordMouseEnter = () => {
    setIsWordHovered(true);
  };

  const handleWordMouseLeave = () => {
    setIsWordHovered(false);
  };
  /////

  /////Gestion du Rich Text Eitor
  const handlecloseEditor = () => {
    updateNotionHTMLInTOC(DOMPurify.sanitize(htmlEditorContent));
    setIsNotionEditorActive(false);
  };
  const updateNotionHTMLInTOC = (htmlString) => {
    console.log(htmlString, enterPressedNotion);
    let tempTOC = [...tableOfContents];
    setTableOfcontents([]);
    tempTOC[enterPressedNotion.index].htmlContent = htmlString;
    console.log(tempTOC[enterPressedNotion.index]);
    setTableOfcontents(tempTOC);
  };

  /////
  ////////////////////
  console.log(
    "isClicked, page: ",
    selectedNode?.isClicked,
    " isChevronClicked: ",
    selectedNode?.isChevronClicked
  );
  return (
    <div className="bg-slate-100 overflow-hidden w-full h-screen">
      <Header />

      <div className="flex w-full h-full">
        {/* Sidebar1 section */}
        <section className="flex p-2">
          <div className="tree" style={{ width: `${width / 16}rem` }}>
            <div className="w-full h-full">
              <h1
                style={{
                  color: "black",
                  padding: "12px 4px",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                Table de matières
              </h1>

              <div className="!text-left py-[4px] w-full flex flex-col gap-[4px] pb-5">
                {tableOfContentsComponents}
              </div>
            </div>
            {selectedNode && selectedNode.isClicked ? (
              <div className="flex justify-end h-12 w-12 rounded-full absolute bottom-0">
                <button
                  onClick={() => handleOpenAddNodeModal()}
                  className="w-12 h-12 rounded-full flex justify-center items-center"
                  style={{
                    backgroundColor: "#4285F4",
                    borderRadius: 100,
                    color: "white",
                  }}
                >
                  <AiOutlinePlus size={20} />
                </button>
              </div>
            ) : null}
            {isModalActive ? (
              <div className="modal-background inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80">
                {!isNodeTitleModalActive ? (
                  <div className="modal-container">
                    {/* New Node Select Modal */}
                    <div className="flex justify-between px-2">
                      <span className="w-full text-center text-[24px] font-bold">
                        Add a Node to the Selected Node :{" "}
                        {selectedNode.nodeTitle}
                      </span>
                      <button
                        onClick={() => handleExitModal()}
                        className="text-[24px] font-bold"
                        type="button"
                      >
                        X
                      </button>
                    </div>
                    <div className="border-2 border-[#4285F4] rounded-lg h-full flex flex-col justify-evenly items-center">
                      <span className="capitalize text-[20px] font-bold">
                        Select the node you want to add
                      </span>
                      <div className="flex flex-row justify-evenly w-full">
                        {addNodeOptions.map((nodeOption, index) => {
                          console.log(nodeOption);
                          return (
                            <button
                              onClick={() =>
                                handleOpenAddTitleModal(nodeOption)
                              }
                              key={index}
                              className="p-[8px] flex flex-col gap-[5px] items-center"
                              style={{
                                backgroundColor: "white",
                                borderRadius: 8,
                                boxShadow:
                                  "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
                              }}
                            >
                              <span
                                className="text-[50px]"
                                style={{
                                  width: 100,
                                  height: 100,
                                  fontWeight: "bold",
                                  padding: "8px",
                                  borderRadius: 100,
                                  textAlign: "center",
                                  backgroundColor: `${nodeOption.nodeColor}`,
                                  color: `${nodeOption.textColor}`,
                                }}
                              >
                                {nodeOption.nodeInitial}
                              </span>
                              <span
                                style={{ color: "black", fontWeight: "bold" }}
                              >
                                {nodeOption.nodeType}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="modal-container">
                    {/* New Node Title Input Modal */}
                    <div className="flex justify-between px-2">
                      <span className="w-full text-center text-[24px] font-bold">
                        Add a Node to the Selected Node :{" "}
                        {selectedNode.nodeTitle}
                      </span>
                      <button
                        onClick={() => handleExitModal()}
                        className="text-[24px] font-bold"
                        type="button"
                      >
                        X
                      </button>
                    </div>
                    <div className="border-2 border-[#4285F4] rounded-lg h-full flex flex-col justify-evenly items-center">
                      <span className="capitalize text-[20px] font-bold">
                        Add a Title to the Node
                      </span>
                      <div className="flex flex-col justify-center items-center gap-1 w-full">
                        <div className="group">
                          <input
                            required=""
                            type="text"
                            className="input"
                            onKeyDown={(e) => {
                              e.key === "Enter"
                                ? handleAddNewNodeToTOC(addNodeTitle)
                                : "";
                            }}
                            onChange={(e) => setAddNodeTitle(e.target.value)}
                            autoFocus
                          />

                          <span className="highlight"></span>
                          <span className="bar"></span>
                          <label>New Node Title</label>
                        </div>
                        <div
                          className="p-[6px] flex flex-row gap-[5px] items-baseline rounded-lg"
                          style={{
                            backgroundColor: "white",
                            boxShadow:
                              "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "bold",
                              padding: "2px 5px",
                              borderRadius: 100,
                              textAlign: "center",
                              backgroundColor: `${addNodeInfo.nodeColor}`,
                              color: `${addNodeInfo.textColor}`,
                            }}
                          >
                            {addNodeInfo.nodeInitial}
                          </span>
                          <span style={{ color: "black" }}>{addNodeTitle}</span>
                        </div>
                        <button
                          onClick={() => handleAddNewNodeToTOC(addNodeTitle)}
                          className="capitalize h-12 w-32 text-xl"
                          style={{
                            backgroundColor: "#4285F4",
                            borderRadius: 8,
                            color: "white",
                          }}
                        >
                          Add Node
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
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
          <div className="w-full h-12 flex items-center justify-between">
            <h1 className="font-bold text-3xl uppercase">
              EDITION DE CONTENUS
            </h1>

            {tableOfContents.length > 1 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <FaFilePdf
                  size={34}
                  style={{ color: isPdfHovered ? "#db1a1a" : "#ff0000" }}
                  cursor="pointer"
                  onClick={generatePdf}
                  onMouseEnter={handlePdfMouseEnter}
                  onMouseLeave={handlePdfMouseLeave}
                />

                <FaFileWord
                  size={34}
                  style={{ color: isWordHovered ? "#1c1cd6" : "#0000FF" }}
                  cursor="pointer"
                  onClick={() => {
                    generateDocument(renderingHtml, richTextValue);
                    console.log(renderingHtml, richTextValue);
                  }}
                  onMouseEnter={handleWordMouseEnter}
                  onMouseLeave={handleWordMouseLeave}
                />

                <button
                  style={{ padding: "6px 12px", color: "white" }}
                  className="bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Enregistrez
                </button>
              </div>
            )}
          </div>
          <div className="w-full relative h-[calc(100%-64px)] overflow-hidden border-[#E2EBF9] px-[2px] border-2 rounded-lg">
            {isNotionEditorActive && (
              <div className="w-full px-4 flex justify-end items-center h-[50px] z-50 border relative">
                <button
                  onClick={handlecloseEditor}
                  className="h-8 w-8 absolute right-8 top-14 z-50 flex justify-center items-center border cursor-pointer"
                >
                  <AiOutlineSave size={20} />
                </button>
              </div>
            )}
            <div className="w-full h-full overflow-scroll">
              {/* <div>{JSON.stringify({tableOfContents})}</div>
                        <br />
                        <br />
                        <div>{JSON.stringify(enterPressedNotion)}</div> */}

              {isNotionEditorActive ? (
                <RichTextEditor
                  props={handleRichTextChange}
                  chandleEditorContent={setHtmlEditorContent}
                  editorContent={tableOfContents[enterPressedNotion.index]}
                />
              ) : (
                <div className="w-full h-full overflow-hidden bg-white p-4">
                  <div className="html-viewer">
                    <div
                      dangerouslySetInnerHTML={{ __html: renderingHtml }}
                    ></div>
                    {!isNotionEditorActive && (
                      <div
                        dangerouslySetInnerHTML={{ __html: richTextValue }}
                      ></div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
                  transition: "opacity 0.5s ease",
                  visibility: isHovered ? "visible" : "hidden",
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
                      className="bg-gray-100 w-full m-auto mt-4 p-2 overflow-auto gap-2 flex flex-col "
                      style={{ borderRadius: 8, maxHeight: "400px" }}
                      key={index}
                    >
                      <div className="flex border-b border-customGray items-center gap-2">
                        <p className={styles.node_style}>No</p>
                        <p className={styles.title_node}>{value.title}</p>
                      </div>
                      <p>
                        {showFullContentIndex === index
                          ? value.content
                          : `${value.content.substring(0, 100)}...`}
                      </p>
                      {showFullContentIndex !== index && (
                        <p
                          className={styles.styleplus}
                          onClick={() => setShowFullContentIndex(index)}
                        >
                          Voir plus
                        </p>
                      )}
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

export default EditorPage;
