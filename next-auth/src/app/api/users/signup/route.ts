import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {FullName, email, password} =  reqBody
        console.log(reqBody);

        // if user already is already exists

        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error : "User alredy exist"}, {status: 400})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = new User({
            FullName,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save()
        console.log(savedUser);
        
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message: "User created successfully",
            sucess : true,
            savedUser
        })
        

    } catch (error : any) {
        return NextResponse.json({error : error.message}, {status: 500})
    }
}