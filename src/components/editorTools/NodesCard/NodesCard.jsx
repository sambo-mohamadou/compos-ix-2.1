import React, { useState, useEffect } from "react";
import styles from "../NodesCard/NodesCard.module.css";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
function NodesCard(props) {
  console.log(props.nodeObject);
  const NODEINFOS = [
    {
      nodeType: "DOC",
      nodeColor: "#4285F4",
      textColor: "white",
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
      nodeType: "NOTION",
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
    if (nodeObject.isChevronClicked==true) {
      console.log("changing kids: ")
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
  }, [isChevronClicked]);

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
  console.log(
    "Plus de Clog ici ;isClicked ",
    isClicked,
    " isChevronClicked",
    isChevronClicked
  );
  return (
    <>
      {console.log("allNodes: ", props.allNodes)}
      {/*Ici, on affiche seulement ssi  c'est lélément racine "DOC" ou si 
      la propriété isChevronclicked de son parent vaut true */}
      {nodeObject.nodeType == "DOC" ||
      props.allNodes.find((item, index) => item.nodeLevel == nodeObject.parent)
        .isChevronClicked == true ? (
        <button
          onKeyDown={(e) => handleNotionOnEnterPress(e.key)}
          className={`node-item ${setMargin(nodeObject)}`}
        >
          {console.log("This Node:", nodeObject)}
          {nodeObject.isChevronClicked ? (
            <FaChevronDown
              className="node-chevron"
              onClick={handleChevronclick}
            />
          ) : (
            <FaChevronRight
              className="node-chevron"
              onClick={handleChevronclick}
            />
          )}
          <input
            className="focus:outline-none break-words w-full hover:break-words"
            style={{
              color: `${titleColor}`,
              backgroundColor: `${nodeBgColor}`,
            }}
            value={nodeTitle}
            onChange={(e) => setNodeTitle(e.target.value)}
            onClick={handleNodeOnClick}
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
      ) : (
        ""
      )}
    </>
  );
}

export default NodesCard;
