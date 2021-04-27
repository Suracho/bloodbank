const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/user');

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
});

app.get('/registration',(req, res)=> {
   
    res.render('registration');   
});

app.post('/registration',(req , res)=>{
    const user = new User(req.body);

    user.save()
    .then((result)=>{
        res.redirect('/login');
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get('/adduser',(req,res)=>{
    const user = new User({
        username : "butter",
        password : "butter123",
        bloodgroup: "O+ve"
    });

    user.save()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.use((req,res)=>{
    res.status(404).render('404');
});