//const fs = require("fs");

//const { query } = require("express");
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");

//middleware for a special route
//for directly changing the request based on that field
exports.topTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};
//this was here when we read data from the tours-simple.json file
//but we no longer need this so .. now we use Tour to read/write from database
//const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));
//since we are not using tours comment out all tours logic from functions

exports.checkID = (req, res, next, val) => {
  console.log(`from middleware: Tour id is :${val}`);
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   });
  // }
  next();
};

//this was only for checking middleware we no longer need this in mongodb
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     //400 fail
//     return res.status(400).json({
//       status: "fail",
//       message: "missing name or price",
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    //filtering
    //Sorting
    //fiels limiting
    //pagination

    //execute
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limiting()
      .paging();

    const tours = await features.query;

    //filter object in Mongodb
    //{difficulty:'easy',duration:{$gte:5}}

    //send response
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }

  // res.status(200).json({
  //   status: "success",
  //   reqtime: req.reqTime,
  //   // results: tours.length,
  //   // data: {
  //   //   tours,
  //   // },
  // });
};

exports.createTour = async (req, res) => {
  //mongodb way:
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }

  //old way
  // console.log(req.body);
  //res.send("Done");

  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);

  // fs.writeFile(
  //   `./dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: "success",
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );
};

//in these functions we had to check whether the id is present or not but
//it was repetaitve code
//since we replace it with the checkID middleware

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }

  //console.log(req.params);

  // const id = req.params.id * 1;
  // const tour = tours.find((ele) => ele.id === id);

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     tour,
  //   },
  // });
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     tour: "Updated tour",
  //   },
  // });
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Delete failed",
    });
  }
  // res.status(204).json({
  //   status: "success",
  //   data: null,
  // });
};

/* 
before:
const deleteTour=(req,res)=>{
    if(req.params.id*1>tours.length)
    {
        return res.status(404).json({
            status:"fail",
            message:"Invalid ID"
        });
    }

    res.status(204).json({
        status:"success",
        data:null
    });
} */

//aggregation pipeline
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        //$toUpper:{}
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Delete failed",
    });
  }
};


//to get monthly data of total tours
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTour: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStart: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: plan,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Delete failed",
    });
  }
};
