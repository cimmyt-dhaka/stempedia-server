const
  { timeDay } = require("d3-time"),
  { timeParse } = require("d3-time-format"),
  
  getProcessedWeatherData = require("./process-weather-data.js"),
  getProcessedWeekData = require("./process-week-data.js");

module.exports = ({
  field,
  fieldId,
  strdate_sowing,
  days_50PercFlowering,
  dataWeatherInput,
  dataWeeks,
  params,
}) => new Promise((resolve, reject) => {
  const
    {
      sbScalingFactor,
      rh,
      thresholdTempLower,
      thresholdTempUpper,
      thresholdSSH,
      consecutiveDaysFav,
      psw,
      dew
    } = params,

    date_50PercFlowering = timeDay.offset(
      timeParse("%y%m%d")(strdate_sowing),
      days_50PercFlowering
    ),
    dataWeather = getProcessedWeatherData({
      weather: dataWeatherInput,
      thresholdTempLower,
      thresholdTempUpper,
      thresholdSSH
    }),
    strdate_sporeRelease = dataWeather.find(row => row.fesrCum === consecutiveDaysFav);
    
  if(!strdate_sporeRelease) {

    resolve({
      field,
      fieldId,
      strdate_sowing,
      days_50PercFlowering,
      ...params,
      weightedDS: null,
      unweightedDS: null,
      remarks: "Spore doesn't get released"
    });

  } else {

    const
      weeks = getProcessedWeekData({
        weekData: dataWeeks,
        weatherData: dataWeather,
        date_50PercFlowering,
        dew,
        psw,
        rh
      }),

      diseaseIndexAll = weeks.reduce((sum, week) => sum + week.diseaseIndex, 0) / weeks.length,
      weightAll = weeks.reduce((sum, week) => sum + week.diseaseIndex * week.weight, 0) / weeks.reduce((sum, week) => sum + week.weight, 0),
      unweightedDS = diseaseIndexAll * sbScalingFactor,
      weightedDS = weightAll * sbScalingFactor;

    resolve({
      field,
      fieldId,
      strdate_sowing,
      days_50PercFlowering,
      ...params,
      weightedDS: Math.round(weightedDS * 100) / 100,
      unweightedDS: Math.round(unweightedDS * 100) / 100,
      remarks: ""
    });

  }
});
