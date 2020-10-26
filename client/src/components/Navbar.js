import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
const NavBar = () => {
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const renderList = () => {
        if(state){
            return[
                <li key={"1"}><Link to="/profile">Profile</Link></li>,
                <li key={"2"}><Link to="/createpost">Create Post</Link></li>,
                <li key={"6"}><Link to="/myfollowingpost">My Following Post</Link></li>,
                <li key={"3"}>
                    <button className="btn #e53935 red darken-1"
                    onClick={() => {
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        history.push('/signin')
                    }}
                    >
                    
                    Logout
                    </button>
                </li>
            ]
        }
        else{
            return[
                <li key={"4"}><Link to="/signin">Sign In</Link></li>,
                <li key={"5"}><Link to="/signup">SingUp</Link></li>
            ]
        }
    }
    return (
        <nav>
            <div className="nav-wrapper white">
            <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
            </div>
        </nav>
    )
}


export default NavBar;