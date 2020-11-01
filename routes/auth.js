const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transport = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:""
    }
}))


router.post('/signup', (req, res) => {

    const {name, email, password, pic} = req.body;
    if(!email || !password || !name){
        res.status(402).json({error:"please add all fields"});
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error:"user already exist with tha email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword => {
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic
            })
    
            user.save()
            .then((user) => {
                transporter.sendMail({
                    to:user.email,
                    from:"mjarmoune1@gmail.com",
                    subject:"signup success",
                    html:"<h1>Welcome to instagram</h1>"
                })
                res.json({message:'saved succesfully'})
            })
            .catch(err => {
                console.log(err);
            })
        })
    })
    .catch(err => {
        console.log(err);
    })
})

router.post('/signin', (req,res) => {
    const {email,password,name} = req.body;
    if(!email || !password){
        return res.status(422).json({error:'please add the email or password'})
    }
    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser){
            res.status(422).json({error:'Invalid Email or Password'});
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch){
                // res.json({message:'successfully signed in'})
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET);
                const { _id, name, email, followers, following, pic} = savedUser
                res.json({token, user:{_id, name, email, followers, following, pic}})
            }
            else{
                res.status(422).json({error:'Invalid Email or Password'});
            }
        })
        .catch(err => {
            console.log(err);
        })
    })
})

router.post('reset-password',(req, res) =>{
    crypto.randomBytes(32, (err, buffer) =>{
        if (err) {
            console.log(err);
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if (!user) {
                return res.status(422).json({error:"USer don't exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"no-replay@instagram.com",
                    subject:"password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="http://localhost:3000/reset/${token}">Link</a> to reset password </h5>
                    `
                })
                res.json({message:"check you email"})
            })
        })
    })
})

router.post('/new-password', (req, res) =>{
    const newpassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken, expireToken:{$gt:Date.now()}})
    .then(user=>{
        if (!user) {
            return res.status(422).json({error:"try again session expired"})
        }
        bcrypt.hash(newpassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((saveduser)=>{
                res.json({message:"password updated success"})
            })
        })
    }).catch(err=>{
        console.log(err);
    })
})

module.exports = router;