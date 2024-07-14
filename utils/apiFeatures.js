class APIFeatures {
  //we are writing all the methods here from getAllTours
  //but to write there just replace this.query to query and queryStr to req.query

  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    //build query
    //in this way queryObj is created as new object instead of just coping req.query
    const queryObj = { ...this.queryStr };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    //Advance filtering like less than,greater than
    //sample query: 127.0.0.1:3000/api/v1/tours?price[lt]=500
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //console.log("query is: ", JSON.parse(queryStr));
    //this this regular expression for matching the query from req and adding a $ sign to it for mongodb opertions
    // /g is used for replacing all occurances of it without it only first occurance will get replaced

    this.query = this.query.find(JSON.parse(queryStr));
    //let query = Tour.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("_id");
    }
    //for descending price use sort=-price

    return this;
  }

  limiting() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
      //format fields=name duration difficulty
    } else {
      //always exclude unneccesary or sensitive data
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paging() {
    //sample api?page=2&limit=10
    //means 10 documents per page and page number 2
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 50;
    //default page=1 limit=50

    //skip function skips the first number given records
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
