//multiple line comment ctrl +k+c
//5.mongoose
//tourModel
//4.
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: `./config.env` });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    //console.log(con.connections);
    console.log("Connection success");
  });

//1.

const app = require("./app");

//console.log(process.env);

//3.environment variables
//console.log(process.env); :-list of envs
//now it is set to development
//after deployment change it to production

//2.the main file for running the app
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//ok byeee
