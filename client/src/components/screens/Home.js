import React,{ useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'


const Home = () => {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    useEffect(() => {
        fetch('/allpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result);
            setData(result.posts)
        })
    },[])
    const likePost = (id) => {
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res => res.json())
        .then(result =>{
            const newData = data.map(item =>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
            console.log(result);
            // window.location.reload()
            fetch('/allpost',{
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                }
            }).then(res => res.json())
            .then(result => {
                console.log(result);
                setData(result.posts)
            })
        }).catch(err => {
            console.log(err);
        })
    }
    const unlikePost = (id) => {
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res => res.json())
        .then(result =>{
            const newData = data.map(item =>{
                if(item._id ==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
            fetch('/allpost',{
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                }
            }).then(res => res.json())
            .then(result => {
                console.log(result);
                setData(result.posts)
            })
            // window.location.reload()
        }).catch(err => {
            console.log(err);
        })
    }
    const makeComment = (text, postId) => {
        fetch("/comment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
        .then(result =>{
            console.log(result);
            const newData = data.map(item =>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err => {
            console.log(err);
        })
    }
    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }
    const deleteComment = (commentid) => {
        fetch(`/deletecomment/${commentid}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
            
        }).catch(err=>{
            console.log(err);
        })
    }
    return(
        <div className="home">
            {
                data.map(item =>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"6px"}}>
                                <Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id:"/profile"} style={{cursor:"pointer"}}>
                                    { item.postedBy.name?item.postedBy.name:""}    
                                </Link>
                                { item.postedBy._id == state._id && 
                                    <i className="material-icons" style={{cursor:"pointer", float:"right", color:"red"}}
                                        onClick={() =>{deletePost(item._id)}}
                                    >delete</i>}
                            </h5>
                            <div className="card-image">
                                <img src={item.photo}/>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color:"red"}}>favorite</i>
                                {item.likes.includes(state._id)
                                ?
                                <i className="material-icons" style={{cursor:"pointer"}}
                                    onClick={() =>unlikePost(item._id)}
                                >thumb_down</i>
                                :
                                <i className="material-icons" style={{cursor:"pointer"}}
                                    onClick={() =>{likePost(item._id)}}
                                    >thumb_up</i>
                                }
                                <h6>{item.likes? item.likes.length:''} Likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <h6 key={record._id}>
                                                <span style={{fontWeight:"500"}}> {record.postedBy.name?record.postedBy.name+" ":""} </span> {record.text}
                                                {
                                                    record.postedBy._id == state._id && 
                                                    <i className="material-icons" style={{cursor:"pointer", float:"right", color:"red"}}
                                                        onClick={() =>{deleteComment(record._id)}}
                                                    >delete</i>
                                                }
                                            </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                        e.preventDefault()
                                        makeComment(e.target[0].value,item._id)
                                }}>
                                    <input type="text"placeholder="add a comment"/>
                                </form>
                            </div>
                        </div>
                    )
                })
            }        
      </div>
    )
}

export default Home;