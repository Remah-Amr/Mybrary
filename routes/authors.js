const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
// all authors
router.get('/',async (req,res) => {
    let searchOptions = {} // empty object has fields samr of data in db to search by it when throwing in find method
    if(req.query.name !== null && req.query.name !== '' ) // you can remove this condition but to arrange only if you don't enter any search so name is null or you enter search but the input is empty
    {
        searchOptions.name = new RegExp(req.query.name,'i') // i : search no case sensetive
    }
    try {
        // const authors = await Author.find(searchOptions) // equal to {name: new RegExp(...)}
        // res.render('authors/index',{
        //     authors: authors
        // })
        renderAuthorPage(res,searchOptions.name)

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
            // req.flash('error','Failed to create author!')
            // res.redirect('authors/index')
            // above if you use req.flash it works after reload the page by redirect not render
        })
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

router.get('/:id',async (req,res)=>{
    try {
        const author = await Author.findById(req.params.id)
        let books = await Book.find({author: req.params.id})
        res.render('authors/show',{
            author: author,
            books: books
        })
    } catch (err) {
        console.log(err)
        res.redirect('/authors')
    }
})

// note: above in new route if we put below we don't access anyTime because this route will consider new params
router.get('/:id/edit',async (req,res)=>{
    const author = await Author.findById(req.params.id)
    res.render('authors/edit',{
        author: author
    })
})

router.put('/:id',async (req,res)=>{
    let author
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch {
        if(author == null){ // if error in find
            res.redirect('/authors')
        }
        else { // if error in save
            res.render('authors/edit',{
                errorMessage: "Error Updating Author",
                author: author
            })
        }
    }
})

router.delete('/:id',async (req,res)=> {
    let author
    try{
        let books = await Book.find({author: req.params.id})
        if(books.length > 0){
            renderAuthorPage(res,'',true) // you can render to authors page with error message
            // req.flash('error','This author still has books') // or redirect to page of author with flash message
            // res.redirect(`/authors/${req.params.id}`)
        } else {
            author = await Author.findByIdAndDelete(req.params.id)
            res.redirect(`/authors`)
        }
    } catch {
        res.redirect('/authors')
    }
})

async function renderAuthorPage(res,search,hasError = false){
    const authors = await Author.find({name: new RegExp(search,'i')}) // equal to {name: new RegExp(...)}
        res.render('authors/index',{
            authors: authors,
            errorMessage: hasError == false ? null : "This author still has books"
        })
}

module.exports = router