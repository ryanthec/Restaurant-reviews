import mongodb from "mongodb"

//We import mongodb so that we can get this objectID variable
//It is used so that we can convert a string to a mongodb oject ID
const ObjectId = mongodb.ObjectId;

//Create a variable restaurants to store a reference to our database
let restaurants;

export default class RestaurantsDAO {
    //injectDB method is usued to connect to our database
    //this method will be called as soon as our server starts
    //it gets a reference to our restaurant database
    static async injectDB(conn)
    {
        if(restaurants)
        {
            return;
        }
        try
        {
            //conn is connection
            //process.env.RESTREVIEWS_NS is our database name
            //.collections is to specifically get the certain collection
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants");
        }
        catch(e)
        {
            console.error(`Unable to establish a connection: ${e}`);
        }
    }

    //getRestaurants function to get all restaurants in the database
    static async getRestaurants({
        //these are like the settings for the functions
        //You can select what filters you want
        //It is defaulted to page 0 and 20 restaurants per page
        filters = null,
        page = 0,
        restaurantsPerPage = 20} = {})
    {
        //We create a query in case the user has queries
        //The queries only work when filters are not null
        //If filters are null, then just simply return the whole list
        let query;
        if(filters)
        {
            //These are 3 different queries aka searches
            if("name" in filters)
            {
                //This is a textsearch
                //Instead of something that is equal, we just search in $text
                //We search for "name" in filters["name"]
                //But when we are searching for the name, there is no database field specified
                //So to ensure the system knows which field to search for the name,
                //We need to set this up ourselves in mongoDB atlas
                //We need to specify in mongoDB that if someone does a textsearch, which fields in the database will be searched for that specific string
                //Setup for indexes is in the howToMakeDBField.txt file
                query = { $text: {$search: filters["name"]}};
            }
            else if("cuisine" in filters)
            {
                //$eq means equals
                //so we are checking if cuisine that was passed in (which is the cuisine in filters["cuisine"]) is equals to the database cuisine(the first one)
                query = { "cuisine": {$eq: filters["cuisine"]}};
            }
            else if("zipcode" in filters)
            {
                //same with cuisine
                query = { "address.zipcode": {$eq: filters["zipcode"]}};
            }
        }

    
        let cursor
        try{
            //this will find all the restaurants in the database
            //that go along with the query that we pass in
            //If there is no query, then it just returns all restaurants
            cursor = await restaurants.find(query);
        }
        catch(e)
        {
            console.error(`Unable to issue find command, ${e}`)
            return {restaurantsList: [], totalNumRestaurants: 0}
        }
        
        //limit to limit to how many restaurants per page
        //skip is needed so we know how many entries to skip to get to the next page
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);

        try{
            //To get the array of restaurants
            const restaurantsList = await displayCursor.toArray();
            //To get the num of restaurants, we do this by counting documents
            const totalNumRestaurants = await restaurants.countDocuments(query);

            return {restaurantsList, totalNumRestaurants};
        }
        catch(e)
        {
            console.error(`UNable to convert cursor to array or problem counting documents, ${e}`);
            return {restuarantsList: [], totalNumRestaurants: 0};
        }
    }

    //This method returns a restaurant of a specific id
    //But it has an additional feature to take the reviews of that restaurant
    //and put it into the restaurant object to be returned in restauratns.controller
    static async getRestaurantByID(id)
    {
        try{
            //A pipeline helps match different collections together
            const pipeline = [
                {
                    //Match objectIds
                    $match: {_id: ObjectId.createFromHexString(id)}
                },
                    {
                        //Lookup different items which are the reviews to add to the result
                        $lookup: 
                        {
                            from: "reviews",
                            let: { id: "$_id"},
                            //From the reviews collection, we create this pipeline
                            //This pipeline will find and match all the reviews with this specific restaurant id
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$restaurant_id", "$$id"]
                                        }
                                    }
                                },
                                {
                                    //Just to sort by decreasing date
                                    $sort: {date: -1}
                                }
                            ],
                            //The result will be saved as "reviews"
                            as: "reviews"
                        }
                    },
                    {
                        $addFields:{
                            reviews: "$reviews"
                        }
                    }
            ]
            //This returns the next item which is the restaurant with all reviews connected
            return await restaurants.aggregate(pipeline).next();
        }
        catch(e)
        {
            console.error(`Something went wrong in getRestaurantByID: ${e}`);
            throw e;
        }
    }


    //Method to get cuisines
    static async getCuisines(){
        let cuisines = [];
        try{
            //Use .distinct to only get unique values
            cuisines = await restaurants.distinct("cuisine");
            return cuisines;
        }
        catch(e)
        {
            console.error(`Unable to get cuisines, ${e}`);
            return cuisines;
        }
    }
}