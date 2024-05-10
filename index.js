const express = require("express");
const { connect } = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts", commentRoutes);

app.use(notFound);
app.use(errorHandler);
connect(process.env.MONGO_URI)
  .then(
    app.listen(5000, () =>
      console.log(`server running on port ${process.env.PORT}`)
    )
  )
  .catch((error) => {
    console.log(error);
  });

const port = 5000;
