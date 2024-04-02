import mongodb from "mongodb"

//We import mongodb so that we can get this objectID variable
//It is used so that we can convert a string to a mongodb oject ID
const ObjectId = mongodb.ObjectId;

//Currently an empty variable, but we will fill it with the reviews collection
let reviews;

export default class ReviewsDao{

    //Same as restaurantsDAO
    //We need to get the reference to our restaurants database
    //For the reviews collection
    static async injectDB(conn){
        if(reviews)
        {
            return reviews
        }
        try
        {
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews");
        }
        catch(e)
        {
            console.error(`Unable to establish a connection: ${e}`);
        }
    }

    //Method to add a review
    static async addReview(restaurantId, user, review, date){
        try{
            //Create a reviewDoc
            //Format of the reviewDoc depends on the objects in the database
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                text: review,
                //Create its own objectId
                restaurant_id: ObjectId.createFromHexString(restaurantId)
            }
            //Inserts the doc into the database
            return await reviews.insertOne(reviewDoc);
        }
        catch(e)
        {
            console.error(`Unable to post review: ${e}`);
            return{error:e};
        }
    }

    //Method to update a review
    static async updateReview(reviewId, userId, text, date){
        try{
            const updateResponse = await reviews.updateOne(
                //We will look for an object with the correct userId and reviewId
                //We will only update the review if the userId matches
                {user_id: userId, _id: ObjectId.createFromHexString(reviewId)},
                //Set the new text and new date
                { $set: {text: text, date: date} }
            )
            return updateResponse;
        }
        catch(e)
        {
            console.error(`Unable to update review: ${e}`);
            return{error:e};
        }
    }

    //Method to delete a review
    static async deleteReview(reviewId, userId){
        try{
            const deleteResponse = await reviews.deleteOne(
                //Again, we check for review and user ids
                {_id: ObjectId.createFromHexString(reviewId), user_id: userId}
            )
            return deleteResponse;
        }
        catch(e)
        {
            console.error(`Unable to delete review: ${e}`);
            return{error:e};
        }
    }
}