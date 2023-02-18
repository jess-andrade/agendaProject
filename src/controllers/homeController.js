const Contact = require('../models/ContactModel');
const contact = require('../models/ContactModel')

exports.index = async (req, res) => {
  const contacts = await Contact.searchContacts();
  res.render('index', {contacts: contacts});
};
