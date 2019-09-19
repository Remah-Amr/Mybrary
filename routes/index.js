const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const {ensureAuthenticated,ensureGuest} = require('../config/isAuth')

router.get('/',ensureAuthenticated,async (req,res) => {
    try{
        const books = await Book.find().sort({createdAt:-1})
        res.render('index',{
            books: books
        })
    } catch{
        res.send('Error occured')
    }
})

module.exports = router