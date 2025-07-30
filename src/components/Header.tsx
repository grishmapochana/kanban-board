"use client";
import React from "react";
import Image from "next/image";
import BoardList from "./BoardList";

function Header({
  activeBoardId,
  setActiveBoardId,
}: {
  activeBoardId: string;
  setActiveBoardId: (id: string) => void;
}) {
  return (
    <header>
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-blue-600 rounded-md filter blur-3xl opacity-50 -z-50" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-1 items-center justify-between">
        <div className="col-span-1 flex justify-center md:justify-start items-center ">
          <Image
            alt="logo"
            src="/images/logo.png"
            width={100}
            height={100}
            className=" w-fit h-10 lg:h-14 object-contain"
          />
          <h1
            className={`text-xl lg:text-4xl font-extrabold text-[#023f70] tracking-wide`}
          >
            Krello
          </h1>
        </div>
        <div className="col-span-1 flex justify-end items-center space-x-1 md:space-x-2">
          {/* search functionality */}
          {/* <form className=" ">
            <Search className="size-5 mx-1 text-gray-500 md:size-6" />
            <input
              className="outline-none p-1 md:p-2"
              type="text"
              placeholder="Search"
            />
            <button hidden>Search</button>
          </form> */}
          <div className=" flex flex-1 md:flex-initial items-center bg-white rounded-md m-2 ">
            <BoardList
              activeBoardId={activeBoardId}
              setActiveBoardId={setActiveBoardId}
            />
          </div>
          {/* <div className="w-10 h-10 bg-red-200 rounded-full flex justify-center items-center">
            GP
          </div> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
