const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required:true
  },
  name: {
    type: String,
    required: true
  },
  resetToken:String, // 3
  resetTokenExpiration:Date
});

module.exports = mongoose.model('user',userSchema);