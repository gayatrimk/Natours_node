//wrting this file just to seperate the code from main index file
//using the concept of exporting modules we learnt before

const express = require("express");
const tourController = require(`./../controller/tourController`);

const tourRouter = express.Router();

//we no longer need this in mongodb
//param middleware
//tourRouter.param('id',tourController.checkID);

//custom middleware to check the body having name and price for post

//we can write functions body here also
//just for ease we wrote them in seperate file and import here

//a special route for top-5-tours with simple getAllTours function with a special middleware topTours
tourRouter
  .route("/top-5-tours")
  .get(tourController.topTours, tourController.getAllTours);

tourRouter.route("/tour-stats").get(tourController.getTourStats);
tourRouter.route("/monthly-plans/:year").get(tourController.getMonthlyPlan);

tourRouter
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);
//.post(tourController.checkBody,tourController.createTour);

tourRouter
  .route("/:id")
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

//export the tourRouter from here to use in app.js
module.exports = tourRouter;
