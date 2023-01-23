const
  express = require("express"),
  
  router = express.Router();
  modelFunction = require("../functions-model/");


// @route    POST /api/test-run
// @desc     Test runs on this route
// @access   Public
router.post("", async (req, res) => {
  console.log("POST /api/test-run request made");
  try {
    const
    { parameters, weather, fieldData } = req.body,
    outputs = await modelFunction({ parameters, weather, fieldData });
    
    res.json(outputs);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
