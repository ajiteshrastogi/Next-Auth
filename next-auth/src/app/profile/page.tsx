"use client"
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Profile() {
    const router = useRouter()
    const logout = async ()=>{
        try {
            const response = await axios.get('api/users/logout');
            toast.success("Logout Successful");
            router.push('/login')
        } catch (error: any) {
            console.log("Error in logout :", error.message);
            toast.error(error.message);
        }
    }
    const [userData, setUserData] = useState("");

    const getUserDetails = async () => {
        const res = await axios.get('/api/users/me');
        console.log(res.data);
        setUserData(res.data._id);
        
    }
    return ( <>
    <h1>Welcome User</h1>
    <hr/>

    <p>Profile page</p>
        <h2 className="p-1 rounded bg-green-500">{userData == "" ? "Not Found" : <Link href={`/profile/${userData}`}>{userData}
        </Link>}</h2>

    <button className="bg-fuchsia-400 text-amber-300"
    onClick={logout}    
    >Logout</button>

    <button
        onClick={getUserDetails}
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >GetUser Details</button>

    </> );
}

export default Profile;