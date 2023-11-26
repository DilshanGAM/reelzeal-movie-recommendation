import { NavLink, useLocation } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { useEffect, useState } from 'react'
import { FaUser, FaUserCircle } from 'react-icons/fa';
export default function Header(){
    const location = useLocation()
    const [active,setActive] = useState('home');
    const username = localStorage.getItem('username')||null
    useEffect(()=>{
        console.log(location)
        if(location.pathname==='/browse'){
            setActive('browse')
        }else if(location.pathname==='/mygenres'){
            setActive('mygenres')
        }else if(location.pathname==='/recommendations'){
            setActive('recommendations')
        }else if(location.pathname==='/overview'){
            setActive('overview')
        }else if(location.pathname==='/login'){
            setActive('login')
        }else{
            setActive('home')
        }

    },[location])
    const logout = () => {
        if(confirm('Are you sure you want to logout?')){
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            window.location.href = '/'
        }
    }
    return(
        <header className="w-full bg-primary min-h-[50px] max-h-[50px] flex items-center absolute test z-[99]">
            <img src={logo} alt="logo" className='h-[40px] left-[40px] absolute' />
            <div className='w-full h-full flex items-center justify-end p-4'>
                <NavLink to='/' className={`text-secondary text-sm font-bold mx-4 hover:text-white ${active==='home'&&'text-white'}`}>Home</NavLink>
                <NavLink to='/browse' className={`text-secondary text-sm font-bold mx-4 hover:text-white ${active==='browse'&&'text-white'}`}>Browse Movies</NavLink>
                <NavLink to='/mygenres' className={`text-secondary text-sm font-bold mx-4 hover:text-white ${active==='mygenres'&&'text-white'}`}>My Genres</NavLink>
                <NavLink to='/recommendations' className={`text-secondary text-sm font-bold mx-4 hover:text-white ${active==='recommendations'&&'text-white'}`}>Recommendations</NavLink>
                {!username?
                    <NavLink to='/login' className={`text-secondary text-sm font-bold mx-4 hover:text-white ${active==='login'&&'text-white'}`}>Login</NavLink>
                    :
                    <button to='/login' className={`text-secondary text-sm font-bold mx-4 flex flex-row items-center text-center hover:text-white ${active==='login'&&'text-white'}`} onClick={logout}><FaUserCircle className='mx-1'/>{username}</button>
                }
                

            </div>            
        </header>
    )
}