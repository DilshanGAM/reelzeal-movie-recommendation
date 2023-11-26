import axios from "axios";
import { useEffect, useState } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom"

const sampleComments = [
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome",
    "This movie is awesome This movie is awesome This movie is awesome This movie is awesome This movie is awesome This movie is awesome This movie is awesome This movie is awesome This movie is awesome This movie is awesome This movie is awesome This movie is awesome This movie is awesome This movie is awesome",
]

export default function OverView(){
    const movie = useLocation().state.movie
    const [poster,setPoster] = useState('');
    const [year,setYear] = useState('');
    const [comments,setComments] = useState(sampleComments)
    const [isCommentsSetted,setIsCommentsSetted] = useState(false)
    const [comment,setComment] = useState('')
    const [isLiked,setIsLiked] = useState(false)
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
        axios.get(`http://localhost:5000/get_comments?movie_title=${movie.original_title}`).then((res)=>{
            console.log(res.data)
            const tempComments = []
            for(let i=0;i<res.data.length;i++){
                tempComments.push(res.data[i].comment)
            }
            setComments(tempComments)
            
        }).catch((err)=>{
            console.log(err)
        }
        )
        axios.get(`http://localhost:5000/check_like?username=${localStorage.getItem('username')}&movie_title=${movie.original_title}`).then((res)=>{
            console.log(res.data)
            if(res.data.liked){
                setIsLiked(true)
            }
            else{
                setIsLiked(false)
            }
        }).catch((err)=>{
            console.log(err)
        })

    
    },[isCommentsSetted,isLiked])
    const pressLike = ()=>{
        if(isLiked){
            axios.post('http://localhost:5000/delete_like',{
                username: localStorage.getItem('username'),
                movie_title: movie.original_title
            }).then((res)=>{
                console.log(res.data)
                if(res.data.message === 'Like deleted successfully'){
                    setIsLiked(!isLiked)
                }
            }).catch((err)=>{
                console.log(err)
            }
            )
        }
        else{
            axios.post('http://localhost:5000/add_like',{
                username: localStorage.getItem('username'),
                movie_title: movie.original_title
            }).then((res)=>{
                console.log(res.data)
                if(res.data.message === 'Like added successfully'){
                    setIsLiked(!isLiked)
                }
            }).catch((err)=>{
                console.log(err)
            }
            )
        }    
    }
    console.log(movie)
    const submitComment = ()=>{
        const username = localStorage.getItem('username')
        axios.post('http://localhost:5000/add_comment',{
            username: username,
            movie_title: movie.original_title,
            comment: comment
        }).then((res)=>{
            console.log(res.data)
            if(res.data.message === 'Comment added successfully'){
                setIsCommentsSetted(!isCommentsSetted)
                setComment('')
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
    return(
        <div className="w-full  min-h-[100vh] pt-[50px] bg-[#00000065]  flex flex-row justify-evenly items-center backdrop-blur-xl  scrollbar-thin scrollbar-thumb-theme">
           <div className=" flex flex-col w-[400px] h-[670px] ">
           <span className="text-white text-xl text-center  font-bold w-full">{movie.tagline.length>40?movie.tagline.substring(0,39)+"...":movie.tagline}</span> 
                <img className="w-full border-white border-[10px] rounded-xl" src={poster} />
                <button className="h-[50px] flex flex-row justify-center mt-2 items-center w-full rounded-md bg-theme hover:bg-green-950 text-white" onClick={pressLike}>
                    {
                        !isLiked?
                        <FaThumbsUp className="text-white text-2xl mx-2" /> :
                        <FaThumbsDown className="text-white text-2xl mx-2" />
                    }                                   
                    <span className="text-white text-lg font-bold" >{isLiked?"Unlike":"Like"}</span>
                </button>
           </div>
           <div className="flex flex-col justify-start items-center w-[400px] min-h-[670px] ">
                <span className="text-white text-4xl text-center font-bold my-16">{movie.original_title}</span>
                <span className="text-white text-xl text-center font-bold w-[45%] my-10">{year}</span>   
                <span className="text-white text-xl text-center  font-bold w-[45%]">{movie.genre_modified}</span>
                <span className="text-white text-md text-center  font-bold w-[90%] my-10">{movie.vote_average}{"/10"}</span>
                <span className="text-white text-md text-center  font-bold w-[90%] my-10">{movie.overview}</span>                
           </div>
           <div className="flex flex-col justify-start items-center pt-[50px] w-[600px] min-h-[670px]">
                <div className="flex flex-col h-[500px] overflow-y-scroll scrollbar-thin scrollbar-thumb-theme">
                    {
                        comments.map((comment,index)=>{
                            return(
                                <div key={index} className="w-[500px] p-4 bg-primary-dark rounded-xl flex flex-col justify-center items-start my-1">
                                    <span className="text-md font-bold text-secondary mx-4">{comment}</span>                                    
                                </div>
                            )
                        })
                    }
                </div> 
                <div className="flex flex-row justify-center items-center w-[500px] h-[100px]">
                    <input className="w-[400px] h-[50px] rounded-md bg-primary-dark text-white text-md font-bold px-4" value={comment} onChange={(e)=>{setComment(e.target.value)}} placeholder="Add a comment" />
                    <button className="w-[100px] h-[50px] rounded-md bg-theme hover:bg-green-950 text-white text-xl font-bold" onClick={submitComment}>Post</button>
                </div>          
           </div>
           
        </div>
    )
}