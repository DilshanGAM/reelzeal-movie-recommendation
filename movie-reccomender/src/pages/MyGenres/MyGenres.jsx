const gg = "Action Adventure";

const genreList = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Drama",
    "Family",
    "Fantasy",
    "Film-Noir",
    "Game-Show",
    "History",
    "Horror",
    "Music",
    "Musical",
    "Mystery",
    "News",
    "Reality-TV",
    "Romance",
    "Sci-Fi",
    "Sport",
    "Talk-Show",
    "Thriller",
    "War",
    "Western"
]
import { useEffect, useRef, useState } from 'react';
import './MyGenres.css'
import { FaArrowDown, FaArrowUp, FaSave, FaTrash } from 'react-icons/fa';
import axios from 'axios';
export default function MyGenres(){
    const labelArray = []
    for(let i=0;i<25;i++){
        labelArray.push(useRef(null))
    }

    const [genres,setGenres] = useState(genreList)
    const[genreSetted,setGenreSetted] = useState(true)
    const [myGenres,setMyGenres] = useState(gg.split(" "))
    const [myGenresSetted,setMyGenresSetted] = useState(true)
 
    useEffect(()=>{
        axios.get(`http://localhost:5000/get_my_genres?username=${localStorage.getItem('username')}`).then((res)=>{
                       
            if(res.data.my_genres!==''){
                setMyGenres(res.data.my_genres.split(" "))
                setGenres(genreList.filter((genre)=>!res.data.my_genres0000.includes(genre)))
            }else{
                setMyGenres([])
            }
            
            setGenreSetted(true)
        }).catch((err)=>{
            console.log(err)
        })
    },[genreSetted])
    const updateMyGenre= ()=>{
        axios.post(`http://localhost:5000/update_my_genres`,{
            username:localStorage.getItem('username'),
            my_genres:myGenres.join(" ")
        }).then((res)=>{
            console.log(res.data)
            setGenreSetted(false)
        }).catch((err)=>{
            console.log(err)
        })
    }

    const mappedElements =  myGenres.map((genre, index) => {
     labelArray[index]
    
        return (          
            <div key={index} className="relative min-w-[100px] min-h-[50px] mx-2 my-5" onMouseEnter={()=>{
                labelArray[index].current.classList.add('label')
                labelArray[index].current.classList.add('bg-theme')
            }}
            onMouseLeave={()=>{
                labelArray[index].current.classList.remove('label')
                labelArray[index].current.classList.remove('bg-theme')
                }
            }
            >
                <div  className="absolute cursor-pointer top-0 w-full    z-10  min-w-[100px] p-4 text-center h-[50px] flex flex-row justify-end items-center   rounded-md ">
                    <FaArrowUp className="text-xl text-theme hover:text-green-950 rounded-full cursor-pointer mx-2  font-bold" 
                    onClick={()=>{
                        if(index!==0){
                            const temp = myGenres[index-1]
                            myGenres[index-1] = myGenres[index]
                            myGenres[index] = temp
                            setMyGenres([...myGenres])
                        }
                    }}/>
                    <FaArrowDown className="text-xl text-theme hover:text-green-950 cursor-pointer mx-2  font-bold" 
                    onClick={()=>{
                        if(index!==myGenres.length-1){
                            const temp = myGenres[index+1]
                            myGenres[index+1] = myGenres[index]
                            myGenres[index] = temp
                            setMyGenres([...myGenres])
                        }
                    }}/>
                    <FaTrash className="text-xl text-red-600 hover:text-red-950 cursor-pointer mx-2  font-bold" 
                    onClick={()=>{
                        const temp = myGenres.filter((genre)=>genre!==myGenres[index])
                        setMyGenres([...temp])
                        setGenres([...genres,myGenres[index]])
                    }}/>
                </div>
                <div  className="cursor-pointer z-20 absolute top-0   min-w-full p-4 text-center h-[50px] flex justify-center items-center bg-primary text-white rounded-md " ref={labelArray[index]}>
                    <span className="text-lg font-bold">{genre}</span>
                </div>
            </div>
        );
      });
    
    


    return(
        <div className="w-full h-[100vh] pt-[100px] backdrop-blur-xl flex flex-row justify-center items-center ">
            <div className="absolute bottom-10 z-[100] right-10 text-xl font-bold flex flex-row bg-white p-3 rounded-full justify-center items-center text-theme cursor-pointer hover:text-green-950" onClick={updateMyGenre}>
                <FaSave className="mx-2" /> Save Changes
            </div>
            
            <div className="absolute top-10 w-full h-[10vh] flex flex-col justify-center items-center">
                <span className=" text-3xl font-bold text-white">Your favourites to Your Fingertips</span>
            </div>
            <div className="w-[75%] h-[80vh] flex flex-row justify-start ">
                <div className="w-[50%] h-[100%] flex flex-wrap  items-">
                    <span className="text-2xl font-bold w-full text-center text-white">All Genres</span>

                    {
                        genres.map((genre,index)=>{
                            return(

                                <div key={index} className="cursor-pointer hover:bg-theme min-w-[100px] p-4 text-center h-[50px] flex justify-center items-center bg-primary text-white rounded-md mx-2" onClick={()=>{
                                    setMyGenres([...myGenres,genre])
                                    //setGenreSetted(false)   
                                    setGenres(genreList.filter((genre)=>!myGenres.includes(genre)))                                 
                                }}>
                                    <span className="text-lg font-bold">{genre}</span>
                                </div>
                            )
                        })
                    }
                    
                </div>
                <div className="w-[50%] h-[100%] flex flex-col  items-">
                    <span className="text-2xl font-bold w-full text-center  text-white">My Genres</span>
                        <div className="w-full h-full flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-theme">

                            {
                                mappedElements.map((element)=>{
                                    return(
                                        element
                                    )
                                }
                                )
                            }
                        </div>
                    
                </div>
                
            </div>    

        </div>
    )
    
}