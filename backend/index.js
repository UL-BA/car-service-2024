const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb+srv://mcspyder:<db_password>@cluster0.pthwz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    app.use('/', (req, res) => {
    res.send("Road Ready is running!");
});
}

main().then(()=>console.log("mango connected succesfully")).catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })