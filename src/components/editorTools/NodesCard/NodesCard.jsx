import React, { useState, useEffect } from "react";
import styles from "../NodesCard/NodesCard.module.css";
import { FaChevronRight, FaChevronDown, FaTrash } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";
function NodesCard(props) {
  console.log(props.nodeObject);

  const {
    allNodes,
    selectedNode,
    setSelectedNode,
    setTableOfContentsComponents,
    setTableOfcontents,
    tableOfContents,
    sortTOC,
    insertElementAtPosition,
  } = props;
  const NODEINFOS = [
    {
      nodeType: "DOC",
      nodeColor: "black",
      textColor: "white",
    },
    {
      nodeType: "PARTIE",
      nodeColor: "#34A853",
      textColor: "white",
    },
    {
      nodeType: "CHAPTER",
      nodeColor: "#FBBC05",
      textColor: "white",
    },
    {
      nodeType: "PARAGRAPH",
      nodeColor: "#EA4335",
      textColor: "white",
    },
    {
      nodeType: "NOTION",
      nodeColor: "#4285F4",
      textColor: "white",
      // textColor: '#4285F4',
    },
  ];
  const [nodeObject, setNodeObject] = useState(props.nodeObject);

  const [nodeElement, setNodeElement] = useState(
    nodeObject.nodeType
      ? NODEINFOS.find((node) => node.nodeType === nodeObject.nodeType)
      : {
          nodeType: "DOC",
          nodeColor: "#4285F4",
          textColor: "white",
        }
  );
  console.log(nodeElement);
  const [nodeTitle, setNodeTitle] = useState(nodeObject.nodeTitle);

  const [isClicked, setIsClicked] = useState(false);
  const [isChevronClicked, setIsChevronClicked] = useState(true);
  const [isEnterPressed, setIsEnterPressed] = useState(false);

  const [nodeBgColor, setNodeBgColor] = useState("white");
  const [nodeColor, setNodeColor] = useState(nodeElement.nodeColor);
  const [textColor, setTextColor] = useState(nodeElement.textColor);
  const [titleColor, setTitleColor] = useState("black");
  const [nodeOption, setNodeOption] = useState(null);
  const [addNodeModal, setAddNodeModal] = useState(false);
  const [isNodeTitleModalActive, setIsAddNodeTitleModalActive] =
    useState(false);

  const handleChevronclick = () => {
    console.log("Ici,ici,ici");
    /* Ici, on met la propriété isChevronClicked de l'élément cliqué à 
    false et on fait de même avec ses éléments enfants 
    (qui on la propriété parent égal à la propriété nodeLevel 
      de l'élément actuel) pour cacher leurs éléments enfants aussi */
    setIsChevronClicked(!isChevronClicked);
    const children = props.allNodes.filter(
      (element, id) => nodeObject.nodeLevel == element.parent
    );
    console.log("children: ", children);
    /*Car le changement à false n'a pas encore éffectuer 
    or la présence dans cette fonction signifie qu'on a cliqué 
    sur le chevron et donc si la valeur du chevron (qui est encore qu'avant le clic)est true, 
    cela signifie qu'on veut qu'elle passe à false 
      */
    if (nodeObject.isChevronClicked == true) {
      console.log("changing kids: ");
      for (const child of children) {
        child.isChevronClicked = false;
      }
    }
  };

  useEffect(() => {
    props.setSelectedNode({
      index: props.index,
      nodeType: nodeElement.nodeType,
      nodeTitle: nodeTitle,
      parent: nodeObject.parent,
      nodeLevel: nodeObject.nodeLevel,
      htmlContent: nodeObject.htmlContent,
      isClicked: isClicked,
      isChevronClicked: isChevronClicked,
      isEnterPressed: isEnterPressed,
    });
  }, [isChevronClicked, isClicked]);

  const handleNodeOnClick = () => {
    setIsClicked(!isClicked);
    console.log("Après clic: ", isClicked);
    if (isClicked) {
      // When I click once on the node card, I enable the selected node card
      setNodeBgColor(nodeColor);
      setNodeColor("white");
      setTextColor(
        nodeElement.nodeType !== "NOTION"
          ? nodeElement.nodeColor
          : nodeElement.textColor
      );
      setTitleColor(nodeElement.nodeType !== "NOTION" ? "white" : "black");
    } else {
      setNodeBgColor("white");
      setNodeColor(nodeElement.nodeColor);
      setTextColor(nodeElement.textColor);
      setTitleColor("black");
    }
    props.setSelectedNode({
      index: props.index,
      nodeType: nodeElement.nodeType,
      nodeTitle: nodeTitle,
      parent: nodeObject.parent,
      nodeLevel: nodeObject.nodeLevel,
      htmlContent: nodeObject.htmlContent,
      isClicked: isClicked,
      isChevronClicked: isChevronClicked,
      isEnterPressed: isEnterPressed,
    });
  };

  const handleNotionOnEnterPress = (keyPressed) => {
    setIsEnterPressed(!isEnterPressed);
    if (
      nodeElement.nodeType === "NOTION" &&
      keyPressed === "Enter" &&
      !isClicked
    ) {
      if (isEnterPressed) {
        const tempNodeObject = {
          index: props.index,
          nodeType: nodeElement.nodeType,
          nodeTitle: nodeTitle,
          parent: nodeObject.parent,
          nodeLevel: nodeObject.nodeLevel,
          htmlContent: nodeObject.htmlContent,
          isClicked: true,
          isEnterPressed: isEnterPressed,
        };
        console.log(tempNodeObject);
        props.setEnterPressedNotion(tempNodeObject);
      }
    }
  };
  //Gestion de l'indentation de la table de contenu (sidebar)
  //On applique divers style en fonction du noeud parent
  const setMargin = (nodeObject) => {
    let css = "";
    /*Faut-il Empêcher que les ntions puisse créer d'autres notions 
    (empêcher que le clique sur notion propose de créer une autre notion */
    switch (nodeObject.parent?.substring(0, nodeObject.parent.length - 1)) {
      case "No":
        css = "notion";
        break;
      case "Pt":
        css = "chapter";
        break;
      case "Pr":
        css = "notion";
        break;
      case "Ch":
        css = "paragraph";
        break;
      case "Co":
        css = "part";
        break;
      default:
        css = "independantNotion";
    }
    return styles[css];
  };

  /////Add node functions
  const getNodeOptions = (selectedNode) => {
    switch (selectedNode.nodeType) {
      case "DOC":
        return [
          {
            nodeType: "PARTIE",
            nodeInitial: "Pt",
            nodeColor: "white",
            textColor: "#34A853",
          },
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            textColor: "#4285F4",
            nodeColor: "white",
          },
        ];
      case "PARTIE":
        return [
          {
            nodeType: "CHAPTER",
            nodeInitial: "Ch",
            textColor: "#FBBC05",
            nodeColor: "white",
          },
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            textColor: "#4285F4",
            nodeColor: "white",
          },
        ];
      case "CHAPTER":
        return [
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            textColor: "#4285F4",
            nodeColor: "white",
          },
          {
            nodeType: "PARAGRAPH",
            nodeInitial: "Pr",
            textColor: "#EA4335",
            nodeColor: "white",
          },
        ];
      case "PARAGRAPH":
        return [
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            textColor: "#4285F4",
            nodeColor: "white",
          },
        ];
      /*
      default:
        return [
          {
            nodeType: 'NOTION',
            nodeInitial: 'No',
            // nodeColor: '#E2EBF9',
            nodeColor: '#4285F4',
          },
        ]; */
    }
  };
  console.log("nodeOption ", nodeOption);

  const handleAddNewNodeToTOC = (nodeOption, title, parent) => {
    /* Add to TOC Logic Here */
    console.log("node option recu:", nodeOption);
    let tempTOC = [...tableOfContents];
    setTableOfcontents([]);
    setTableOfContentsComponents([]);
    /*  tempTOC[selectedNode.index].isClicked = false;
    tempTOC[selectedNode.index].isChevronClicked = true; */
    let level = "";
    switch (nodeOption.nodeType) {
      case "PARTIE":
        level = "Pt";
        break;
      case "CHAPTER":
        level = "Ch";
        break;
      case "NOTION":
        level = "No";
        break;
      case "PARAGRAPH":
        level = "Pr";
        break;
    }
    const newNode = {
      nodeType: nodeOption.nodeType,
      nodeTitle: title,
      nodeLevel:
        selectedNode.nodeType !== "NOTION"
          ? `${nodeOption.nodeInitial}${tempTOC.length}`
          : `${level}${tempTOC.length}`,
      parent: `${parent}`,
      htmlContent: "",
      isClicked: false,
      isChevronClicked: true,
      isEnterPressed: false,
    };
    console.log("newNode ", newNode);
    const newTOC = insertElementAtPosition(
      tempTOC,
      newNode,
      selectedNode.index + 1
    );
    console.log("newToc ", newTOC);
    const sortedTOC = sortTOC(newTOC);
    setTableOfcontents(sortedTOC);
    /* before the code bellow */
    /* props.setSelectedNode({
      index: props.index,
      nodeType: nodeElement.nodeType,
      nodeTitle: nodeTitle,
      parent: nodeObject.parent,
      nodeLevel: nodeObject.nodeLevel,
      htmlContent: nodeObject.htmlContent,
      isClicked: isClicked,
      isChevronClicked: isChevronClicked,
      isEnterPressed: isEnterPressed,
    }); */
    /*  setIsModalActive(false);
    setIsNodeTitleActive(false); */
    //setAddNodeInfo(null);
  };

  const handleExitModal = () => {
    setAddNodeModal(false);
    setIsAddNodeTitleModalActive(false);
    getNodeOptions(null);
  };

  const handleOpenAddTitleModal = (nodeOption) => {
    setIsAddNodeTitleModalActive(true);
    setNodeOption(nodeOption);
  };

  const handleTitleFormSubmit = (event) => {
    event.preventDefault;
    const formData = new FormData(event.currentTarget);
    const name = formData.get("title");
    console.log(name);
    handleAddNewNodeToTOC(nodeOption, name, nodeObject.nodeLevel);
  };

  const handleAddButton = () => {
    setAddNodeModal(true);
    console.log("Node, where to add: ", nodeObject);
  };

  /////Suppression de notion
  const handleDeleteNotion = () => {
    const table = [...tableOfContents];
    console.log("Node, where to Delete: ", nodeObject);
    console.log(tableOfContents);
    const newTable = table.filter((item) => {
      console.log(item);
      return item.nodeLevel !== nodeObject.nodeLevel;
    });
    console.log("new table: ", newTable);
    setTableOfcontents(newTable);
  };
  /////

  ////////////////
  return (
    <>
      {console.log("allNodes: ", props.allNodes)}
      {/*Ici, on affiche seulement ssi  c'est lélément racine "DOC" ou si 
      la propriété isChevronclicked de son parent vaut true */}
      {nodeObject.nodeType == "DOC" ||
      props.allNodes?.find((item, index) => item.nodeLevel == nodeObject.parent)
        .isChevronClicked == true ? (
        <div
          onKeyDown={(e) => handleNotionOnEnterPress(e.key)}
          className={`node-item ${setMargin(nodeObject)}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "4px 0px",
            paddingRight: "4px",
            paddingLeft: "4px",
            width: `${width}`,
          }}
        >
          {console.log("This Node:", nodeObject)}
          <div className="flex justify-between w-full gap-2">
            <div className="flex justify-center ">
              <span className="node-chevron">
                {nodeObject.isChevronClicked ? (
                  <FaChevronDown
                    style={{ width: "14px", height: "14px" }}
                    onClick={handleChevronclick}
                  />
                ) : (
                  <FaChevronRight
                    style={{ width: "14px", height: "14px" }}
                    onClick={handleChevronclick}
                  />
                )}
              </span>
              <span
                onClick={() => handleNodeOnClick()}
                on
                style={{
                  fontWeight: "bold",
                  padding: "2px 5px",
                  borderRadius: 100,
                  textAlign: "center",
                  backgroundColor: `${textColor}`,
                  color: `${nodeColor}`,
                }}
              >
                {nodeObject.nodeLevel.substring(0, 2)}
              </span>

              <input
                className="focus:outline-none break-words hover:break-words"
                style={{
                  color: `${titleColor}`,
                  backgroundColor: `transparent`,
                }}
                value={nodeTitle}
                onChange={(e) => setNodeTitle(e.target.value)}
                /*               onClick={handleNodeOnClick}
                 */ onBlur={() =>
                  props.updateNode({
                    index: props.index,
                    nodeType: nodeElement.nodeType,
                    nodeTitle: nodeTitle,
                    parent: nodeObject.parent,
                    nodeLevel: nodeObject.nodeLevel,
                    htmlContent: nodeObject.htmlContent,
                    isClicked: isClicked,
                    isEnterPressed: isEnterPressed,
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleDeleteNotion}>
                <FaTrash style={{ color: "#f22" }} />
              </button>
              {nodeObject.nodeType === "NOTION" ? (
                ""
              ) : (
                <button onClick={handleAddButton} className="add-button">
                  <AiOutlinePlus size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Modal du choix de la notion à ajouter */}
          {addNodeModal ? (
            <div className="modal-background inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80">
              {!isNodeTitleModalActive ? (
                <div className="modal-container">
                  {/* New Node Select Modal */}
                  <div className="flex justify-between px-2">
                    <span className="w-full text-center text-[24px] font-bold">
                      Add a Node to the Selected Node : {nodeObject.nodeTitle}
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
                      {getNodeOptions(nodeObject).map((nodeOption, index) => {
                        console.log(nodeOption);
                        return (
                          <button
                            onClick={() => handleOpenAddTitleModal(nodeOption)}
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
                      Add a Node to the Selected Node : {nodeObject.nodeTitle}
                    </span>
                    <button
                      onClick={() => handleExitModal()}
                      className="text-[24px] font-bold"
                      type="button"
                    >
                      X
                    </button>
                  </div>
                  <form
                    className="border-2 border-[#4285F4] rounded-lg h-full flex flex-col justify-evenly items-center"
                    onSubmit={handleTitleFormSubmit}
                  >
                    <span className="capitalize text-[20px] font-bold">
                      Add a Title to the Node
                    </span>
                    <div className="flex flex-col justify-center items-center gap-1 w-full">
                      <div className="group">
                        <label htmlFor="node-title">New Node Title</label>
                        <input
                          name="title"
                          id="node-title"
                          required
                          type="text"
                          className="input"
                          autoFocus
                        />

                        <span className="highlight"></span>
                        <span className="bar"></span>
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
                            backgroundColor: `${nodeOption.nodeColor}`,
                            color: `${nodeOption.textColor}`,
                          }}
                        >
                          {nodeOption.nodeInitial}
                        </span>
                      </div>
                      <button
                        type="submit"
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
                  </form>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default NodesCard;
