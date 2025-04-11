require("dotenv").config();
const express = require ('express');
const cors = require('cors');

const app= express();
const PORT = 5000;

app.use((err,req,res,next)=> {
    console.log(err.stack);
    res.status(500).json({
        success : false,
        message : 'Something went wrong'
    })
})

app.get('/',(req,res) => {
    res.send('Website is running...');
});

app.listen(PORT,()=>{
    console.log(`server is now running on port ${PORT}`)
})