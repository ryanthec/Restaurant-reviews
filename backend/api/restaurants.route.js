import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"

//get the express router
const router = express.Router();

//Example default route that is basically just a /
//router.route("/").get((req,res) => res.send("Hello World"));

//We get the route from our route controller, our default route
//Gets the list of all restaurants
router.route("/").get(RestaurantsCtrl.apiGetRestaurants);

//Get a specific restaurant with a specific ID
//This not only returns the restaurant, but the reviews associated with it
//To use this, the format is as such
//eg. 
//http://localhost:5000/api/v1/restaurants/id/5eb3d668b31de5d588f4292a
//The random string after id/ is the restaurantId
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById);

//This returns the list of all cuisine types
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines);


//We create methods that will be called whenever a router does a post, put or delete
router
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview);


export default router