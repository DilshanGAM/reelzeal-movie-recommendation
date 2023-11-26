import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {FaStar, FaUser} from 'react-icons/fa'
import './Movie.css'
import { useNavigate } from "react-router-dom";
export default function Movie(props){
    const movie = props.movie
    const [poster,setPoster] = useState('');
    const [year,setYear] = useState('');
    const coverRef = useRef(null)
    useEffect(()=>{
        axios.get(`http://www.omdbapi.com/?t=${movie.original_title}&apikey=bc1d472`)
        .then((res)=>{
            console.log(res.data)
            setPoster(res.data.Poster)
            setYear(res.data.Year)
        })
        .catch((err)=>{
            console.log(err)
        })
    
    },[poster,movie.original_title])
    function hideCover(){
        coverRef.current.style.display = 'none'
    }
    function showCover(){
        coverRef.current.style.display = 'flex'
    }
    const navigate = useNavigate()
    function handleClick(){
        navigate('/overview',{state:{movie:movie}})
    }
    return (
        <div className='min-w-[200px] relative h-[340px] flex flex-col justify-center overflow-hidden cursor-pointer mx-4' onMouseEnter={showCover} onMouseLeave={hideCover} >
            <div className="cover w-full top-0 absolute flex flex-col justify-center cursor-pointer hidden items-center h-[290px] rounded-xl bg-[#00000095]" ref={coverRef} onClick={handleClick}>
                <FaStar className='star text-theme text-4xl mx-2' />
                <span className='text-white text-lg font-bold '>{movie.vote_average}{"/"}10</span>
            </div>
            <img  src={poster} alt='movie' className='w-[200px] h-[295px] border-white border-[5px] rounded-xl' />
                <span  className='mx-2 text-white text-lg font-bold hover:text-secondary cursor-pointer w-full overflow-hidden' onClick={handleClick}>{movie.original_title.length>18?movie.original_title.substring(0,18)+"...":movie.original_title}</span>
            <span className='mx-2 text-secondary font-bold text-md '>{year}</span>
        </div>
    )

}