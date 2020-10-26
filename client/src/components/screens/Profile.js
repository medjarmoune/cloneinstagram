import React,{ useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'


const Profile = () => {
    const [mypics, SetPicts] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(()=>{
       fetch('/mypost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }) .then(res => res.json())
       .then(result =>{
           SetPicts(result.mypost)
       })
    },[])
    useEffect(() => {
        if(image){
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "insta-clone")
            data.append("cloud_name", "yes")
            fetch("https://api.cloudinary.com/v1_1/jarmoune/image/upload", {
                method:"post",
                body:data
            })
            .then(res => res.json())
            .then(data=>{
                setUrl(data.url)
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    console.log(result);
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                })
            })
            .catch(err => {
                console.log(err);
            })
        }
        
    }, [image])
    const updateProfile = (file) =>{
        setImage(file)
    }
    return(
        <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                    margin:"10px 0px", 
                    borderBottom:"1px solid grey"
                    }}>
                <div style={{
                    display:"flex", 
                    justifyContent:"space-around"
                    }}>
                        <div>
                            <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
                                        src={state?state.pic:"Loding"}
                                    />
                            <div className="file-field input-field" style={{cursor:"pointer", color:"black",margin:0}}>
                                    <i className="material-icons" 
                                     >
                                        camera_alt
                                        <input type="file" onChange={(e) => updateProfile(e.target.files[0])}/>
                                    </i>
                                    {/* <div className="file-path-wrapper">
                                        <input className="file-path validate" type="text"/>
                                    </div> */}
                            </div>
                        </div>
                        <div>
                            <h4>{state? state.name:""}</h4>
                            <h5>{state? state.email:""}</h5>
                            <div style={{display:"flex", justifyContent:"space-between", width:"108%"}} >
                                <h6>{mypics.length} posts</h6>
                                <h6>{state? state.followers.length:"0"} followers</h6>
                                <h6>{state? state.following.length:"0"} following</h6>
                            </div>
                        </div>
                </div>
            </div>
            
            <div className="gallery">
                {
                    mypics.map(item => {
                        return(
                            <img className="item" src={item.photo} alt={item.title} key={item._id}/>
                        )
                    })
                }
            
            </div>
        </div>
    )
}

export default Profile;