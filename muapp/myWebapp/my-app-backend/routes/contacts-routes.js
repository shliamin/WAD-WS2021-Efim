const express = require('express');

const contactsControllers = require('../controllers/contacts-controllers');

const router = express.Router();

router.get('/:cid', contactsControllers.getContactById);

router.get('/user/:uid', contactsControllers.getContactByUserId);

router.post('/', contactsControllers.createContact);

module.exports = router;