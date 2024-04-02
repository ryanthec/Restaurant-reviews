import http from "../http-common.jsx"

class RestaurantDataService{

    //get all restaurants, default page set to 0
    getAll(page = 0)
    {
        //This is what we add to the base URL in http-common
        return http.get(`?page=${page}`);
    }

    //get a specific restaurant
    get(id)
    {
        return http.get(`/id/${id}`);
    }

    //Query is whatever we are searching, the search term
    //By is what we are searching by eg. name,zipcode or cuisine
    find(query, by="name", page=0)
    {
        //In here, by can be "name", "zipcode" or "cuisine"
        //Then ${query} will be the actual name/zip/cuisine
        return http.get(`?${by}=${query}&page=${page}`);
    }

    //post review
    createReview(data)
    {
        return http.post("/review", data);
    }

    //update review
    updateReview(data)
    {
        return http.put("/review", data);
    }

    //delete review
    deleteReview(id, userId)
    {
        return http.delete(`/review?id=${id}`, {data: {user_id: userId}});
    }

    getCuisines(id)
    {
        return http.get(`/cuisines`);
    }

}

export default new RestaurantDataService();