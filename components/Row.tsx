import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid"
import { DocumentData } from "firebase/firestore"
import React, { MutableRefObject, useRef, useState } from "react"
import { Movie } from "../utils/interfaces"
import Thumbnail from "./Thumbnail"

interface Props {
  title: string,
  // Quando usar firebase
  movies: Movie[] | DocumentData[]
}

function Row({ title, movies }: Props) {
  const rowRef = useRef<any>(null)
  const [isMoved, setIsMoved] = useState(false)
  const [slideNumber, setSlideNumber] = useState(0);

  const handleClick = (direction: string) => {
    setIsMoved(true);
    let distance = rowRef.current.getBoundingClientRect().x - 50;
    if (direction === "left" && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      rowRef.current.style.transform = `translateX(${230 + distance}px)`;
    }
    if (direction === "right" && slideNumber < 5) {
      setSlideNumber(slideNumber + 1);
      rowRef.current.style.transform = `translateX(${-230 + distance}px)`;
    }
  };
  
  return (
   
      <div className="w-full mt-[10px]">
        <span className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">{title}</span>
        <div className="relative">
          <ChevronLeftIcon className={`absolute top-0 bottom-0 left-0 z-50 m-auto h-full w-[50px] cursor-pointer text-[#e5e5e5] bg-[#000]`}
            onClick={() => handleClick('left')}
            style={{ display: !isMoved && "none" }}
          />

          <div ref={rowRef} className="flex ml-[50px] mt-[50px] w-max  translate-x-0 ease-in duration-300">
            {movies.map((movie, index) =>
          /*   { */
            /*   if(index === 2 || index === 3) return */ (<Thumbnail key={movie.id} movie={movie} index={index} setaMovida={isMoved}/>)
           /*  } */
            )}


          </div>

          <ChevronRightIcon className={`absolute top-0 bottom-0 right-0 z-50 m-auto h-full w-[50px] cursor-pointer text-[#e5e5e5] bg-[#000]`}
            onClick={() => handleClick('right')}
          />
        </div>
      </div>
  )
}

export default Row
