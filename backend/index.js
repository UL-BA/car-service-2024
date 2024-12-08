const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config()
const mongoose = require('mongoose');

async function main() {
    await mongoose.connect(process.env.DB_URL);
    app.use('/', (req, res) => {
    res.send("Road Ready is running!");
});
} 

main().then(()=>console.log("mango connected succesfully")).catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })