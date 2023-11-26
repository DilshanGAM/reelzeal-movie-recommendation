import { useEffect, useRef, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import Movie from "./Movie"
import axios from "axios"

export default function TagSuggestionList(props) {
    const contentScroll = useRef(null)
    const likedMovieList = props.likedMovieList
    const movie = props.movie
    const [contentMovieList,setContentMovieList] = useState([])
    useEffect(()=>{

        contentMovieList
        axios.get(`http://localhost:5000/get_tag_recommends?movie=${movie}`).then(
            (res)=>{                
                console.log(res.data.list)
                setContentMovieList(res.data.list)
            }
        )
        
    },[likedMovieList,movie])
    return(
        <>
            <span className="text-white text-xl ml-10 fon-bold w-[75%] h-[40px] flex  flex-row items-center">{movie}</span>
            <div  className="w-full flex justify-center flex-row items-center">
            <FaChevronLeft className="text-secondary hover:text-white text-[50px]  cursor-pointer" onClick={()=>{
                contentScroll.current.scrollTo({
                    left:contentScroll.current.scrollLeft-500,
                    behavior:'smooth'
                })
            }
            }/>
            
            <div className="w-[75%] relative  flex flex-row overflow-x-scroll scrollbar-none" ref={contentScroll}>                    
                {
                    contentMovieList?.map((movie, index) => {
                        return(<Movie key={index} movie={movie} />)
                    }
                    )
                }
            </div>
            <FaChevronRight className="text-secondary hover:text-white text-[50px] cursor-pointer" onClick={()=>{
                contentScroll.current.scrollTo({
                    left:contentScroll.current.scrollLeft+500,
                    behavior:'smooth'
                })
            }
            }/>
        </div>
    </>
    )
}