const express = require('express')
const router = express.Router() 
const Book = require('../models/book')
const Author = require('../models/author')

router.get('/',async(req,res) => {
    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title',new RegExp(req.query.title,'i'))
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate',req.query.publishedAfter)
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate',req.query.publishedBefore)
    }
    try {
        const books = await query.exec()
        res.render('books/index',{
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

router.post('/',async(req,res)=>{
    const book = new Book({
        title: req.body.title,
        publishDate: new Date(req.body.publishDate),
        author: req.body.author,
        pageCount : req.body.pageCount,
        description: req.body.description
    })
    // book.publishDate.toISOString().split('T')[0]
    try {
        const newBook = await book.save()
        // console.log(newBook); 
        res.redirect('books')
    } catch {
    //     const authors = await Author.find({})
    //     const Date = book.publishDate == null ? '' : book.publishDate.toISOString().split('T')[0]
    //  res.render('books/new',{
    //      errorMessage: 'Error Creating book',
    //      book: book,
    //      authors: authors,
    //      Date:  Date
    //  })
    renderNewPage(res,book,true)
    }
}) 

router.get('/new',async (req,res)=>{
   renderNewPage(res)
})

async function renderNewPage(res,book,hasError = false){
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors
        }
        if(hasError) {
            params.Date = book.publishDate == null ? '' : book.publishDate.toISOString().split('T')[0] ,
            params.errorMessage = 'Error Creating book',
            params.book = book
        }
        res.render('books/new',params)
    } catch {
        res.redirect('books')
    }
}

module.exports = router