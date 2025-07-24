"use client";
import Link from "next/link";
import React, {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

function SignUp() {
    const router  = useRouter();
    const [user, setUser] = useState({
        FullName: "",
        email: "",
        password: "",

    })
    const [buttonDisable, setButtonDisable] =  useState(false);
    const [loading, setLoading] =  useState(false);

    const onSignUp = async ()=> {
        try {
            setLoading(true);
            const response = await axios.post('/api/users/signup', user);
            console.log(response.data);
            router.push('/login');
        } catch (error : any) {
            console.log(error.message);
            toast.error(error.message);
        }finally{
            setLoading(false);
        }

    }

    useEffect(()=>{
        if(user.FullName.length > 0 && user.email.length > 0 && user.password.length > 0) setButtonDisable(false);
        else setButtonDisable(true);
    }, [user])

    return ( 
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading? "Processing" : " SignUp"}</h1>
            <label htmlFor="FullName">FullName</label>
            <input
                id="FullName"
                type="text"
                placeholder="Full Name"
                value={user.FullName}
                onChange={(e) => setUser({...user, FullName: e.target.value })}
            />
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
            onClick={onSignUp}>{buttonDisable ? "No SignUp" : "SignUp"}</button>
            <Link href='/login'>Visit Login Page</Link>
        </div>
     );
}

export default SignUp;