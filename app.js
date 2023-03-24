const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')

// init app and middleware
const app = express()
app.use(express.json())

//db connection
let db 

connectToDb((err) =>{
    if (!err) {
        app.listen(3000, () => {
            console.log('app listening on port 3000')
        })
        db = getDb()
    }
})

//routes
app.get('/Books', (req, res) => {
  // current page
  const page = req.query.p || 0
  const booksPerPage = 3

    let Books = []

    db.collection('Books')
      .find() //cursor toArray(selects all) forEach(one by one)....docs are fetched in batches ie 101 
      .sort({ author: 1 })
      .skip(page * booksPerPage)
      .limit(booksPerPage)
      .forEach(Book => Books.push(Book))
      .then(() => {
        res.status(200).json(Books) //status 200 means okay
      })
      .catch(() => {
        res.status(500).json({error: 'Could not fetch the documents'}) //500 is a server error
      })
})

app.get('/Books/:id', (req, res) =>{
    
  if (ObjectId.isValid(req.params.id)) {
     db.collection('Books')
       .findOne({_id: ObjectId(req.params.id)})
       .then(doc => {
        res.status(200).json(doc)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not fetch document'})
      })
  } else {
    res.status(500).json({error: 'Not a valid doc Id'})
  }  
      
})

app.post('/Books', (req, res) => {
 const Book = req.body

 db.collection('Books')
   .insertOne(Book)
   .then(result => {
    res.status(201).json(result)
   })
   .catch(err => {
    res.status(500).json({err: 'Could not create a new document'})
   })
})

app.delete('/Books/:id', (req, res) => {

  if (ObjectId.isValid(req.params.id)) {
    db.collection('Books')
      .deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
       res.status(200).json(result)
     })
     .catch(err => {
       res.status(500).json({error: 'Could not delete the document'})
     })
 } else {
   res.status(500).json({error: 'Not a valid doc Id'})
 }  

})

app.patch('/Books/:id', (req, res) => {
  const updates = req.body

  if (ObjectId.isValid(req.params.id)) {
    db.collection('Books')
      .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})
      .then(result => {
       res.status(200).json(result)
     })
     .catch(err => {
       res.status(500).json({error: 'Could not update the document'})
     })
 } else {
   res.status(500).json({error: 'Not a valid doc Id'})
 }  
})