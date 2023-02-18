// -- FLASH ERROR AND SUCCESS
exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;

  next();
};

exports.anotherMiddleware = (req, res, next) => {
  next();
};


// -- ERROR PAGE 
exports.checkCsrfError = (err, req, res, next) => {
  //* if any error occurs, display this page
  if(err) {
    return res.render('404');
  }
  next();
};

// -- CSRF 
exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

// -- LOGIN REQUIRED 
exports.loginRequired = (req, res, next) =>{
  //* user is not logged in
  if(!req.session.user){
    req.flash('errors', 'You have to login');
   
    //* callback - if you are not logged in, go back to home page
    req.session.save(() => res.redirect('/'));
    return;
  }
  next();
};
