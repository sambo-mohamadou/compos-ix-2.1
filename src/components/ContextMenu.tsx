import React, { useState } from "react";
import "../styles/manage-sidebar.css";

const contextMenu = ({
  position,
  compositionList,
  setCompositionList,
  target,
  renamePopup,
  setRenamePopup
}) => {
  const index = parseInt(target.id);

  const handleOptionClick = (option) => {
    // Logique pour l'option sélectionnée
    console.log(`Option "${option}" clicked.`);
    console.log("target", index, ": ", compositionList[index]);
    switch (option) {
      case "Supprimer":
        console.log("list before", compositionList);
        const newCompositionList = compositionList
          .slice(0, index)
          .concat(compositionList.slice(index + 1));
        console.log("list after", newCompositionList);
        setCompositionList(newCompositionList);
        break;
      case "Renommer":
        setRenamePopup(true);
        console.log(renamePopup);
        break;
    }
  };
  return (
    <>
      <div
        className="custom-context-menu"
        style={{
          display: "block",
          position: "fixed",
          left: position.x,
          top: position.y,
        }}
      >
        <div onClick={() => handleOptionClick("Renommer")}>Renommer</div>
        <div onClick={() => handleOptionClick("Supprimer")}>Supprimer</div>
      </div>
     
    </>
  );
};

export default contextMenu;
