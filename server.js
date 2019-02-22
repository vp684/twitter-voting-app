const express = require('express');
const path = require('path');
const helmet = require('helmet')




const port = process.env.PORT || 5000;

const app = express();
//use helmet defaults
app.use(helmet())

app.get('/api/data', (req, res)=>{

    res.send({data: 'this is from the API'})
})


if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, ()=>{

    console.log(`server started on port: ${port}`)
})