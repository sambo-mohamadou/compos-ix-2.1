import React, { SetStateAction, useEffect, useState, Dispatch } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useAuth } from "@/src/contexts/AuthContext";
import { AuthProvider } from "@/src/contexts/AuthContext";
import Link from "next/link";
import ContextMenu from "../components/ContextMenu";
import "../styles/manage-sidebar.css";

const ManagerSideBar: React.FC<{
  compositionList: string[] | [];
  showContextMenu: boolean;
  setShowContextMenu: Dispatch<SetStateAction<boolean>>;
  setCompositionList: Dispatch<SetStateAction<string[] | []>>;
}> = ({
  compositionList,
  showContextMenu,
  setShowContextMenu,
  setCompositionList,
}) => {
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const { user, userInfo } = useAuth();
  const [contextMenuTarget, setContextMenuTarget] =
    useState<HTMLElement | null>();
  const [targetToRename, setTargetToRename] = useState(null);

  /////Surcharge du menu contextuel
  const handleContextMenu = (event) => {
    console.log("capture");
    event.preventDefault();
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setContextMenuTarget(event.currentTarget);
    setShowContextMenu(true);
  };
  const [renamePopup, setRenamePopup] = useState(false);

  //Renomer une composition
  const handleFormSubmit = (e, index) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const newName = [formdata.get("new-name")].filter(Boolean).map(String);
    console.log(newName, " ", index);
    console.log("list before", compositionList);
    const newCompositionList = [
      ...compositionList.slice(0, index),
      ...newName,
      ...compositionList.slice(index + 1),
    ];
    console.log("list after", newCompositionList);
    setCompositionList(newCompositionList);
    setRenamePopup(false);
  };

  /////
  const [opened, setOpened] = useState(true);
  const togleOpened = () => {
    setOpened(!opened);
  };

  return (
    <section className="h-full w-96 border-2 rounded-lg p-1 bg-white">
      <div className="w-hull h-full">
        <div
          style={{ marginBottom: "16px" }}
          className="flex text-black justify-between compositions-center items-center w-full bg-blue-200 h-12 rounded-lg px-2 cursor-pointer"
          onClick={togleOpened}
        >
          <p className="font-bold">Mes Compositions</p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {compositionList.length}
            <span>
              {opened ? <FaChevronDown size={18} /> : <FaChevronUp size={18} />}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {compositionList.map((composition: string, index: number) => (
            <div
              key={index}
              id={index + ""}
              /* onMouseEnter={() => onMouseEnter(index)}
              onMouseLeave={onMouseLeave} */
              onContextMenu={handleContextMenu}
            >
              {showContextMenu && (
                <ContextMenu
                  position={menuPosition}
                  compositionList={compositionList}
                  setCompositionList={setCompositionList}
                  target={contextMenuTarget}
                  renamePopup={renamePopup}
                  setRenamePopup={setRenamePopup}
                />
              )}
              <Link
                href={`/editor/${encodeURIComponent(composition)}`}
                style={{
                  display: opened ? "block" : "none",
                }}
                className="^w-full cursor-pointer rounded-md 
                border-b border-solid px-2 py-3 text-black composition"
              >
                {composition}
              </Link>
            </div>
          ))}
        </div>
        {renamePopup ? (
          <div
            className="absolute w-full h-full z-50"
            style={{ background: "rgba(3, 3, 3, 0.4)" }}
          >
            <div className=" flex justify-center items-center w-full h-full relative">
              <form
                className="w-96 min-h-52 bg-white rounded-lg"
                onSubmit={(event) =>
                  handleFormSubmit(event, parseInt(contextMenuTarget.id))
                }
              >
                <h1 className="font-extrabold text-2xl text-center py-3 mt-2">
                  Nouveau Nom
                </h1>
                <h4 className="px-2 font-bold mt-2">Nom de la composition</h4>
                <div className="p-2">
                  <input
                    type="text"
                    className="w-full h-12 border border-blue-gray-200 rounded-lg px-2"
                    placeholder="Project name"
                    defaultValue={
                      compositionList[parseInt(contextMenuTarget.id)]
                    }
                    name="new-name"
                  />
                  <div className="flex items-center justify-center mt-4 mb-4">
                    <button
                      type="submit"
                      className="px-10 text-white py-2 rounded-md bg-orange-400 hover:bg-orange-500"
                    >
                      {" "}
                      Entrez{" "}
                    </button>
                  </div>
                </div>
              </form>
              <button
                className="h-12 w-12 absolute right-0 top-0 text-white"
                onClick={() => {
                  setRenamePopup(false);
                }}
              >
                <AiOutlineClose size={30} className="fa-2x" />
              </button>
            </div>
          </div>
        ) : (
          " "
        )}
      </div>
    </section>
  );
};

export default ManagerSideBar;
