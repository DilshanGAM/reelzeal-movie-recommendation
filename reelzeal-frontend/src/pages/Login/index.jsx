import axios from "axios"
import { useState } from "react"

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const login = async () => {
        await axios.post('http://localhost:5000/login',{
            username: username,
            password: password
        }).then((res)=>{
            console.log(res.data)
            if(res.data.token){
                console.log(res.data)
                localStorage.setItem('token',res.data.token)
                localStorage.setItem('username',username)
                window.location.href = '/'
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
    return (
        <div className="w-full min-h-[100vh] backdrop-blur-xl pt-[50px] flex flex-col justify-center items-center">
            <div className="w-[500px] h-[500px] bg-primary-dark rounded-xl flex flex-col justify-evenly items-center">
                <span className="text-white text-4xl font-bold">Login</span>
                <div className="w-[80%] h-[50px] flex flex-col justify-center items-center">
                    <input className="w-full h-full bg-primary rounded-md px-2 text-white" value={username} onChange={(e)=>{setUsername(e.target.value)}} placeholder="Username" />
                </div>
                <div className="w-[80%] h-[50px] flex flex-col justify-center items-center">
                    <input className="w-full h-full bg-primary rounded-md px-2 text-white" value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder="Password" />
                </div>
                <div className="w-[80%] h-[50px] flex flex-col justify-center items-center">
                    <button className="w-full h-full bg-theme hover:bg-green-950 rounded-md px-2 text-white" onClick={login}>Login</button>
                </div>
                <div className="w-[80%] h-[50px] flex flex-col justify-center items-center">
                    <button className="hover:bg-primary w-full h-full bg-white rounded-md px-2 font-bold text-secondary"
                    onClick={()=>{
                        window.location.href = '/register'
                    }}
                    >New User? <span className="text-theme font-bold">Sign Up</span></button>
                </div>
            </div>            
        </div>
    )
}