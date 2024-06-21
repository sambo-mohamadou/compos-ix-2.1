"use client";
import Header from "@/src/components/Header";
import { useState, useEffect, useRef } from "react";
import React from "react";
import "../../../styles/editor.css";
import { NodesCard } from "@/src/components/editorTools";
import { AiOutlinePlus } from "react-icons/ai";

const createEmptyNotion = () => {
  return {
    id: new Date().getTime(), // Unique identifier for each Notion
    content: "",
    editorOpen: true,
  };
};

const EditorPage = ({ params }) => {
  //States for the width sizes
  const [minWidth, maxWidth, defaultWidth] = [200, 500, 250];
  const [minWidth2, maxWidth2, defaultWidth2] = [200, 500, 250];
  const [width, setWidth] = useState(defaultWidth);
  const [width2, setWidth2] = useState(defaultWidth2);

  /////Former States
  const [tableOfContents, setTableOfcontents] = useState([
    {
      nodeType: "DOC",
      nodeTitle: params.composition,
      nodeLevel: "Co0",
      parent: undefined,
      htmlContent: "",
      isClicked: false,
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
          setEnterPressedNotion={setEnterPressNotionInTOC}
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

  ////////////////////
  console.log("isClicked, page: ", selectedNode?.isClicked);
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
                  backgroundColor: "#E2EBF9",
                  padding: "8px 4px",
                  borderRadius: 8,
                  fontWeight: "bold",
                }}
              >
                Table of contents
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
        <section className="w-full bg-white border-2 rounded-lg mt-2">
          <div className="">EDITION DES CONTENUS</div>
        </section>

        {/* Sidebar2 section */}
        <section className="flex p-2">
          <div
            className="w-1 cursor-col-resize bg-slate-100"
            onMouseDown={() => {
              isResized2.current = true;
            }}
          />
          <div
            className="h-full flex flex-col justify-between bg-white border-2 rounded-lg  overflow-auto p-2 relative"
            style={{ width: `${width2 / 16}rem` }}
          >
            Sidebar
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditorPage;
