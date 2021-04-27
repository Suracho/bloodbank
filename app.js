const express = require('express')
const morgan = require('morgan')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine','ejs')

app.listen(port)

app.use(express.static('public'))
app.use(morgan('dev'))

app.get('/'),(req, res)=> {
    
}