const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/user');
const Hospital = require('./models/hospital')
const { request } = require('express');
const { render } = require('ejs');

const app = express();
const port = process.env.PORT || 3000;
var loggedinuser;
var blood;

//deprecations
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('debug',true)

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
    let {username,password} = req.body;
    username = username.trim();
    password = password.trim();
    
        User.findOne({username})
        .then((data)=>{
            if(data.password==password){
                User.findOneAndUpdate({username:username},{login : true},{returnOriginal : false},(err,data)=>{
                    if(err){
                        console.log(err);
                        res.json({
                            status : "failed",
                            message : "failed to retrieve data from cloud",
                             err
                        })
                    }
                    console.log(data)
                    res.redirect('/main');
                })
                }})
        .catch((err)=>{
            res.json({
                status : "failed",
                message : "Wrong credentials entered",
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
    User.find({login:true})
    .then((data)=>{
        loggedinuser = data[0].username
        res.render('main',{username : data[0].username})
    })
    .catch((err)=>{
        res.json({
            status : "failed",
            message : "you need to login first"
        })
    })
});

app.get('/logout',(req,res)=>{
    User.findOneAndUpdate({login:true, username : loggedinuser},{login : false},{returnOriginal:false})
                .then((data)=>{
                    console.log(data);
                    res.redirect('/login');
                })
                .catch((err)=>{
                    console.log(err);
                })
                
})

app.get('/bloodbank',(req,res)=>{
    
    User.find({login:true, username : loggedinuser})
    .then((data)=>{
         blood = data[0].bloodgroup
         Hospital.find()
            .then((data)=>{
                res.render('bloodbank',{hospitals : data, blood : blood});
            })
            .catch((err)=>{
                res.json({
                    status : "failed",
                    message : "failed to retrieve hospital data"
                })
            })
            })
    .catch((err)=>{
        res.json({
            status : "failed",
            message : "failure in finding the bloodgroup"
        })
    })
    
})

app.get('/donate',(req,res)=>{
    User.find({login:true, username : loggedinuser})
    .then((data)=>{
         blood = data[0].bloodgroup
         Hospital.find()
            .then((data)=>{
                res.render('donate',{hospitals : data, blood : blood});
            })
            .catch((err)=>{
                res.json({
                    status : "failed",
                    message : "failed to retrieve hospital data"
                })
            })
            })
    .catch((err)=>{
        res.json({
            status : "failed",
            message : "failure in finding the bloodgroup"
        })
    })
})
app.get('/donate/:id',(req,res)=>{
    
    const id = req.params.id;
    Hospital.findById(id)
        .then((result)=>{
            res.render('donation',{hospital : result, blood : blood})
        })
        .catch((err)=>{
            res.json({
                status : "failure",
                message : "error in retrieving hospital details"
            })
        })
})

app.use((req,res)=>{
    res.status(404).render('404');
});