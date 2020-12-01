'use strict';

module.exports = () => {
  const _codeFreezeDayErrorHelp  = action => `It should be a string representing the day of the week the code freeze ${action}. Example: "Wednesday"`,
        _codeFreezeHourErrorHelp = action => `It should be a number from 0 to 23, representing the hour the code freeze ${action} on the CODE_FREEZE_DAY_${action.toUpperCase().slice(0, -1)}. Example: "14" would be 2PM`;

  if (!process.env.CODE_FREEZE_DAY_BEGIN) {
    console.error(`ERROR: Missing environment variable CODE_FREEZE_DAY_BEGIN. ${_codeFreezeDayErrorHelp('begins')}`);
    process.exit(1);
  }

  if (!process.env.CODE_FREEZE_HOUR_BEGIN) {
    console.error(`ERROR: Missing environment variable CODE_FREEZE_HOUR_BEGIN. ${_codeFreezeHourErrorHelp('begins')}`);
    process.exit(1);
  }

  if (isNaN(parseInt(process.env.CODE_FREEZE_HOUR_BEGIN, 10))) {
    console.error(`ERROR: CODE_FREEZE_HOUR_BEGIN value "${process.env.CODE_FREEZE_HOUR_BEGIN}" could not be converted to an integer. ${_codeFreezeHourErrorHelp('begins')}`);
    process.exit(1);
  }

  if (!process.env.CODE_FREEZE_DAY_END) {
    console.error(`ERROR: Missing environment variable CODE_FREEZE_DAY_END. ${_codeFreezeDayErrorHelp('ends')}`);
    process.exit(1);
  }


  if (!process.env.CODE_FREEZE_HOUR_END) {
    console.error(`ERROR: Missing environment variable CODE_FREEZE_HOUR_END. ${_codeFreezeHourErrorHelp('ends')}`);
    process.exit(1);
  }

  if (isNaN(parseInt(process.env.CODE_FREEZE_HOUR_END, 10))) {
    console.error(`ERROR: CODE_FREEZE_HOUR_END value "${process.env.CODE_FREEZE_HOUR_END}" could not be converted to an integer. ${_codeFreezeHourErrorHelp('ends')}`);
    process.exit(1);
  }
};
