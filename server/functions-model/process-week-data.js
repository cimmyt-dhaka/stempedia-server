const
  { timeDay } = require("d3-time"),
  { timeFormat } = require("d3-time-format");

module.exports = ({ weekData, weatherData, date_50PercFlowering, dew, psw, rh }) => {
  const weeks = weekData
    .map((week, i) => {
      const
        { cropProtection } = week,
        multiplier = cropProtection === 0 ? 1 : 0,
        susceptibleBegin = 7 * i * multiplier,
        susceptibleEnd = 7 * (i + 1) * multiplier,

        date_susceptibleWindowStart = timeDay.offset(date_50PercFlowering, - 7),
        date_susceptibilityStarts = timeDay.offset(date_susceptibleWindowStart, susceptibleBegin),
        date_susceptibilityEnds = timeDay.offset(date_susceptibleWindowStart, susceptibleEnd),
        date_DEWStarts = date_susceptibilityEnds,
        date_DEWEnds = timeDay.offset(date_susceptibilityEnds, dew),

        weekWeatherData = weatherData.map(row => {
          const
            potential_sus_window = 
              +timeFormat("%y%m%d")(date_susceptibilityStarts) === +timeFormat("%y%m%d")(date_susceptibilityEnds)
              ? false
              : (
                +timeFormat("%y%m%d")(row.date) > +timeFormat("%y%m%d")(date_susceptibilityStarts) &&
                +timeFormat("%y%m%d")(row.date) <= +timeFormat("%y%m%d")(date_susceptibilityEnds)
              ),
            disease_establishment_window =
              +timeFormat("%y%m%d")(row.date) > +timeFormat("%y%m%d")(date_DEWStarts) &&
              +timeFormat("%y%m%d")(row.date) <= +timeFormat("%y%m%d")(date_DEWEnds);

          return {
            date: row.date,
            potential_sus_window,
            actual_sus_index: potential_sus_window && row.fesr,
            disease_establishment_window,
            disease_establishment_index: disease_establishment_window && row.rh >= rh
          }
        }),

        ASI = weekWeatherData.filter(el => el.actual_sus_index).length,
        ratio_ASI_PSW = ASI > psw ? 1 : ASI / psw,
        DEI = weekWeatherData.filter(el => el.disease_establishment_index).length,
        ratio_DEI_DEW = DEI > dew ? 1 : DEI / dew;

      return {
        ...week,
        multiplier,
        date_susceptibilityStarts,
        date_susceptibilityEnds,
        date_DEWStarts,
        date_DEWEnds,
        ASI,
        DEI,
        indexInfection: ratio_ASI_PSW,
        indexEstablishment: ratio_DEI_DEW,
        diseaseIndex: ratio_ASI_PSW * ratio_DEI_DEW
      };
    });

  return weeks;
}
