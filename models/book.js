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
      author:{
          type: Schema.Types.ObjectId,
          required:true,
          ref:'author'
      },coverImage: {
        type: Buffer,
        required: true
      },
      coverImageType: {
        type: String,
        required: true
      }
});

// when i call coverImagePath will fire get function
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}` //The <data> tag links the given content with a machine-readable translation.
    }
  })

module.exports = mongoose.model('book',bookSchema); // author not Author