const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);


class Login {
  constructor(body){
    this.body = body;

    //* controls whether the user can be created - flag error
    this.errors = []; 
    this.user = null; 
  }

 // -- LOGIN USER 
  async login(){
    this.validate();
    if(this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if(!this.user) {
      this.errors.push('User does not exist.');
      return;
    }

    //* compare passwords
    if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Invalid password');
      this.user = null;
      return;
    }
  }

  // -- REGISTER NEW USER
  async register(){
    this.validate();
    if(this.errors.length > 0) return;

    await this.userExists();

    if(this.errors.length > 0) return; //2 check

    //* password REST 
    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }

  // -- CHECK IF THE USER ALREADY EXISTS 
  async userExists(){
    this.user = await LoginModel.findOne({email: this.body.email});
    if(this.user) this.errors.push('This user already exists');
  }

  // -- VALIDATE FIELDS
  validate(){
    this.cleanUp();

    if(!validator.isEmail(this.body.email)) this.errors.push('invalid email');

    if(this.body.password.length < 5 || this.body.password.length > 15 ){
      this.errors.push('the password must be between 5 and 15 characters');
    } 
  }

  // -- CLEAN UP
  cleanUp(){
    //* ensures that everything inside the body is a string
    for(const key in this.body){
      if(typeof this.body[key] !== 'string'){
        this.body[key] ='';
      }
    }
    //* ensures we only have the fields we need
    this.body = {
      email: this.body.email,
      password: this.body.password
  };
}

}

module.exports = Login;
