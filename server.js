const path =require('path')
const fs=require('fs')
const express=require('express')
const server=express()
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')

server.use(express.json())
server.use(express.urlencoded({extended:false}))
server.use(cookieParser())
server.set('view engine','ejs')
server.set('views',path.join(__dirname,'./views'))

server.get('/',(req,res)=>{
    res.render('login')
})
server.post('/posted',(req,res)=>{
    const reqBody=req.body
    if (reqBody.name==="a") {
        const jwt_token=jwt.sign(
            {user:'username',name:'test'}
            ,'myjwtsecret',
            {expiresIn:'10s'})
        res.cookie('jwt_token',jwt_token,{
            // maxAge:5000,
            httpOnly:true
        })
        res.redirect('/posted')
        return
    }
    res.redirect('/')
})
server.get('/posted',(req,res)=>{
    res.render('posted')
})

server.get('/token',(req,res)=>{
    const cookies=req.cookies
    console.log(cookies)
    res.render('token')
})

server.get('/verify',(req,res)=>{
    const token=req.cookies.jwt_token
    console.log(token)
    try {
        jwt.verify(token,'myjwtsecret')
        res.render('verify')  
    } catch (error) {
        console.log('go back please')
        res.redirect('/')
    }
})

server.get('/clear-token',(req,res)=>{
    res.clearCookie('jwt_token')
    res.redirect('/')
})

server.listen(3000,()=>{
    console.log(`==>>>>>>>>>${server.get('env')}////////////////////////////////////////////////////////////////////////////////////////////////`)
})