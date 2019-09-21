const express = require('express')
const app = express()
const expressHbs = require('express-handlebars')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override')
const passport = require('passport');
const csrf = require('csurf');
const csrfProtection = csrf();


const indexRoute = require('./routes/index')
const authorsRoute = require('./routes/authors')
const booksRoute = require('./routes/books')
const authRoute = require('./routes/auth')

require('./helpers/hbs')

require('./config/passport')(passport);

app.engine('hbs',expressHbs({layoutsDir: 'views/layouts/',defaultLayout: 'main-layout',extname: 'hbs'})); // since hbs not built in express we have to register hbs engine to express TO USING IT
app.set('view engine','hbs'); 
app.set('views','views'); 

app.use(bodyParser.urlencoded({limit:'10mb',extended:false}))

app.use(session({secret:'my secret',resave:false,saveUninitialized:false}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); 

app.use(csrfProtection); 

app.use(methodOverride('_method'))

app.use(express.static('public'));

app.use((req,res,next) => {
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage = req.flash('success');
  res.locals.user = req.user || null;
  res.locals.csrfToken = req.csrfToken(); //
  next(); 
})

app.use(indexRoute)
app.use('/auth',authRoute)
app.use('/authors',authorsRoute)
app.use('/books',booksRoute)

mongoose.connect(keys.MONGO_URI,{ useNewUrlParser: true , useUnifiedTopology: true  }).then(()=>{ console.log('mongodb connected!');})

const port = process.env.PORT || 4000;

app.listen(port,() => {
    console.log('server started on port successfully!')
})