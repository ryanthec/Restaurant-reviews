import React,{useState, useEffect} from "react"
import RestaurantDataService from "../services/Restaurant.jsx"
import {Link} from 'react-router-dom'


function RestaurantsList(props)
{
    const [restaurants, setRestaurants] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState("");
    const [searchCuisine, setSearchCuisine] = useState("");
    const [cuisines, setCuisines] = useState(["All Cuisines"]);

    useEffect(() => {
        retrieveRestaurants();
        retrieveCuisines();
    }, []);

    function onChangeSearchName(e)
    {
        const searchName = e.target.value;
        setSearchName(searchName);
    }

    function onChangeSearchZip(e)
    {
        const searchZip = e.target.value;
        setSearchZip(searchZip);
    }

    function onChangeSearchCuisine(e)
    {
        const searchCuisine = e.target.value;
        setSearchCuisine(searchCuisine);
    }

    function retrieveRestaurants(){
        RestaurantDataService.getAll()
            .then(response => {
                console.log(response.data);
                setRestaurants(response.data.restaurants);
            })
            .catch(error => {
                console.log(error);
            })
    }

    function retrieveCuisines(){
        RestaurantDataService.getCuisines()
            .then(response => {
                console.log(response.data);
                setCuisines(["All Cuisines"].concat(response.data));
            })
            .catch(error => {
                console.log(error);
            })
    }

    //Refresh List function if there are no filters
    function refreshList()
    {
        retrieveRestaurants();
    }

    //The base find function
    function find(query, by)
    {
        //Calls the find function in the rest data service
        RestaurantDataService.find(query, by)
            .then(response => {
                console.log(response.data);
                setRestaurants(response.data.restaurants);
            })
            .catch(error => {
                console.log(error);
            })
    }

    //These 3 functions call the find function above
    //Each one has a different type of find
    function findByName()
    {
        find(searchName, "name");
    }

    function findByZip()
    {
        find(searchZip, "zipcode");
    }

    function findByCuisine()
    {
        if(searchCuisine == "All Cuisines")
        {
            refreshList();
        }
        else
        {
            find(searchCuisine, "cuisine");
        }
    }


    return (
        <div>
          <div className="row pb-1">

            <div className="input-group col-lg-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={searchName}
                onChange={onChangeSearchName}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={findByName}
                >Search</button>
              </div>
            </div>

            <div className="input-group col-lg-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by zip"
                value={searchZip}
                onChange={onChangeSearchZip}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={findByZip}
                >
                  Search
                </button>
              </div>
            </div>
            
            <div className="input-group col-lg-4">
    
              <select onChange={onChangeSearchCuisine}>
                 {cuisines.map((cuisine,index) => {
                   return (
                     <option 
                        key = {index} value={cuisine}> {cuisine.substring(0, 20)} 
                     </option>
                   )
                 })}
              </select>
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={findByCuisine}
                >
                  Search
                </button>
              </div>
            </div>

          </div>


          <div className="row">
            {restaurants.map((restaurant) => {
              const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
              return (
                <div className="col-lg-4 pb-1">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{restaurant.name}</h5>
                      <p className="card-text">
                        <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
                        <strong>Address: </strong>{address}
                      </p>
                      <div className="row">
                      <Link to={"/restaurants/"+restaurant._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                        View Reviews
                      </Link>
                      <a target="_blank" href={"https://www.google.com/maps/place/" + address} className="btn btn-primary col-lg-5 mx-1 mb-1">View Map</a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
    
    
          </div>
        </div>
      );
}


export default RestaurantsList;