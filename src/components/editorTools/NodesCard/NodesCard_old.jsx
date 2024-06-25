import React, { useState } from "react";
import styles from "../NodesCard/NodesCard.module.css";
function NodesCard(props) {
  console.log(props.nodeObject);
  const NODEINFOS = [
    {
      nodeType: "DOC",
      nodeInitial: "Co",
      nodeColor: "#4285F4",
      textColor: "white",
    },
    {
      nodeType: "PARTIE",
      nodeInitial: "Pt",
      nodeColor: "#34A853",
      textColor: "white",
    },
    {
      nodeType: "CHAPTER",
      nodeInitial: "Ch",
      nodeColor: "#FBBC05",
      textColor: "white",
    },
    {
      nodeType: "PARAGRAPH",
      nodeInitial: "Pr",
      nodeColor: "#EA4335",
      textColor: "white",
    },
    {
      nodeType: "NOTION",
      nodeInitial: "No",
      nodeColor: "#E2EBF9",
      textColor: "#4285F4",
    },
  ];
  const [nodeObject, setNodeObject] = useState(props.nodeObject);

  const [nodeElement, setNodeElement] = useState(
    nodeObject.nodeType
      ? NODEINFOS.find((node) => node.nodeType === nodeObject.nodeType)
      : {
          nodeType: "DOC",
          nodeInitial: "Co",
          nodeColor: "#4285F4",
          textColor: "white",
        }
  );
  console.log(nodeElement);
  const [nodeTitle, setNodeTitle] = useState(nodeObject.nodeTitle);

  const [isClicked, setIsClicked] = useState(false);
  const [isEnterPressed, setIsEnterPressed] = useState(false);

  const [nodeBgColor, setNodeBgColor] = useState("white");
  const [nodeColor, setNodeColor] = useState(nodeElement.nodeColor);
  const [textColor, setTextColor] = useState(nodeElement.textColor);
  const [titleColor, setTitleColor] = useState("black");

  const handleNodeOnClick = () => {
    setIsClicked(!isClicked);
    console.log(isClicked);
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
    (empêcher que le clique sur notion propose de crérr une autre notion */
    switch (
      props.nodeObject.parent?.substring(0, props.nodeObject.parent.length - 1)
    ) {
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

  return (
    <button
      onKeyDown={(e) => handleNotionOnEnterPress(e.key)}
      className={`p-[6px] flex flex-row gap-[5px] items-baseline rounded-lg ${setMargin(
        props.nodeObject
      )}`}
      style={{
        width: "100%",
        backgroundColor: `${nodeBgColor}`,
        boxShadow:
          "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
      }}
    >
      <span
        onClick={() => handleNodeOnClick()}
        on
        style={{
          fontWeight: "bold",
          padding: "2px 5px",
          borderRadius: 100,
          textAlign: "center",
          backgroundColor: `${nodeColor}`,
          color: `${textColor}`,
        }}
      >
        {nodeElement.nodeInitial}
      </span>
      <input
        className="focus:outline-none break-words w-full hover:break-words"
        style={{ color: `${titleColor}`, backgroundColor: `${nodeBgColor}` }}
        value={nodeTitle}
        onChange={(e) => setNodeTitle(e.target.value)}
        onBlur={() =>
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
    </button>
  );
}

export default NodesCard;
