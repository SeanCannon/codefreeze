'use strict';

const moment = require('moment');

const validate = require('./validate');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

validate();
const codeFreezeErrorMessage     = 'Code freeze in effect';
const codeFreezeOverrideFrozen   = process.env.CODE_FREEZE_OVERRIDE === 'frozen';
const codeFreezeOverrideUnfrozen = process.env.CODE_FREEZE_OVERRIDE === 'unfrozen';
const codeFreezeBiWeekly         = process.env.CODE_FREEZE_BI_WEEKLY === 'true';
const codeFreezeBiWeeklyOdd      = process.env.CODE_FREEZE_BI_WEEKLY_WEEK === 'odd';
const codeFreezeBiWeeklyEven     = !codeFreezeBiWeeklyOdd;
const codeFreezeBeginDay         = days.indexOf(process.env.CODE_FREEZE_DAY_BEGIN);
const codeFreezeBeginHour        = parseInt(process.env.CODE_FREEZE_HOUR_BEGIN, 10);
const codeFreezeEndDay           = days.indexOf(process.env.CODE_FREEZE_DAY_END);
const codeFreezeEndHour          = parseInt(process.env.CODE_FREEZE_HOUR_END, 10);
const now                        = moment();

const codeFreezeBeginMoment = moment().day(codeFreezeBeginDay).hour(codeFreezeBeginHour);
const codeFreezeEndMoment   = (codeFreezeBeginDay < codeFreezeEndDay) ?
  moment().day(codeFreezeEndDay).hour(codeFreezeEndHour) :
  moment().day(codeFreezeEndDay).add(1, 'weeks').hour(codeFreezeEndHour);

if (codeFreezeOverrideFrozen) {
  console.error(codeFreezeErrorMessage);
  process.exit(1);
}

if (codeFreezeOverrideUnfrozen) {
  process.exit(0);
}

if (codeFreezeBiWeekly) {
  const isWeekOdd  = moment().week() % 2 === 1,
        isWeekEven = !isWeekOdd;
  if ((codeFreezeBiWeeklyOdd && isWeekEven) || (codeFreezeBiWeeklyEven && isWeekOdd)) {
    process.exit(0);
  }
}

if (now.isBetween(codeFreezeBeginMoment, codeFreezeEndMoment)) {
  process.exit(0);
}