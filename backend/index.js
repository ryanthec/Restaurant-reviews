import app from "./server.js"
import mongodb from "mongodb"
//import dotenv to access the .env variables
import dotenv from "dotenv"
import RestaurantsDAO from "./dao/restaurantsDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"

//Loads the .env variables
dotenv.config();

const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

//Connect to the database
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        //Max users that can access the system is 50 at a time
        maxPoolSize: 50,
        //A request will timeout after 2500ms
        wtimeoutMS: 2500,
        //This is needed for mongodb
        useNewUrlParser: true
    }
).catch(err => {
    console.error(err.stack);
    process.exit(1);
})
//app.listen to start the web server
.then(async client => {
    //We call inject DB before our server starts
    //This is how we get the initial reference to the restaurants collection in the database
    await RestaurantsDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});