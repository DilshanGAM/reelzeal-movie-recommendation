import { useEffect, useState } from "react";
import Paginator from "../../components/paginator";
import Movie from "../../components/Movie";
import axios from "axios";
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
export default function Browse(){
    const [query,setQuery] = useState('')
    const [Rating,setRating] = useState(-1)
    const [genre,setGenre] = useState('All')
    const [currentPage,setCurrentPage] = useState(1)
    const [movies,setMovies] = useState([]);
    const [totalPages,setTotalPages] = useState(1)
    const [isRefresh,setIsRefresh] = useState(false)
    useEffect(()=>{
        axios.get(`http://localhost:5000/get_movies?page=${currentPage}&genre=${genre}&name=${query}&rating=${Rating}`).then((res)=>{
            console.log(res.data)
            setMovies(res.data.movies||[])
            setTotalPages(res.data.total_pages)
        }
        ).catch((err)=>{
            console.log(err)
        })
        
    }
    ,[currentPage,isRefresh])
    return(
    <div className="min-h-[100vh] relative backdrop-blur-xl pt-[50px] flex flex-col     items-center">
        <div className="z-20 w-full h-[300px] border-t-[1px] border-secondary   bg-primary-dark flex flex-row justify-center items-center">
            <div className="w-[900px] relative  flex flex-col justify-end">
                <span className="text-2xl font-bold text-secondary">Search Movies</span>
                <div className="w-full relative">
                    <input type="text" className="w-[100%] h-[50px] rounded-md bg-primary text-white text-lg px-4 mt-4 " value={query} onChange={(e)=>{setQuery(e.target.value)}} placeholder="Enter movie name...."/>
                    <button className="absolute right-0 w-[200px] h-[50px]  rounded-md text-white font-bold text-lg bg-theme hover:animate-pulse  mt-4" onClick={()=>setIsRefresh(!isRefresh)}>Search</button>
                </div>
                <div className="w-full flex flex-row justify-center items-center">
                    <div className="flex flex-col mx-5">
                        <span className="text-lg  text-secondary">Genre:</span>
                        <select className="h-[50px] w-[200px] bg-primary text-secondary" value={genre} onChange={(e)=>{setGenre(e.target.value)}}>                            
                            <option value="All">All</option>
                            <option value="Action">Action</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Animation">Animation</option>
                            <option value="Biography">Biography</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Crime">Crime</option>
                            <option value="Drama">Drama</option>
                            <option value="Family">Family</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Film-Noir">Film-Noir</option>
                            <option value="Game-Show">Game-Show</option>
                            <option value="History">History</option>
                            <option value="Horror">Horror</option>
                            <option value="Music">Music</option>
                            <option value="Musical">Musical</option>
                            <option value="Mystery">Mystery</option>
                            <option value="News">News</option>
                            <option value="Reality-TV">Reality-TV</option>
                            <option value="Romance">Romance</option>
                            <option value="Sci-Fi">Sci-Fi</option>
                            <option value="Sport">Sport</option>
                            <option value="Talk-Show">Talk-Show</option>
                            <option value="Thriller">Thriller</option>
                            <option value="War">War</option>
                            <option value="Western">Western</option>
                        </select>
                    </div>
                    <div className="flex flex-col mx-5">
                        <span className="text-lg  text-secondary">Rating:</span>
                        <select className="h-[50px] w-[200px] bg-primary text-secondary" value={Rating} onChange={(e)=>{setRating(e.target.value)}} >                            
                            <option value="-1">All</option>
                            <option value="9">9+</option>
                            <option value="8">8+</option>
                            <option value="7">7+</option>
                            <option value="6">6+</option>
                            <option value="5">5+</option>
                            <option value="4">4+</option>
                            <option value="3">3+</option>
                            <option value="2">2+</option>
                            <option value="1">1+</option>
                        </select>
                    </div>
                </div>
                
            </div>
        </div>
        
        <div className=" z-10 w-full  flex flex-col min-h-[500px]  items-center bg-primary text-white">
            <span className="text-theme text-xl m-5">Available Movies</span>
            <div className="w-full flex flex-row justify-center items-center">
                <Paginator totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            </div>
            <div className="w-[75%] flex flex-wrap justify-around">
            {
                movies.map((movie,index)=>{
                    return(
                        <Movie key={index} movie={movie}/>
                    )
                })
            }
            
            
            </div>
            
        </div>
    </div>)
}