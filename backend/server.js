import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

//Make express app
const app = express();

//middleware that express is going to use
app.use(cors());
//express.json allows the server to accept json in the body of a request(GET/POST)
app.use(express.json());

//This is our main api link
//Our routes are in the restaurants file
app.use("/api/v1/restaurants", restaurants);

//If someone tries to go to a route that doesnt exist
app.use("*", (req,res) => {
    res.status(404).json({error: "not found"})
});

//export app as a module
//app will be imported to the file that access the database, 
//aka the file you will run to get the server to start
export default app;