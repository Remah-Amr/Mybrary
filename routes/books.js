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

router.get('/:id',async (req,res)=>{
    try {
        const book = await Book.findById(req.params.id).populate('author')
        res.render('books/show',{
            book: book,
            Date:book.publishDate.toISOString().split('T')[0] // toISOString to convert from object to string, split T array like this [ '2019-01-01', '00:00:00.000Z' ] ,[0] first part of array
            // or instead of toISOString() => toDateString()
        })
    } catch {
        res.redirect('/books')
    }
})

router.get('/:id/edit',async (req,res)=>{
    const book = await Book.findById(req.params.id).populate('author')
    const authors = await Author.find({})
    res.render('books/edit',{
        book: book,
        Date: book.publishDate.toISOString().split('T')[0], // first part of array
        authors: authors
    })
})
router.put('/:id',async (req,res)=>{
    let book
    try {
    book = await Book.findById(req.params.id)
    book.title = req.body.title
    book.publishDate = req.body.publishDate
    book.description = req.body.description
    book.pageCount = req.body.pageCount
    book.author = req.body.author
    if(req.body.cover != null && req.body.cover != ''){ // if user not change old one we keep it , if change will override
        saveCover(book, req.body.cover)
    }
    await book.save() 
    res.redirect(`/books/${book.id}`)
    } catch (err){
        console.log(err)
        req.flash('error','Error Updating Book')
        res.redirect(`/books/${book.id}`)
    }
})

router.delete('/:id',async (req,res)=> {
    
    try {
        await Book.findByIdAndDelete(req.params.id)
        res.redirect('/books')
    } catch{
        req.flash('error','Error Deleting Book')
        res.redirect('/books')
    }
})

module.exports = router
