const express = require('express')
const router = express.Router() 
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif','image/jpg']
// https://docs.mongodb.com/manual/reference/operator/meta/max/#examples
// https://docs.mongodb.com/manual/reference/operator/query-modifier/
// below i will append every one to query above then execute it by exec() , i write Model.find().queryModifier('field',value)
// router.get('/',async(req,res) => {
//     let query = Book.find()
//     if(req.query.title != null && req.query.title != ''){
//         query = query.regex('title',new RegExp(req.query.title,'i'))
//     }
//     if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
//         query = query.gte('publishDate',req.query.publishedAfter)
//     }
//     if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
//         query = query.lte('publishDate',req.query.publishedBefore)
//     }
//     try {
//         const books = await query.exec()
//         res.render('books/index',{
//             books: books,
//             searchOptions: req.query
//         })
//     } catch {
//         res.redirect('/')
//     }
// })


router.get('/',async(req,res) => {
    // must fill the options 
    let lesserDate
    let greaterDate
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        lesserDate = req.query.publishedAfter
    } else{
        lesserDate = new Date(-8640000000000000)
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        greaterDate = req.query.publishedBefore
    } else{
        greaterDate = new Date(8640000000000000)
    }
    try {
        const books = await Book.find({title: new RegExp(req.query.title,'i'),publishDate:{$lt:greaterDate,$gt:lesserDate}})
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
    saveCover(book, req.body.cover) 
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

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      book.coverImage = new Buffer.from(cover.data, 'base64') // data and also type properties by filepond when we converting all files to filePond
      book.coverImageType = cover.type
    }
  }

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
