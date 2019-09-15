const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    publishDate:{
        type: Date,
        required:true
    },
    pageCount:{
        type: Number,
        required: true
    },
    createdAt:{ // try time stamps
        type: Date,
        required: true,
        default: Date.now
    },
    // coverImageName: {
    //     type: String,
    //     required: true // remove it
    //   },
      author:{
          type: Schema.Types.ObjectId,
          required:true,
          ref:'author'
      }
});

module.exports = mongoose.model('book',bookSchema); // author not Author