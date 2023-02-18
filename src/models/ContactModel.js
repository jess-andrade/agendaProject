const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: false, default:''},
  email: { type: String, required: false, default:'' },
  phone: { type: String, required: false, default:'' },
  createdOn: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model('Contact', ContactSchema);

//Constructor function
function Contact(body){
  this.body = body; //req.body --> here
  this.errors = [];
  this.contact = null;
}

//-- REGISTER
Contact.prototype.register = async function(){
  this.validate();

  if(this.errors.length > 0) return;
  this.contact = await ContactModel.create(this.body);
};

// -- VALIDATE
Contact.prototype.validate = function(){
  this.cleanUp();

  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('invalid email');
  if(!this.body.name) this.errors.push('"name" is required.');
  if(!this.body.email && !this.body.phone){
    this.errors.push('register at least one form of contact (e-mail or/and phone).');
  } 
};

// -- CLEAN UP
Contact.prototype.cleanUp = function(){
  //* ensures that everything inside the body is a string
  for(const key in this.body){
    if(typeof this.body[key] !== 'string'){
      this.body[key] ='';
    }
  }
  //* ensures we only have the fields we need
  this.body = {
    name: this.body.name,
    lastname: this.body.lastname,
    email: this.body.email,
    phone: this.body.phone,
  };
};

// -- EDIT
//* this one can't be a static method because I'll need to validate everything again 
Contact.prototype.edit = async function(id){
  //* validate fields before updating
  if(typeof id !== 'string') return;
  this.validate();
  if(this.errors.length > 0) return;
  this.contact = await ContactModel.findByIdAndUpdate(id, this.body,{ new:true }); //find id and update data
};


//STATIC METHODS (so.. don't use ".this")
//* no need instantiate to use

// -- SEARCH FOR ID
Contact.searchId = async function(id){
  if(typeof id !== 'string') return;

  const contact = await ContactModel.findById(id);
  return contact;
};

// -- SEARCH FOR CONTACTS
Contact.searchContacts = async function(){
  const contacts = await ContactModel.find() 
    .sort({createdOn: -1 }); // -1 = in descending order
  return contacts;
};

// -- DELETE CONTACT
Contact.delete = async function(id) {
  if(typeof id !== 'string') return;
  const contact = await ContactModel.findOneAndDelete({_id: id});
  return contact;
};

module.exports = Contact;
