const { async } = require('regenerator-runtime');
const Contact = require('../models/ContactModel');

exports.index = (req, res) => {
    //* We pretend we have a contact here :)
    res.render('contact', {
      contact: {}
    });
};

// -- REGISTER NEW CONTACT 
exports.register = async (req,res) => {
    try{
        const contact = new Contact(req.body); 
        await contact.register();
        
        //* looking for errors        
        if(contact.errors.length > 0){
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('back')); 
            return; 
        }
            req.flash('success', 'success, your contact has been saved!' );
            req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`));
            return;
     }catch(e){
        console.log(e);
        return res.render('404');

     }
};

// -- EDIT INDEX
exports.editIndex = async function(req, res){
    if(!req.params.id) return res.render('404');
    const contact = await Contact.searchId(req.params.id);
    
    //* if I have a contact, the page is rendered
    if(!contact) return res.render('404');
    res.render('contact', { contact });
};

// -- EDIT
exports.edit = async function(req,res){
    if(!req.params.id) return res.render('404');
    const contact = new Contact(req.body);
    await contact.edit(req.params.id);
    
    try{
    //* looking for errors
        if(contact.errors.length > 0){
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('back')); 
            return; 
        }
            req.flash('success', 'Contact updated successfully!' );
            req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`));        
            return;
    }catch(e){
        console.log(e);
        res.render('404');
    }

};

// -- DELETE CONTACT 
exports.delete = async function(req, res) {
    if(!req.params.id) return res.render('404');
  
    const contact = await Contact.delete(req.params.id);
    if(!contact) return res.render('404');
  
    req.flash('success', 'Contact has been deleted.');
    req.session.save(() => res.redirect('back'));
    return;
  };