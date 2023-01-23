const
  { timeParse } = require("d3-time-format");

module.exports = ({
  weather,
  thresholdTempLower,
  thresholdTempUpper,
  thresholdSSH
}) => {
  const
    dataWeather = weather.map(row => {
      const
        tFav = +row.tmax > thresholdTempLower && +row.tmax < thresholdTempUpper,
        moistureFav = +row.ssh <= thresholdSSH,
        fesr = tFav && moistureFav;

      return {
        date: timeParse("%y%m%d")(row.date),
        rain: +row.rain,
        tmax: +row.tmax,
        tmin: +row.tmin,
        tavg: (+row.tmax + +row.tmin) / 2,
        rh: +row.rh,
        ssh: +row.ssh,
        tFav,
        moistureFav,
        fesr
      };
    });

  dataWeather.forEach((_, i) => {
    dataWeather[i].fesrCum = !dataWeather[i].fesr ? 0
      : i > 0 ? 1 + dataWeather[i-1].fesrCum
      : 1
  });

  return(dataWeather);
};
