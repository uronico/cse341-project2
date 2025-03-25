const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));

router.get('/', (req,res) => { 
    //#swagger.tags=['Hello World']
    res.send('Hello World');
});

router.use('/personalinfo', require('./users'));

module.exports = router;
