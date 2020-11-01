import React,{ useEffect, createContext, useReducer,useContext } from 'react';
import NavBar from './components/Navbar';
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import SubscribesUserPosts from './components/screens/SubscribesUserPosts'
import UserProfile from './components/screens/UserProfile'
import CreatePost from './components/screens/CreatePost'
import { initialState, reducer } from './reducer/userReducer';
import Reset from './components/screens/Reset';
import Newpassword from './components/screens/Newpassword';

export const UserContext = createContext()
const Routing =() => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
    }
    else{
      if (!history.location.pathname.startsWith('/reset')) {
        history.push('/signin')
      }
    }
  },[])
  return(
    <Switch>
      <Route exact path='/'>
        <Home/>
      </Route>
      <Route path='/signin'>
        <Signin/>
      </Route>
      <Route path='/signup'>
        <Signup/>
      </Route>
      <Route exact path='/profile'>
        <Profile/>
      </Route>
      <Route path='/profile/:userid'>
        <UserProfile/>
      </Route>
      <Route path='/createpost'>
        <CreatePost/>
      </Route>
      <Route path='/myfollowingpost'>
        <SubscribesUserPosts/>
      </Route>
      <Route exact path='/reset'>
        <Reset/>
      </Route>
      <Route path='/reset/:token'>
        <Newpassword/>
      </Route>
    </Switch>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <NavBar/>
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
