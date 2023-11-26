import { useEffect, useRef, useState } from 'react'
import image1 from '../../assets/images/slider/slide1.jpg'
import image2 from '../../assets/images/slider/slide2.jpg'
import image3 from '../../assets/images/slider/slide3.jpg'
import image4 from '../../assets/images/slider/slide4.jpg'
import './index.css'
import { useNavigate } from 'react-router-dom'
const images = [image1,image2,image3,image4]
export default function Home(){
    const [slide,setSlide] = useState(0)
    const slideRef = useRef(null)
    const navigate = useNavigate()
    useEffect(()=>{
        
        slideRef.current.scrollTo({
            left:slideRef.current.clientWidth*slide,
            behavior:'smooth'        
        })  
        setTimeout(()=>{
            if(slide===images.length-1){
                setSlide(0)
            }else{
                setSlide(slide+1)
            }
        },5000)
    }
    ,[slide])
            

    return(
        <div className="min-h-[100vh] relative backdrop-blur-xl pt-[50px] flex flex-col   items-center">
            
            <div className=' w-[100%] h-[80vh] overflow-x-scroll flex flex-row hide-scroll' ref={slideRef}>
                {
                    images.map((image,index)=>{
                        return(
                            <div key={index} className='min-w-full  min-h-[100%] flex justify-center items-start'>
                                <img src={image} alt='slide' className=' w-[100%]' />
                            </div>
                        )
                    
                    })
                }
                
            </div>
            <div className=' w-[100%] h-[80vh] absolute  flex flex-col'>
               <div className='w-full h-full relative flex justify-center items-center'>
                    <h1 className='text-5xl font-bold text-center text-white'>Welcome to Movie Recommender</h1>
                    <div className='absolute bottom-5 flex flex-row'>
                        {
                            images.map((image,index)=>{
                                return(
                                    <div key={index} className={`cursor-pointer h-[15px]    mx-2 rounded-full  ${slide===index?'selected-div':'w-[15px] bg-[#7A7777]'} `}></div>
                                )
                            })
                        }
                    </div>
               </div>
            </div> 
            <div className='w-full h-[10vh] flex flex-col justify-center items-center'>
                <div className='w-[80%] h-[10vh] flex flex-col justify-center items-center'>
                    
                    <p className='text-xl font-bold text-center text-white'>Get movie recommendations based on your taste</p>
                </div>
                <div className='w-[80%] h-[10vh] flex flex-row justify-center items-center'>
                    <button className='w-[200px] h-[50px] bg-secondary rounded-md text-white font-bold text-xl hover:bg-theme hover:text-primary' onClick={()=>{navigate("/mygenres")}}>Get Started</button>
                    <button className='w-[200px] h-[50px] bg-white rounded-md text-secondary font-bold text-xl mx-4 hover:bg-theme hover:text-white' onClick={()=>{navigate("/browse")}}>Browse Movies</button>
                </div>
            </div>
            
        </div>
    )
}