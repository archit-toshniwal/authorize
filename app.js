//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

const app = new express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.set('view engine','ejs');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);


mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    name:String,
    password:String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password']});

const users = mongoose.model('user',userSchema);

app.get('/',function(req,res)
{
    res.render('home',{});
});

app.get('/register',function(req,res)
{
    res.render('register',{});
});


app.post('/register',function(req,res)
{
    const _users = new users(
        {
            name:req.body.username,
            password:req.body.password
        }
    );
    _users.save(function(err)
    {
        if(err){
            console.log('error')
        }else{
            res.render('secrets',{});
        }
    })
});


app.get('/login',function(req,res)
{
    res.render('login',{});
});

app.post('/login',function(req,res)
{
        users.findOne({name:req.body.username},function(err,doc)
        {
            if(doc){
                    if(doc.password === req.body.password){
                        res.render('secrets',{});
                    }else{
                        res.render('login',{});
                    }
            }else{
                res.render('register',{});
            }
        });
});

app.get('/submit',function(req,res)
{
    res.render('submit',{});
});


const port = process.env.PORT | 3000;

app.listen(port,function()
{
    console.log(`listening at ${port}`);
})