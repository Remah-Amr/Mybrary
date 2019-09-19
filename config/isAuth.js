module.exports = {
    ensureAuthenticated: function(req,res,next)
    {
      if(req.isAuthenticated()){
        return next();
      }
      req.flash('error',"Not Authenticated , Please sign in :)");
      res.redirect('/auth/login');
    },
    ensureGuest: function(req, res, next){
      if(req.isAuthenticated()){
        res.redirect('/');
      } else {
        return next();
      }
    }
  }
  