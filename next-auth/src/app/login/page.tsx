"use client";
import Link from "next/link";
import React, {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import { axios } from "axios";
import { toast } from "react-hot-toast";

function Login() {
    const [user, setUser] = useState({
        email: "",
        password: "",

    })

    const onLogin = async ()=> {

    }

    return ( 
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
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
            onClick={onLogin}>SignUp</button>
            <Link href='/signup'>Visit SignUp Page</Link>
        </div>
     );
}

export default Login;