import ReviewsDAO from "../dao/reviewsDAO.js"


//USAGE INSTRUCTIONS AT THE BOTTOM
export default class ReviewsController {

    //Method to post a review
    static async apiPostReview(req, res, next){

        try{
            //get the new restaurant ID from the body
            const restaurantId = req.body.restaurant_id;
            //get the new review
            const review = req.body.text;
            //get the user info
            const userInfo = {name: req.body.name, _id: req.body.user_id};
            //get a new date object to get the time of review creation
            const date = new Date();

            //Combine all into 1
            const reviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review,
                date
            )
            res.json({status: "success"});
        }
        catch(e)
        {
            res.status(500).json({error: e.message});
        }
    }

    //Update review method
    static async apiUpdateReview(req, res, next){

        try{
            //Get the review id to select which review to update
            const reviewId = req.body.review_id;
            //Get the new text to update
            const text = req.body.text;  
            //get a new date object to get the time of review creation
            const date = new Date();

            //Combine all into 1
            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                //We need to user_id to check that the user who created the review is the same one as the one who is trying to update it
                req.body.user_id,
                text,
                date
            )
            
            var {error} = reviewResponse;
            if(error)
            {
                res.status(400).json({error});
            }

            //If no reviews were updated
            if(reviewResponse.modifiedCount===0)
            {
                throw new Error("Unable to update review");
            }

            res.json({status: "success"});
        }
        catch(e)
        {
            res.status(500).json({error: e.message});
        }
    }

    //Delete review method
    static async apiDeleteReview(req, res, next) {

        try{
            //The reviewId this time is a query parameter instead of body
            const reviewId = req.query.id;
            //We get the user_id from the body
            //To check that the userId that want to delete, created the review
            //However in an actual app, usually we dont have anything in the body,
            //more complex authentication is used
            const userId = req.body.user_id;
            console.log(reviewId);

            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId
            )
            res.json({status: "success"});
        }
        catch(e)
        {
            res.status(500).json({error: e.message});
        }
    }
}


/*
To use review, just use
http://localhost:5000/api/v1/restaurants/review


To add review,
You need to add a review in the body
MAKE SURE YOU CHANGE THE API TO POST, NOT GET
eg. 
{
    "restaurant_id": "5eb3d668b31de5d588f4292a",
    "text": "Great Food",
    "user_id": "1234",
    "name": "Ryan"
}


To update review,
MAKE SURE API IS PUT
You need to have the update review body
eg.
{
    "review_id": "65e73925523f64a6955ea847",
    "text": "Great Food, but slow service",
    "user_id": "1234",
    "name": "Ryan"
}
The review_id is from the review object


To delete reivew,
MAKE SURE API IS DELETE
This time, we have to add more stuff into the api link
eg.
http://localhost:5000/api/v1/restaurants/review?id=65e73925523f64a6955ea847
We now shift the id into the link as reviewID is a query param, not body

The body will be as follows
eg.
{
    "user_id": "1234",
    "name": "Ryan"
}
There is no need for id in the body now

*/