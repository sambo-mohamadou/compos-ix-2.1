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
      nodeType: 'DOC',
      nodeColor: 'black',
      textColor: 'white',
    },
    {
      nodeType: "PART",
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
      nodeType: 'NOTION',
      nodeColor: '#4285F4',
      textColor: 'white', 
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
  const [addNodeOptions, setAddNodeOptions] = useState([]);

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
  /* console.log(
    "Plus de Clog ici ;isClicked ",
    isClicked,
    " isChevronClicked",
    isChevronClicked
  ); */

  /////Add node functions
  const setAddNodeTypes = (selectedNode) => {
    switch (selectedNode.nodeType) {
      case "DOC":
        return [
          {
            nodeType: "PART",
            nodeInitial: "Pt",
            // nodeColor: '#34A853',
            textColor: "#34A853",
          },
        ];
      case "PART":
        return [
          {
            nodeType: "CHAPTER",
            nodeInitial: "Ch",
            textColor: "#FBBC05",
            // textColor: 'white',
          },
        ];
      case "CHAPTER":
        return [
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            // nodeColor: '#E2EBF9',
            nodeColor: "#4285F4",
            /* nodeType: 'PARAGRAPH',
            nodeInitial: 'Pr',
            textColor: '#EA4335', */
            // textColor: 'white',
          },
        ];
      /*  case 'PARAGRAPH':
        return [
          {
            nodeType: 'NOTION',
            nodeInitial: 'No',
            // nodeColor: '#E2EBF9',
            textColor: '#4285F4',
          },
        ];
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
  console.log("addNodeOptions ", addNodeOptions);

  const handleAddNewNodeToTOC = (AvailableNodeOptions, parent) => {
    /* Add to TOC Logic Here */
    const nodeOptions = AvailableNodeOptions[0];
    let tempTOC = [...tableOfContents];
    setTableOfcontents([]);
    setTableOfContentsComponents([]);
    console.log("nodeOptions in ", nodeOptions);
   /*  tempTOC[selectedNode.index].isClicked = false;
    tempTOC[selectedNode.index].isChevronClicked = true; */
    let title = "";
    switch (nodeOptions.nodeType) {
      case "PART":
        title = "Partie";
        break;
      case "CHAPTER":
        title = "Chapitre";
        break;
      case "NOTION":
        title = "Notion";
        break;
    }
    const newNode = {
      nodeType: nodeOptions.nodeType,
      nodeTitle: title,
      nodeLevel:
        selectedNode.nodeType !== "NOTION"
          ? `${nodeOptions.nodeInitial}${tempTOC.length}`
          : `${nodeOptions.nodeLevel}${tempTOC.length}`,
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
    setAddNodeOptions([]);
    //setAddNodeInfo(null);
  };

  const handleAddButton = () => {
    console.log("Node, where to add: ", nodeObject);
    const nodeOptions = setAddNodeTypes(nodeObject);
    setAddNodeOptions(nodeOptions);
    handleAddNewNodeToTOC(nodeOptions, nodeObject.nodeLevel);
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
              <button onClick={handleAddButton} className="add-button">
                <AiOutlinePlus size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default NodesCard;
