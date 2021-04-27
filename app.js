const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(morgan('dev'));
app.set('view engine','ejs');

app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`);
});



app.get('/',(req, res)=> {
    res.render('index');   
});
app.get('/login',(req, res)=> {
 res.render('login');   
});
app.get('/registration',(req, res)=> {
    res.render('registration');   
});

app.use((req,res)=>{
    res.status(404).render('404');
});