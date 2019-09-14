const express = require('express')
const app = express()
const expressHbs = require('express-handlebars')
const mongoose = require('mongoose')
const keys = require('./config/keys')

const indexRoute = require('./routes/index')

app.engine('hbs',expressHbs({layoutsDir: 'views/layouts/',defaultLayout: 'main-layout',extname: 'hbs'})); // since hbs not built in express we have to register hbs engine to express TO USING IT
app.set('view engine','hbs'); 
app.set('views','views'); 

app.use(indexRoute)

mongoose.connect(keys.MONGO_URI,{ useNewUrlParser: true , useUnifiedTopology: true  }).then(()=>{ console.log('mongodb connected!');})

const port = process.env.PORT || 4000;

app.listen(port,() => {
    console.log('server started on port successfully!')
})