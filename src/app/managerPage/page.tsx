"use client";
import Header from "@/src/components/Header";
import Search from "@/src/components/Search";
import React, { useState } from "react";
import ManagerSideBar from "@/src/components/ManagerSideBar";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";

const page = () => {
  const [createProject, setCreateProject] = useState(false);
  const [compositionName, setCompositionName] = useState("");
  const [compositionList, setCompositionList] = useState<string[]>([]);
  const [showContextMenu, setShowContextMenu] = useState(false); //pour le menu contextuel (voir managerSideBar)

  const { user, userInfo } = useAuth();

  //Pour fermer le menu contextuel
  const handleClick = (event) => {
    console.log("close");
    if (event.target.closest(".custom-context-menu")) {
      // Le clic a eu lieu dans le menu, on ne fait rien
      return;
    }
    // Le clic a eu lieu en dehors du menu, on le ferme
    setShowContextMenu(false);
  };

  const handleAddComposition = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!compositionName) return;

    // const userInfoArray = Object.values(userInfo);

    setCompositionList([...compositionList, compositionName]);
    setCompositionName("");
    setCreateProject(false);
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col justify-between items-start"
    onClick={handleClick}>
      <Header />
      <div className="w-full h-full m-auto mt-0 overflow-hidden">
        <div className="w-full h-full flex justify-start items-start pt-4 pl-1 overflow-hidden relative">
          <ManagerSideBar
            compositionList={compositionList}
            showContextMenu={showContextMenu}
            setShowContextMenu={setShowContextMenu}
            setCompositionList={setCompositionList}
            
          />
          <section className="h-full w-full flex flex-col justify-between pl-4 overflow-hidden relative">
            <Search />
            <div className="w-full h-full p-2 overflow-hidden">
              <div className="h-full w-full border rounded-lg bg-blue-gray-50 p-4 overflow-hidden  relative">
                <button
                  className="w-64 h-12 bg-blue-400 text-white rounded-lg flex items-center  hover:bg-blue-300  justify-start px-4"
                  onClick={() => setCreateProject(true)}
                  style={{
                    position: "absolute",
                    right: "2rem",
                    bottom: "2rem",
                  }}
                >
                  <span className="text-black">
                    <AiOutlinePlus size={30} className="fa-2x" />
                  </span>
                  <p className="capitalize pl-4 font-bold">
                    nouvelle composition
                  </p>
                </button>
              </div>
            </div>
          </section>
          {/* modal create project */}
          {createProject && (
            <div
              className="absolute w-full h-full z-50"
              style={{ background: "rgba(3, 3, 3, 0.4)" }}
            >
              <div className=" flex justify-center items-center w-full h-full relative">
                <form
                  className="w-96 min-h-52 bg-white rounded-lg"
                  onSubmit={handleAddComposition}
                >
                  <h1 className="font-extrabold text-2xl text-center py-3 mt-2">
                    Nouvelle composition
                  </h1>
                  <h4 className="px-2 font-bold mt-2">Nom de la composition</h4>
                  <div className="p-2">
                    <input
                      type="text"
                      className="w-full h-12 border border-blue-gray-200 rounded-lg px-2"
                      placeholder="Project name"
                      value={compositionName}
                      onChange={(e) => setCompositionName(e.target.value)}
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
                    setCreateProject(false);
                  }}
                >
                  <AiOutlineClose size={30} className="fa-2x" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
