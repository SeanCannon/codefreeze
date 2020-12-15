'use strict';

const moment = require('moment-timezone');

const validate = require('./validate');

const days     = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timezone = process.env.CODE_FREEZE_TIMEZONE || 'America/Los_Angeles';

const codefreeze = maybeNowOverride => {

  validate();

  const codeFreezeErrorMessage     = (now, begin, end) => `Code freeze in effect: Today (${now.format('MM/DD hh:mm A')}) is between ${begin.format('MM/DD hh:00 A')} and ${end.format('MM/DD hh:00 A')}`;
  const codeFreezeOverrideFrozen   = process.env.CODE_FREEZE_OVERRIDE === 'frozen';
  const codeFreezeOverrideUnfrozen = process.env.CODE_FREEZE_OVERRIDE === 'unfrozen';
  const codeFreezeBiWeekly         = process.env.CODE_FREEZE_BI_WEEKLY === 'true';
  const codeFreezeBiWeeklyOdd      = process.env.CODE_FREEZE_BI_WEEKLY_WEEK === 'odd';
  const codeFreezeBiWeeklyEven     = !codeFreezeBiWeeklyOdd;
  const codeFreezeBeginDay         = days.indexOf(process.env.CODE_FREEZE_DAY_BEGIN);
  const codeFreezeBeginHour        = parseInt(process.env.CODE_FREEZE_HOUR_BEGIN, 10);
  const codeFreezeEndDay           = days.indexOf(process.env.CODE_FREEZE_DAY_END);
  const codeFreezeEndHour          = parseInt(process.env.CODE_FREEZE_HOUR_END, 10);
  const now                        = moment(maybeNowOverride).tz(timezone);

  const codeFreezeBeginMoment         = moment(maybeNowOverride).tz(timezone).day(codeFreezeBeginDay).hour(codeFreezeBeginHour);
  const codeFreezeBeginMomentLastWeek = moment(codeFreezeBeginMoment).subtract(1, 'weeks');
  const codeFreezeEndMoment           = moment(maybeNowOverride).tz(timezone).day(codeFreezeEndDay).hour(codeFreezeEndHour);
  const codeFreezeEndMomentNextWeek   = moment(codeFreezeEndMoment).add(1, 'weeks');
  const crossesWeekend                = codeFreezeBeginDay > codeFreezeEndDay;

  if (codeFreezeOverrideFrozen) {
    throw new Error('Code freeze full override in effect. All merges frozen.');
  }

  if (codeFreezeOverrideUnfrozen) {
    return;
  }

  if (codeFreezeBiWeekly) {
    const isWeekOdd  = moment(maybeNowOverride).tz(timezone).week() % 2 === 1,
          isWeekEven = !isWeekOdd;

    if ((codeFreezeBiWeeklyOdd && isWeekEven) || (codeFreezeBiWeeklyEven && isWeekOdd)) {
      if (crossesWeekend) {
        if (now.isBetween(codeFreezeBeginMomentLastWeek, codeFreezeEndMoment)) {
          throw new Error(codeFreezeErrorMessage(now, codeFreezeBeginMomentLastWeek, codeFreezeEndMoment));
        }
      }
    } else {
      if (crossesWeekend) {
        if (now.isBetween(codeFreezeBeginMoment, codeFreezeEndMomentNextWeek)) {
          throw new Error(codeFreezeErrorMessage(now, codeFreezeBeginMoment, codeFreezeEndMomentNextWeek));
        }
      } else {
        if (now.isBetween(codeFreezeBeginMoment, codeFreezeEndMoment)) {
          throw new Error(codeFreezeErrorMessage(now, codeFreezeBeginMoment, codeFreezeEndMoment));
        }
      }
    }
  } else {
    if (crossesWeekend) {
      if (now.isBetween(codeFreezeBeginMomentLastWeek, codeFreezeEndMoment)) {
        throw new Error(codeFreezeErrorMessage(now, codeFreezeBeginMomentLastWeek, codeFreezeEndMoment));
      }
      if (now.isBetween(codeFreezeBeginMoment, codeFreezeEndMomentNextWeek)) {
        throw new Error(codeFreezeErrorMessage(now, codeFreezeBeginMoment, codeFreezeEndMomentNextWeek));
      }
    } else {
      if (now.isBetween(codeFreezeBeginMoment, codeFreezeEndMoment)) {
        throw new Error(codeFreezeErrorMessage(now, codeFreezeBeginMoment, codeFreezeEndMoment));
      }
    }
  }
};

module.exports = codefreeze;
