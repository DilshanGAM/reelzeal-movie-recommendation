import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Movie from "../../components/Movie";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SuggestionList from "../../components/SuggestionList";
import TagSuggestionList from "../../components/TagSuggestionList";

const movie = {
    "budget": 237000000,
    "genres": [
        {"id": 28, "name": "Action"},
        {"id": 12, "name": "Adventure"},
        {"id": 14, "name": "Fantasy"},
        {"id": 878, "name": "Science Fiction"}
    ],
    "homepage": "http://www.avatarmovie.com/",
    "id": 19995,
    "keywords": [
        {"id": 1463, "name": "culture clash"},
        {"id": 2964, "name": "future"},
        {"id": 3386, "name": "space war"},
    ],
    "original_language": "en",
    "original_title": "Avatar",
    "overview": "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
    "popularity": 150.437577,
    "production_companies": [
        {"name": "Ingenious Film Partners", "id": 289},
        {"name": "Twentieth Century Fox Film Corporation", "id": 306},
    ],
    "production_countries": [
        {"iso_3166_1": "US", "name": "United States of America"},
        {"iso_3166_1": "GB", "name": "United Kingdom"}
    ],
    "release_date": "12/10/2009",
    "revenue": 2787965087,
    "runtime": 162,
    "spoken_languages": [
        {"iso_639_1": "en", "name": "English"},
        {"iso_639_1": "es", "name": "Español"}
    ],
    "status": "Released",
    "tagline": "Enter the World of Pandora.",
    "title": "Avatar",
    "vote_average": 7.2,
    "vote_count": 11800,
    "genre_modified": "Action Adventure Fantasy Science Fiction"
}



export default function Recommendations() {

    const genreScroll = useRef(null)
    
    const [isGenreSetted, setIsGenreSetted] = useState(false)
    const [likedMovies, setLikedMovies] = useState([])
   
  
    const [genreMovieList, setGenreMovieList] = useState([])
  
    const [isLiked, setIsLiked] = useState(false)
    useEffect(() => {

        if(!isGenreSetted){
            axios.get(`http://localhost:5000/get_genre_recommends?username=${localStorage.getItem('username')}`,{
               
            }).then((res)=>{                
                setGenreMovieList(res.data.movie_list)
                setIsGenreSetted(true)
            }).catch((err)=>{
                console.log(err)
            })
        }
        if(!isLiked){
            axios.get(`http://localhost:5000/get_liked_movies?username=${localStorage.getItem('username')}`,{
            }).then((res)=>{                
                setLikedMovies(res.data.liked_movies)        
                setIsLiked(true)
         
            }).catch((err)=>{
                console.log(err)
            })
        }

        
    }
    ,[isLiked])


    return (
        <div className="min-h-[100vh] max-h-[100vh] scrollbar-thin scrollbar-thumb-theme overflow-y-scroll backdrop-blur-xl w-full flex flex-col items-center pt-[50px]">
            <div className="mt-5 h-[500px] bg-primary-dark border-t-secondary border-t-[1px] w-full flex flex-col items-center justify-evenly py-4 ">
                <span className="text-white text-xl fon-bold w-[75%] h-[40px] flex  flex-row items-center"><FaChevronRight/> Based On Your Genre Selections</span>
                <div className="w-full flex justify-center flex-row items-center">
                    <FaChevronLeft className="text-secondary hover:text-white text-[50px]  cursor-pointer" onClick={()=>{
                        genreScroll.current.scrollTo({
                            left:genreScroll.current.scrollLeft-500,
                            behavior:'smooth'
                        })
                    }
                    }/>
                    <div className="w-[75%] relative  flex flex-row overflow-x-scroll scrollbar-none" ref={genreScroll}>                    
                        {
                            genreMovieList?.map((movie, index) => {
                                return(<Movie key={index} movie={movie} />)
                            }
                            )
                        }
                    </div>
                    <FaChevronRight className="text-secondary hover:text-white text-[50px] cursor-pointer" onClick={()=>{
                        genreScroll.current.scrollTo({
                            left:genreScroll.current.scrollLeft+500,
                            behavior:'smooth'
                        })
                    }
                    }/>
                </div>
            </div>
            <div className="mt-5  bg-primary-dark border-t-secondary border-t-[1px] w-full flex flex-col items-center justify-evenly py-4 ">
                <span className="text-white text-xl fon-bold w-[75%] h-[40px] flex  flex-row items-center"><FaChevronRight/> Based On Your Favourite Movie Content</span>
                {
                    likedMovies?.map((movie, index) => {
                        return (<SuggestionList key={index} movie={movie} likedMovieList={likedMovies} />
                        )                        
                    })
                }

            </div>
            <div className="mt-5  bg-primary-dark border-t-secondary border-t-[1px] w-full flex flex-col items-center justify-evenly py-4 ">
                <span className="text-white text-xl fon-bold w-[75%] h-[40px] flex  flex-row items-center"><FaChevronRight/> Based On Your Favourite Movie Tag Lines</span>
                {
                    likedMovies?.map((movie, index) => {
                        return (<TagSuggestionList key={index} movie={movie} likedMovieList={likedMovies} />
                        )                        
                    })
                }

            </div>
            
            
        </div>
    )
}