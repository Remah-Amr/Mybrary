const express = require('express')
const app = express()
const expressHbs = require('express-handlebars')
const mongoose = require('mongoose')

const indexRoute = require('./routes/index')

app.engine('hbs',expressHbs({layoutsDir: 'views/layouts/',defaultLayout: 'main-layout',extname: 'hbs'})); // since hbs not built in express we have to register hbs engine to express TO USING IT
app.set('view engine','hbs'); 
app.set('views','views'); 

app.use(indexRoute)

mongoose.connect('mongodb://remah:remah654312@ds019916.mlab.com:19916/mybrary',{ useNewUrlParser: true , useUnifiedTopology: true  }).then(()=>{ console.log('mongodb connected!');})

app.listen(3000,() => {
    console.log('server started on port successfully!')
})