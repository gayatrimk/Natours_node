//1.It all started here
/*
const express=require('express');
const app=express();

app.get(`/`,(req,res)=>{
    //res.status(200).send('hello from server!!')

    res.status(200).json({message:'hello from server!!',
    app:'nodemon'})
})
const port=3000;
app.listen(port,()=>{
    console.log(`App running on port ${port}...`);
});


//2.Postman:
we are viewing requests on postman here just enter the url for address and the port number
in postman we can handle multiple requests like get ,post etcc..
*/

//type I: handling get requests:
//type II: handling post requests:
//type III: handling update requests:
//type IV: handling delete requests:

//this is way to write the url and handle its routes:
/*app.get('/api/v1/tours',(req,res)=>{
    res.status(200).json({
        status:"success",
        results:tours.length,
        data:{
            tours
        }
    });
});*/

//but we can write the code in much better way :
//create function and replace with its name instead of actual function

//this is one way but writing url is repeatative
/*
app.get('/api/v1/tours',getAllTours);
app.post('/api/v1/tours',createTour);
app.get('/api/v1/tours/:id',getTourById);
app.patch('/api/v1/tours/:id',updateTour);
app.delete('/api/v1/tours/:id',deleteTour); */

//more efficient  way:
/*
app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app
    .route('/api/v1/tours/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);
*/

//3.final app file be like*:

const express = require("express");
//It makes it easier to organize your application's functionality with middleware and routing.

const morgan = require("morgan");
//login middleware:display URL data

const tourRouter = require(`./routes/tourRoutes`);
//imported here from the file : routes/tourRoutes

const app = express();

app.use(express.json());
//middleware: for post requests to understand json data

app.use(express.static("./Public"));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//syntax of displaying data

//adding middleware
app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
  //next method is imp to further complete the execution on the request-response cycle
});

app.use(`/api/v1/tours`, tourRouter);
//imported from above tourRouter

//order of middleware affects the code
//if middleware is after some api requests those will not be applied with the middleware

//one more way called Mounting the routes

//all data is in seperate files
//4.check other files tourRoutes ans tourController

//5.here server code was written
//but we exported app fom here and wrote the server code in seperate server.js file
//now changed package.json
//"scripts": {
//  "start": "nodemon server.js"}
//now just run npm start

module.exports = app;
