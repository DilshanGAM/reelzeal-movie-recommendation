import axios from "axios"
import { useState } from "react"

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const register = async () => {
        if(password === confirmPassword) {
            await axios.post('http://localhost:5000/register',{
                username: username,
                password: password
            
            }).then((res)=>{
                console.log(res.data.message==="User registered successfully!")
                if(res.data?.response?.message === 'User already exists'){
                    alert('User already exists')
                }
                if(res.data.message === 'User registered successfully!'){
                    window.location.href = '/login'
                }
            }).catch((err)=>{
                console.log(err)
            })
        }else{
            alert('Passwords do not match')
        }
    }
    return (
        <div className="w-full min-h-[100vh] backdrop-blur-xl pt-[50px] flex flex-col justify-center items-center">
            <div className="w-[500px] h-[600px] bg-primary-dark rounded-xl flex flex-col justify-evenly items-center">
                <span className="text-white text-4xl font-bold">Register</span>
                <div className="w-[80%] h-[50px] flex flex-col justify-center items-center">
                    <input className="w-full h-full bg-primary rounded-md px-2 text-white" value={username} onChange={(e)=>{setUsername(e.target.value)}} placeholder="Username" />
                </div>
                <div className="w-[80%] h-[50px] flex flex-col justify-center items-center">
                    <input className="w-full h-full bg-primary rounded-md px-2  text-white" value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder="Password" />
                </div>
                <div className="w-[80%] h-[50px] flex flex-col justify-center items-center">
                    <input className="w-full h-full bg-primary rounded-md px-2 text-white" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}} placeholder="Confirm Password" />
                </div>
                <div className="w-[80%] h-[50px] flex flex-col justify-center items-center" >
                    <button className="w-full h-full bg-theme hover:bg-green-950 rounded-md px-2 text-white" onClick={register}>Register</button>
                </div>
                <div className="w-[80%] h-[50px] flex flex-col justify-center items-center">
                    <button className="hover:bg-primary w-full h-full bg-white rounded-md px-2 font-bold text-secondary" onClick={()=>{
                        window.location.href = '/login'
                        }}>Registered User? <span className="text-theme font-bold">Log in</span></button>              
                </div>
            </div>            
        </div>
    )
}