import React, {useState} from "react"
import RestaurantDataService from "../services/Restaurant.jsx"
import {Link, useParams, useLocation} from "react-router-dom"


function AddReview(props)
{
    const {id} = useParams();
    const location = useLocation();
    console.log("this is location" + location);
    console.log("location state: " + location.state);

    let initialReviewState = "";

    //Default means editing is false
    //Editing false means we are creating a new review
    let editing = false;

    //In restaurants.jsx, when edit review button is clicked, the state is passed
    //So we check to see if the state is passed, if it is, it means we are editing an existing review
    if(location.state && location.state.currentReview)
    {
        editing = true;
        initialReviewState = location.state.currentReview.text;
    }

    const [review, setReview] = useState(initialReviewState);
    const [submitted, setSubmitted] = useState(false);

    function handleInputChange(event)
    {
        setReview(event.target.value);
    }

    function saveReview()
    {
        //Saves data of the review
        var data = {
            text: review,
            name: props.user.name,
            user_id: props.user.id,
            restaurant_id: id
        };

        console.log("is it editing?" + editing);

        if(editing)
        {
            //If editing, there is already a current review id, so we add that in first
            data.review_id = location.state.currentReview._id;
            RestaurantDataService.updateReview(data)
                .then(response => {
                    setSubmitted(true);
                    console.log(response.data);
                })
                .catch(e => {
                    console.error(e);
                });
        }
        else
        {
            RestaurantDataService.createReview(data)
                .then(response => {
                    setSubmitted(true);
                    console.log(response.data);
                })
                .catch(e => {
                    console.error(e);
                });
        }
    }


    return(
        <div>
            {props.user ? (
                <div className="submit-form">
                    {submitted ? (
                        <div>
                            <h4>You submitted successfully!</h4>
                            <Link to={"/restaurants/" + id} className="btn btn-success">
                            Back to Restaurant
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <div className="form-group">
                            <label htmlFor="description">{ editing ? "Edit" : "Create" } Review</label>
                            <input
                                type="text"
                                className="form-control"
                                id="text"
                                required
                                value={review}
                                onChange={handleInputChange}
                                name="text"
                            />
                            </div>
                            <button onClick={saveReview} className="btn btn-success">
                            Submit
                            </button>
                        </div>
                        )
                    }
                </div>

            ) : (
            <div>
                Please log in.
            </div>
            )}
        </div>
    );
}


export default AddReview;