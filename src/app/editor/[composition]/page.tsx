'use client';
import Header from '@/src/components/Header';
import { useState, useEffect, useRef } from 'react';
import React from 'react';

const page = () => {
  const [minWidth, maxWidth, defaultWidth] = [300, 500, 350];
  const [minWidth2, maxWidth2, defaultWidth2] = [300, 500, 350];
  const [width, setWidth] = useState(defaultWidth);
  const [width2, setWidth2] = useState(defaultWidth2);

  const isResized = useRef(false);
  const isResized2 = useRef(false);

  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      setWidth(parseInt(savedWidth));
    }

    const savedWidth2 = localStorage.getItem('sidebarWidth2');
    if (savedWidth2) {
      setWidth2(parseInt(savedWidth2));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarWidth', width.toString());
  }, [width]);

  useEffect(() => {
    localStorage.setItem('sidebarWidth2', width2.toString());
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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="bg-slate-100 overflow-hidden w-full h-screen">
      <Header />

      <div className="flex w-full h-full">
        {/* Sidebar1 section */}
        <section className="flex p-2">
          <div
            className="h-full flex flex-col justify-between bg-white border-2 rounded-lg  overflow-auto p-2 relative"
            style={{ width: `${width / 16}rem` }}
          >
            Sidebar
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

export default page;
