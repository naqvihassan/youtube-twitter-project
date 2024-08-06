//require('dotenv').config({path: './env'})


import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {

        // Global error handler
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });


        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`Server is running at PORT ${port}`)
        })
        // Error listener for server startup
        server.on("error", (error) => {
            console.error("Error starting server:", error);
            process.exit(1);
        });
    })
    .catch((error) => {
        console.log("MONGO db connection failed !!!", error)
    })











/*
import express from "express"
const app = express()


;(async () =>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("ERROR: ", error);
            throw error;
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT} `)
        })
    } catch(error){
        console.error("ERROR: ", error);
            throw error
    }
})

*/