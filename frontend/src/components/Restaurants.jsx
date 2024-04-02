import React, {useState, useEffect} from "react"
import RestaurantDataService from "../services/Restaurant.jsx"
import {Link, useParams} from "react-router-dom"

function Restaurant(props)
{
    const {id} = useParams();
    //Use this state to set up restaurant variable(usestate)
    const initialRestaurantState = {
        id: null,
        name: "",
        address: {},
        cuisine: "",
        reviews: []
    };

    const [restaurant, setRestaurant] = useState(initialRestaurantState);

    useEffect(() => {
        getRestaurant(id);
    }, [id]);

    function getRestaurant(id){
        if(!id){return;}
        //Get restaurant using dataservice class
        
        RestaurantDataService.get(id)
            .then(response => {
                //set restaurant variable to the fetched restaurant
                setRestaurant(response.data);
                console.log(response.data);
            })
            .catch(err => {
                console.error(err);
            });
    };
    
    //useEffect will be called only when the props.match.params.id is updated
    //So this will always be called as the id changes
    //Hence when id changes, it will change to a different restaurant
    


    function deleteReview(reviewId, index)
    {
        //Call deleteReview with the reviewId
        RestaurantDataService.deleteReview(reviewId, props.user.id)
            .then(response => {
                //set restaurant variable to be the array without removing the review yet
                setRestaurant((prevState) => {
                    //Use this state and splice(remove) the index that is to be deleted
                    prevState.reviews.splice(index, 1);
                    return({
                        //return the new prevState(after splice) to the setRestaurants method
                        ...prevState
                    })
                })
            })
            .catch(err => {
                console.error(err);
            });
    }



    return(
        <div>
            {restaurant ? (
            <div>
                <h5>{restaurant.name}</h5>
                <p>
                    <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
                    <strong>Address: </strong>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
                </p>
                <Link to={"/restaurants/" + id + "/review"} className = "btn btn-primary">
                    Add Review
                </Link>

                <h4>Reviews</h4>
                <div className = "row">
                    {restaurant.reviews.length > 0 ? (
                        restaurant.reviews.map((review, index) => {
                            return(
                                <div className = "col-lg-4 pb-1" key={index}>
                                    <div className = "card">
                                        <div className = "card-body">
                                            <p className = "card-text">
                                                {review.text}<br/>
                                                <strong>User: </strong>{review.name}<br/>
                                                <strong>Date: </strong>{review.date}
                                            </p>
                                            {
                                                //If user is logged in and userID is same as the review's userId,
                                                //Then do the following html code after the last &&
                                                //The && is just another way for an if statement, so if the first 2 are true,
                                                //Then the code is run
                                                props.user && (props.user.id === review.user_id) && 
                                                    //This creates 2 buttons, delete and edit review
                                                    <div className = "row">
                                                        <a onClick = {() => deleteReview(review._id, index)} className = "btn btn-primary cp;-lg-5 mx-1 mb-1">Delete</a>

                                                        <Link to={`/restaurants/${id}/review`} state= {{ currentReview : review}}
                                                        className = "btn btn-primary col-lg-5 mx-1 mb-1">
                                                            Edit
                                                        </Link>
                                                    </div>
                                            }
                                        </div> 
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className = "col-sm-4">
                            <p>No reviews yet</p>
                        </div>
                    )}
                </div>

            </div>
            ) : (
                <div>
                    <br/>
                    <p>No restaurant selected</p>
                </div>
            )}
        </div>
    );
}


export default Restaurant;