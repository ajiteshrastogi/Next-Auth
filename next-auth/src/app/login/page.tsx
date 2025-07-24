"use client";
import Link from "next/link";
import React, {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

function Login() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",

    })
    const [buttonDisable, setButtonDisable] = useState(false);
    const [loading, setLoading] = useState(false);

    const onLogin = async ()=> {
        try {
            setLoading(true);
            const response = await axios.post('/api/users/login', user)
            console.log("You are Logged" , response.data);
            toast.success("Logged Successfully");
            router.push('/profile');
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        }finally{
            setLoading(false)
        }
    }
    
    useEffect(()=>{
        if(user.email.length > 0 && user.password.length > 0) setButtonDisable(false);
        else setButtonDisable(true);
    }, [user])

    return ( 
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing" : "Login"}</h1>
            <label htmlFor="email">Email</label>
            <input
                id="email"
                type="email"
                placeholder="E-Mail"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value })}
            />
            <label htmlFor="password">Password</label>
            <input
                id="password"
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value })}
            />
            <button 
            onClick={onLogin}>{buttonDisable ? "No Login": "Login"}</button>
            <Link href='/signup'>Visit SignUp Page</Link>
        </div>
     );
}

export default Login;