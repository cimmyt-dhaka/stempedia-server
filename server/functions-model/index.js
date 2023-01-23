const
  getCombinations = require("./get-combinations.js"),
  modelFunction = require("./model.js");

module.exports = ({ parameters, weather, fieldData }) =>
  new Promise((resolve, reject) => {
    const
      combinations = getCombinations(parameters, weather, fieldData),
      simulationTimeStart = new Date();

    Promise.all(
      combinations.map(combination => modelFunction({
        ...combination,
        dataWeeks: [
          { weight: 8, cropProtection: 0 },
          { weight: 7, cropProtection: 0 },
          { weight: 6, cropProtection: 0 },
          { weight: 5, cropProtection: 0 },
          { weight: 4, cropProtection: 0 },
          { weight: 3, cropProtection: 0 },
          { weight: 2, cropProtection: 0 },
          { weight: 1, cropProtection: 0 }
        ]
      }))
    )
    .then(modelOutputs => {
      resolve(modelOutputs);
      const simulationTimeEnd = new Date();
      console.log(
        (simulationTimeEnd - simulationTimeStart) / 1000
      );
    })
    .catch(err => { reject(err); });
  });
