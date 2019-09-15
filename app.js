const express = require('express')
const app = express()
const expressHbs = require('express-handlebars')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');


const indexRoute = require('./routes/index')
const authorsRoute = require('./routes/authors')
const booksRoute = require('./routes/books')

require('./helpers/hbs')

app.engine('hbs',expressHbs({layoutsDir: 'views/layouts/',defaultLayout: 'main-layout',extname: 'hbs'})); // since hbs not built in express we have to register hbs engine to express TO USING IT
app.set('view engine','hbs'); 
app.set('views','views'); 

app.use(bodyParser.urlencoded({limit:'10mb',extended:false}))

app.use(session({secret:'my secret',resave:false,saveUninitialized:false}));

app.use(flash()); 

app.use((req,res,next) => {
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage = req.flash('success');
  next(); 
})

app.use(indexRoute)
app.use('/authors',authorsRoute)
app.use('/books',booksRoute)

mongoose.connect(keys.MONGO_URI,{ useNewUrlParser: true , useUnifiedTopology: true  }).then(()=>{ console.log('mongodb connected!');})

const port = process.env.PORT || 4000;

app.listen(port,() => {
    console.log('server started on port successfully!')
})