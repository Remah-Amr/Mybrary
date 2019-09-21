const express = require('express')
const router = express.Router()
const {check} = require('express-validator');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // not related to csrt token
const passport = require('passport');
const User = require('../models/user')
const {ensureAuthenticated,ensureGuest} = require('../config/isAuth')
const nodemailer = require('nodemailer'); // 1
const transproter = nodemailer.createTransport({ // 2
    service: 'gmail',
    auth: {
           user: 'remah3335@gmail.com', // must go to الامان then وصول التطبيقات الاقل أمانا https://myaccount.google.com/lesssecureapps
           pass: 'remah654312'          // https://accounts.google.com/b/0/DisplayUnlockCaptcha 
       }                                // from each deploy or push or edit you must click link and press continue above
 });   




router.get('/login',ensureGuest,(req,res) => {
    res.render('auth/login')
})

router.get('/signup',ensureGuest,(req,res)=>{
    res.render('auth/signup')
})

router.post('/signup',[
    check('email').isEmail().withMessage('PLEASE : You Have to Enter Validate Email!'),
    check('email').custom(value => { // call async validation because you have to wait until search in database
        return User.findOne({email: value}).then(user => {
          if (user) {
            return Promise.reject('PLEASE: E-mail already in use');
          }
        });
      }).normalizeEmail(), // to lowerCase every char after enter it by user , you can put it anywere , call sanitizers 
    check('password','You have to enter in password only numbers and text and at least 5 characters').isLength({ min: 5 }).isAlphanumeric().trim()// to remove white space at beginig or end, alphanumeric TO BE LETTERS AND NUMBERS ONLY
    ],
     ensureGuest,
     async (req,res)=>{
     const errors = validationResult(req);
    if (!errors.isEmpty()) {   
     req.flash('error',errors.array()[0].msg)
     return res.redirect('/auth/signup')
    }                                                                            
    const user = await User.findOne({email: req.body.email})
    if(user){
        req.flash('error',"Email already in use")
        res.redirect('/auth/signup')
    } else {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    console.log('new User');

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
        if(err) throw err;
        newUser.password = hash;
        new User(newUser).save().then(result =>{
            res.redirect('/auth/login');
            transproter.sendMail({ // 3
                to: req.body.email,
                from: 'remah3335@gmail.com',
                subject:'Signup Succeeded',
                html:`<h1>You ${req.body.email} Successfulley Signed Up</h1>`
            })
            .then(result => {
                console.log('send email');
            })
        }).catch(err=>{
            console.log(err);
        })
        });
        })
    
    
    } 
})

router.post('/login',check('email').normalizeEmail(),check('password').trim(),ensureGuest,(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/auth/login',
        failureFlash:true
      })(req,res,next);
})

router.get('/logout',ensureAuthenticated,(req,res)=>{
  req.logout();// Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login session (if any).
  req.flash('success','You logged out successfully');
  res.redirect('/auth/login');
})


router.get('/reset',(req,res,next) => { // 1
    res.render('auth/reset') 
})

router.post('/reset',(req,res,next)=>{
    crypto.randomBytes(32,(err,buffer) => { // to produce buffer as unique secure random value to access link to reset password
        if(err)
        {
            console.log(err);
            return res.redirect('/auth/reset');
        }
        const token = buffer.toString('hex'); // hex type of encryption
        User.findOne({email: req.body.email}).then(user => {
            if(!user)
            {
                req.flash('error','This Email Not Found.');
                res.redirect('/auth/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000; // valid one hour only
            user.save();
            res.redirect('/');
            transproter.sendMail({
                to: req.body.email, // whitch enterd in form
                from: 'remah3335@gmail.com',
                subject:'Reset Password',
                html: ` 
                <p>You requested a password reset</p>
                <p>Click this <a href="https://remah-mybrary.herokuapp.com/auth/reset/${token}">link</a> to set a new password.</p>
              ` // use packtic to write more than line
            })
            .then(result => {
                console.log('send email');
                
            })

        })
    })
});

router.get('/reset/:token',(req,res)=>{
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt:Date.now()}}).then(user => { // must date in db greater than from date now
        if(!user)
        {
            req.flash('error','Sorry , you must access link before one hour!');
            res.redirect('/auth/login');
        }
        else{
            res.render('auth/new-password',{
                userId: user._id.toString(),
                pageTitle: 'NewPassword'
            })
        }
    }).catch(err => console.log(err))
}); 

router.post('/new-password',(req,res,next)=>{
    const id = req.body.userId; // from hidden input
    const password = req.body.password;
    bcrypt.hash(password,12).then(hashedpassword =>{
        User.findById(id).then(user => {
            user.password = hashedpassword; // old value will be override
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            user.save();
            res.redirect('/auth/login');
        })
    }).catch(err => {
        console.log(err);
    })
});


module.exports = router