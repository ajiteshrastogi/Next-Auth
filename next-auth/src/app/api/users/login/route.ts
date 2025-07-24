import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'; 

connect();

export async function POST(request : NextRequest){
    try {
        const reqBody = await request.json();
        const {email, password} = reqBody;
        
        //Checking is user exist ?
        const user = await User.findOne({email});

        if(!user){
           return NextResponse.json({error : "User Not Exist"}, {status: 500}) 
        }

        //Checking is password Correct ?
        const validatePassword = await bcryptjs.compare(password, user.password);
        if(!validatePassword){
            return NextResponse.json({error : "Invalid Credentials"}, {status: 500})
        }

        //creating token data
        const tokenData = {
            id: user._id,
            FullName: user.FullName,
            email: user.email
        }

        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn : "2d"})

        const response = NextResponse.json({
            message : "Login Successfully",
            sucesss: true
        })

        response.cookies.set("token", token, {
            httpOnly: true
        })

        return response;

        
    } catch (error: any) {
        return NextResponse.json({error : error.message}, {status: 500})
        
    }
}