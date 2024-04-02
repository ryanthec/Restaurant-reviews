import React, {useState} from "react"
import {useNavigate} from "react-router-dom"

function Login(props)
{
    const navigate = useNavigate();
    //Initial user state
    const initialUserState = 
    {
        name: "",
        id: ""
    };

    const[user,setUser] = useState(initialUserState);

    //handleInput changes
    function handleInputChange(event)
    {
        const {name, value} = event.target;
        //Update userstate with new name/id
        setUser({...user, [name]:value});
    }

    function login(){
        //Login the user
        //Props.login is different, the login function is from the App.jsx file
        props.login(user);
        //Updates the URL through another route(back to the homepage)
        navigate('/restaurants');
    }


    return(
        <div className="submit-form">
            <div>
                <div className="form-group">
                    <label htmlFor="user">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        required
                        value={user.name}
                        onChange={handleInputChange}
                        name="name"/>
                </div>

                <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="id"
                        required
                        value={user.id}
                        onChange={handleInputChange}
                        name="id"/>
                </div>

                <button onClick={login} className="btn btn-success">
                    Login
                </button>
            </div>
        </div>
        );
}


export default Login;