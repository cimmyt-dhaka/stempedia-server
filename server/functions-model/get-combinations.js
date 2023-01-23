const getParamsCombinations = require("./get-params-combinations.js");

module.exports = (parameters, weather, fieldData) => {
  const paramsCombinations = getParamsCombinations(parameters);
  return fieldData.reduce((acc, field) => [
    ...acc,
    ...field.data.map(fieldItem => ({
      field: field.nameField,
      fieldId: fieldItem.field_id,
      strdate_sowing: fieldItem.sowing_date,
      days_50PercFlowering: fieldItem.days_to_50perc_flowering,
      weather: field.nameWeather,
      dataWeatherInput: weather.find(el => el.name === field.nameWeather).data
    })).reduce((acc1, fieldCombination) => [
      ...acc1,
      ...paramsCombinations.map(
        paramsCombination => ({
          ...fieldCombination,
          params: paramsCombination
        })
      )
    ], [])
  ], []);
};
