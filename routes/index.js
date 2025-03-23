const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));

router.get('/', (req,res) => { 
    //#swagger.tags=['Hello Wolrd']
    res.send('Hello World');
});

router.use('/users', require('./users'));

module.exports = router;
