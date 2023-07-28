const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  }) 
  .then(() => {
    const PORT = process.env.PORT || 8000;
    console.log("DB Connection Successfull");
    app.listen(PORT, () => {
      console.log(`App is Listening on PORT ${PORT}`);
    });
    
  })
  .catch((err) => {
    console.log(err.message);
  });
  
app.use("/api/user", userRoutes);
