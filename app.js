const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/user');
const alert = require('alert');
const { request } = require('express');

const app = express();
const port = process.env.PORT || 3000;


const dbUri = 'mongodb+srv://butter:butter123@bloodbank.wits5.mongodb.net/bloodbank?retryWrites=true&w=majority';
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result)=> app.listen(port, ()=>{
        console.log(`Example app listening at http://localhost:${port}`);
    }))
    .catch((err) => console.log(err));
//register view engine
app.set('view engine','ejs');

//middleware and static
app.use(express.static('public'));
app.use(morgan('dev'));

app.use(express.urlencoded({extended : true}));

app.get('/',(req, res)=> {
    res.redirect('/login');   
});

app.get('/login',(req, res)=> {
    res.render('login');   
});

app.post('/login',(req , res)=>{
    console.log(req.body);
    let {username,password} = req.body;
    username = username.trim();
    password = password.trim();
    
        User.find({username})
        .then((data)=>{
            if(data[0].password==password){
                console.log('logged in')
                res.redirect('/main');
            }else{
                res.json({
                    status : "failed",
                    message : "Wrong credentials entered",
                     err
                })
            }
        })
        .catch((err)=>{
            res.json({
                status : "failed",
                message : "failed to retrieve data from cloud",
                 err
            })
        })
    

});

app.get('/registration',(req, res)=> {
   res.render('registration');   
});

app.post('/registration',(req , res)=>{
    let {username,password,bloodgroup} = req.body;
    User.find({username})
    .then((data)=>{
        if(data.length){
            res.json({
                status : "failed",
                message : "Username already exists",
                 err
            });
        } else{
        const user = new User(req.body);
        user.save()
            .then((result)=>{
            res.redirect('/login');
        })
            .catch((err)=>{
            res.json({
                status : "failed",
                message : "Failure while commiting inside the database",
                err
            });
        })
        }
    })
    .catch((err)=>{
        res.json({
            status : "failed",
            message : "error while fetching details ",
             err
        });
    })
    
});

app.get('/main',(req , res)=>{
    res.render('main');
});
// app.get('/adduser',(req,res)=>{
//     const user = new User({
//         username : "butter",
//         password : "butter123",
//         bloodgroup: "O+ve"
//     });

//     user.save()
//     .then((result)=>{
//         res.send(result);
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// });

app.use((req,res)=>{
    res.status(404).render('404');
});