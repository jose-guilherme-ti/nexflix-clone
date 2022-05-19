import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRecoilState } from 'recoil'
import { modalState, movieState } from '../atoms/modalAtom'
import { Element, Genre, Movie } from "../utils/interfaces"
import { collection, deleteDoc, doc, DocumentData, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import useAuth from '../hooks/useAuth'
import {
  PlayArrow,
  Add,
  ThumbUpAltOutlined,
  ThumbDownOutlined,
} from "@material-ui/icons";
import {
  CheckIcon,
  PlusIcon,
  ThumbUpIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon,
} from '@heroicons/react/outline'
import ReactPlayer from 'react-player/lazy'
import toast, { Toaster } from 'react-hot-toast'

interface Props {
  // Quando usar firebase
  movie: Movie | DocumentData
  index: number
  setaMovida: boolean
  //movie: Movie 
}
const toastStyle = {
  background: 'white',
  color: 'black',
  fontWeight: 'bold',
  fontSize: '16px',
  padding: '15px',
  borderRadius: '9999px',
  maxWidth: '1000px',
}

function Thumbnail({ movie, index, setaMovida }: Props) {
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState)
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [isHovered, setIsHovered] = useState(false);
  const [trailer, setTrailer] = useState("")
  const [genres, setGenres] = useState<Genre[]>([])
  const [addedToList, setAddedToList] = useState(false)
  const { user } = useAuth()
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([])

  useEffect(() => {
    if (!movie) return
    async function fecthMovie() {
      const data = await fetch(
        `https://api.themoviedb.org/3/${movie?.media_type === 'tv' ? 'tv' : 'movie'
        }/${movie?.id}?api_key=${process.env.NEXT_PUBLIC_API_KEY
        }&language=pt-BR&append_to_response=videos`
      ).then((response) => response.json())
      if (data?.videos) {
        const index = data.videos.results.findIndex((element: Element) =>
          element.type === "Trailer"
        )
        console.log(data.videos?.results[index]?.key)
        setTrailer(data.videos?.results[index]?.key)
      }
      if (data?.genres) {
        setGenres(data.genres)
      }
    }
    fecthMovie()
  }, [isHovered])

// Find all the movies in the user's list
useEffect(() => {
  if (user) {
    console.log(' Find all the movies in the user list');
    return onSnapshot(
      collection(db, 'customers', user.uid, 'myList'),
      (snapshot) => setMovies(snapshot.docs)
    )
  }
}, [db, movie?.id])

// Check if the movie is already in the user's list
useEffect(() => {
  console.log(`Check if the movie is already in the user's list`, movie?.id,  movies.findIndex((result) => result.data().id === movie?.id) !== -1)
  setAddedToList(
    movies.findIndex((result) => result.data().id === movie?.id) !== -1
  )
  
},[movies])

const handleList = async () => {
  if (addedToList) {
    await deleteDoc(
      doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!)
    )

    toast(
      `${movie?.title || movie?.original_name} has been removed from My List`,
      {
        duration: 8000,
        style: toastStyle,
      }
    )
  } else {
    await setDoc(
      doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!),
      {
        ...movie,
      }
    )

    toast(
      `${movie?.title || movie?.original_name} has been added to My List.`,
      {
        duration: 8000,
        style: toastStyle,
      }
    )
  }
}


  return (
    <div className={` w-[225px] h-[120px] bg-black mr-[5px] overflow-hidden cursor-pointer text-white  
    hover:absolute hover:w-[325px] hover:h-[300px]  hover:top-[-150px] rounded-md shadow-black
     `} style={{ left: isHovered && index * 225 + 10 + index * 2.5 }} 

     /*  onClick={() => {
        setCurrentMovie(movie)
        setShowModal(true)

      }} */

      /*  style={{ left: isHovered && index * 225 - 50 + index * 2.5 }} */
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path
          }`}
        className={`rounded-sm md:rounded  ${isHovered ? 'h-[140px]' : 'h-full'} w-full  object-cover `}
      />
      
      {isHovered && (
        <>
       {/*    <video src={"https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761"} autoPlay={true} loop 
           className={"w-full h-[140px] object-cover absolute top-0 left-0 "}/> */}
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width="100%"
            height="140px"
            style={{ position: 'absolute', top: '0', left: '0' }}
            playing
          />
          <div className="flex flex-col p-[5px]">
            <div className="flex mb-[10px]">
            <button className="modalButton" >
              <PlayArrow className="h-7 w-7" />
             </button>
              <button className="modalButton" onClick={handleList}>
                {addedToList ? (
                    <CheckIcon className="h-7 w-7" />
                ) : (
                    <PlusIcon className="h-7 w-7" />
                  )}
              </button>
              <button className="modalButton" >
              <ThumbUpAltOutlined className="h-7 w-7" />
              </button>
              <button className="modalButton" >
              <ThumbDownOutlined className="h-7 w-7" />
              </button>
            </div>
            <div className="flex align-center mb-[10px] text-[14px] font-bold text-gray-500">
              <span>{movie.title}</span>
              <span className="limit">+16</span>
              <span>{movie.release_date}</span>
            </div>
            <div className="desc">
              {movie.overview}
            </div>
            <div className="genre">Action</div>
          </div>
        </>
      )}
    </div>
  )
}

export default Thumbnail
