const session = require('express-session');
const { async } = require('regenerator-runtime');
const Login = require('../models/LoginModel');

exports.index = (req, res) =>{
    if(req.session.user) return res.render('login-done');
    return res.render('login');
    //console.log(req.session.user);

};

// -- REGISTER
exports.register = async function(req, res) {
    try {
      const login = new Login(req.body);
      await login.register();
  
      if(login.errors.length > 0) {
        req.flash('errors', login.errors);
       
        //* save the session and return
        req.session.save(function() {
          return res.redirect('back');
        });
        return;
      }
  
      req.flash('success', 'your user has been created successfully');
      req.session.save(function() {
        return res.redirect('back');
      });
    } catch(e) {
      console.log(e);
      return res.render('404');
    }
  };

  // -- LOGIN
  exports.login = async function(req, res) {
    try {
      const login = new Login(req.body);
      await login.login();
  
      if(login.errors.length > 0) {
        //* if there are errors, display the error messages
        req.flash('errors', login.errors);
        
        //* save the session and return
        req.session.save(function() {
          return res.redirect('back');
        });
        return;
      }
  
      req.flash('success', 'successful access.');
      req.session.user = login.user;  //* user inside session
      req.session.save(function() {
        return res.redirect('back');
      });
    } catch(e) {
      console.log(e);
      return res.render('404');
    }
  };

// -- LOGOUT
exports.logout = function(req, res){
    req.session.destroy();
    res.redirect('/');
};