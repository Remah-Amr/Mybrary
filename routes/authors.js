const express = require('express')
const router = express.Router()
const Author = require('../models/author')

// all authors
router.get('/',async (req,res) => {
    let searchOptions = {} // empty object has fields samr of data in db to search by it when throwing in find method
    if(req.query.name !== null && req.query.name !== '' ) // you can remove this condition but to arrange only if you don't enter any search so name is null or you enter search but the input is empty
    {
        searchOptions.name = new RegExp(req.query.name,'i') // i : search no case sensetive
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index',{
            authors: authors
        })
    } catch {
        res.redirect('/')
    }
})
 

// get new author
router.get('/new',(req,res)=>{
    res.render('authors/new')
})

// post new author
router.post('/',async (req,res)=>{
    const author = new Author({
        name: req.body.name
    })

    try{
        const newAuthor = await author.save()
        res.redirect('authors')
    }catch{
        res.render('authors/new',{
            author:author,
            errorMessage: 'Failed to create author!'
        })
        // req.flash('error','Failed to create author!')
        // res.redirect('authors/index')
        // above if you use req.flash it works after reload the page by redirect not render
    }
    // with callback function
    // author.save((err,author) => {
    //     if(err){
            // res.render('authors/new',{
            //     author: author
            // })
    //     }
    //     else{
    //         res.render('authors/index')
    //     }
    // })
})

module.exports = router