import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useAuth } from "@/src/contexts/AuthContext";
import { AuthProvider } from "@/src/contexts/AuthContext";
import Link from "next/link";

const ManagerSideBar: React.FC<{ compositionList: string[] | [] }> = ({ compositionList }) => {
  const {user, userInfo} = useAuth();



  const [opened, setOpened] = useState(true);
  const togleOpened = () => {
    setOpened(!opened);
  };
  const [isHoveringIndex, setIsHoveredIndex] = useState<number | null>(null);
  const onMouseEnter = (index: number) => setIsHoveredIndex(index);
  const onMouseLeave = () => setIsHoveredIndex(null);

  return (
    <section className="h-full w-96 border-2 rounded-lg p-1 bg-white">
      <div className="w-hull h-full">
        <div
          style={{ marginBottom: "16px" }}
          className="flex text-black justify-between compositions-center items-center w-full bg-blue-200 h-12 rounded-lg px-2 cursor-pointer"
          onClick={togleOpened}>

          <p className="font-bold">Mes Compositions</p>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {compositionList.length}
            <span>
              {opened ? (
                <FaChevronDown size={18} />
              ) : (
                <FaChevronUp size={18} />
              )}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {compositionList.map((composition:string, index:number) => (
            <div
              key={index}
              onMouseEnter={() => onMouseEnter(index)}
              onMouseLeave={onMouseLeave}
            > 
              <Link
                href={`/editor/${encodeURIComponent(composition)}`}
                style={{
                  display: opened ? "block" : "none",
                  backgroundColor:
                    isHoveringIndex === index ? "#D3D3D3" : "white",
                }}
                className="^w-full cursor-pointer rounded-md border-b border-solid px-2 py-3 text-black"
              >
                {composition}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManagerSideBar;
