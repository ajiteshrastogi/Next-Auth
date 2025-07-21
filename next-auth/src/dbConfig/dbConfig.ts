import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL!);
        // here '!' means , don't worry the url will always present so no worry for the what if url is not present

        const connection = mongoose.connection;
        connection.on('connected', ()=>{
            console.log("DataBase Connected Successfully");
        })
        connection.on('error', (error)=>{
            console.log("Somwthing went WRong in DB");
            console.log(error);
            process.exit();
        })
    } catch (error) {
        console.log("Something Wrong in Database");
        console.log(error);
    }
}