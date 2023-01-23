module.exports = parameters =>
  Object.keys(parameters)
    .reduce((combinations, param) =>
      combinations.length === 0 ? parameters[param].map(paramVal => ({ [param]: paramVal }))
        : combinations.reduce(
          (acc, combination) => [...acc, ...parameters[param].map(
            paramVal => ({ ...combination, [param]: paramVal })
          )],
          []
        ), []
    );
