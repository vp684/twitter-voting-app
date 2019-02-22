const express = require('express');
const path = require('path');




const port = process.env.PORT || 5000;

const app = express();

app.get('/api/data', (req, res)=>{

    res.send({test: 'this is from the API'})
})

//send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, ()=>{

    console.log(`server started on port: ${port}`)
})