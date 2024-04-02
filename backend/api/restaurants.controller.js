import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {

    //This method is to get a query string for our api call

    //About the API query string,
    //To get filters to work, we just add a ? to the back of our apiURL
    //eg. http://localhost:5000/api/v1/restaurants?zipcode=10314
    //This filters restaurants that have that specific zipcode
    //To get to page 2, we just add &page=2 behind
    //eg. http://localhost:5000/api/v1/restaurants?zipcode=10314&page=2
    //To search by cuisine, just use ?cuisine=___
    //eg. http://localhost:5000/api/v1/restaurants?cuisine=American
    //To search by name, we cannot just use ?name=___
    //We need to setup in mongoDB atlas first as name is not a field in the database by default
    //Setup for indexes is in the howToMakeDBField.txt file
    //Once the name index is set up, we can use it as per normal
    // eg. http://localhost:5000/api/v1/restaurants?name=food
    //This ensures all restaurants in the list have the word "food" somewhere in their name

    static async apiGetRestaurants(req, res, next){
        //First we get the restaurants per page query string
        //Check if restaurantsPerPage exists, if yes we convert it to an int, else set it to its default value of 20
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20;
    
        //Second, we get the page query string
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    
        //Third, we get the filters query string

        let filters = {};
        if(req.query.cuisine)
        {
            filters.cuisine = req.query.cuisine;
        }
        else if(req.query.zipcode)
        {
            filters.zipcode = req.query.zipcode;
        }
        else if(req.query.name)
        {
            filters.name = req.query.name;
        }

        //We call the getRestaurants method and pass in the queries we got earlier
        //This function returns the restaurantsList and totalNumRestaurants
        const {restaurantsList, totalNumRestaurants} = await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage,
        });

        //We will create a response to send/respond when the api url is called
        let response = {
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        }
        //To send the json response with all the info of the response above
        res.json(response);
    }

    //Method to get a specific restaurant by ID and also its reviews
    static async apiGetRestaurantById(req,res,next)
    {
        try{
            //Get id
            let id = req.params.id;
            //Get restaurant by the id using a method
            let restaurant = await RestaurantsDAO.getRestaurantByID(id);
            if(!restaurant)
            {
                res.status(404).json({error: "Not Found"});
                return;
            }
            //return the restaurant
            res.json(restaurant);
        }
        catch(e)
        {
            console.log(`api, ${e}`);
            res.status(500).json({error: e});
        }
    }

    static async apiGetRestaurantCuisines(req,res,next)
    {
        try{
            let cuisines = await RestaurantsDAO.getCuisines();
            res.json(cuisines);
        }
        catch(e)
        {
            console.log(`api, ${e}`);
            res.status(500).json({error: e});
        }
    }

}