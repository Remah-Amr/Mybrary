if(process.env.NODE_ENV === 'production'){ 
    module.exports = require('./keys_prod');
  } else {
    module.exports = require('./keys_dev');
  }

// process.env => global variables by hosting platform when i deploy my app 
// hosting set NODE_DEV to 'production' when deploy it