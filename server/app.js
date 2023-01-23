const
  express = require("express"),
  { urlencoded, json } = require("body-parser"),
  cors = require("cors"),

  port = process.env.PORT || 9001,
  app = express();


app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/api/test-run", require("./routes/test.js"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
