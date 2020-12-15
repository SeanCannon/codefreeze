'use strict';

const codefreeze = require('../codefreeze');

describe('codefreeze', () => {
  beforeEach(() => {
    process.env.CODE_FREEZE_DAY_BEGIN  = 'Thursday';
    process.env.CODE_FREEZE_DAY_END    = 'Saturday';
    process.env.CODE_FREEZE_HOUR_BEGIN = '6';
    process.env.CODE_FREEZE_HOUR_END   = '11';
  });

  describe('environment variable validation', () => {
    it('throws when CODE_FREEZE_DAY_BEGIN is missing', () => {
      delete process.env.CODE_FREEZE_DAY_BEGIN;
      expect(() => {
        codefreeze();
      }).toThrow(new Error('ERROR: Missing environment variable CODE_FREEZE_DAY_BEGIN. It should be a string representing the day of the week the code freeze begins. Example: "Wednesday"'));
    });

    it('throws when CODE_FREEZE_HOUR_BEGIN is missing', () => {
      delete process.env.CODE_FREEZE_HOUR_BEGIN;
      expect(() => {
        codefreeze();
      }).toThrow(new Error('ERROR: Missing environment variable CODE_FREEZE_HOUR_BEGIN. It should be a number from 0 to 23, representing the hour the code freeze begins on the CODE_FREEZE_DAY_BEGIN. Example: "14" would be 2PM'));
    });

    it('throws when CODE_FREEZE_HOUR_BEGIN is not a parsable integer', () => {
      process.env.CODE_FREEZE_HOUR_BEGIN = 'foo';
      expect(() => {
        codefreeze();
      }).toThrow(new Error('ERROR: CODE_FREEZE_HOUR_BEGIN value "foo" could not be converted to an integer. It should be a number from 0 to 23, representing the hour the code freeze begins on the CODE_FREEZE_DAY_BEGIN. Example: "14" would be 2PM'));
    });

    it('throws when CODE_FREEZE_DAY_END is missing', () => {
      delete process.env.CODE_FREEZE_DAY_END;
      expect(() => {
        codefreeze();
      }).toThrow(new Error('ERROR: Missing environment variable CODE_FREEZE_DAY_END. It should be a string representing the day of the week the code freeze ends. Example: "Wednesday"'));
    });

    it('throws when CODE_FREEZE_HOUR_END is missing', () => {
      delete process.env.CODE_FREEZE_HOUR_END;
      expect(() => {
        codefreeze();
      }).toThrow(new Error('ERROR: Missing environment variable CODE_FREEZE_HOUR_END. It should be a number from 0 to 23, representing the hour the code freeze ends on the CODE_FREEZE_DAY_END. Example: "14" would be 2PM'));
    });

    it('throws when CODE_FREEZE_HOUR_END is not a parsable integer', () => {
      process.env.CODE_FREEZE_HOUR_END = 'foo';
      expect(() => {
        codefreeze();
      }).toThrow(new Error('ERROR: CODE_FREEZE_HOUR_END value "foo" could not be converted to an integer. It should be a number from 0 to 23, representing the hour the code freeze ends on the CODE_FREEZE_DAY_END. Example: "14" would be 2PM'));
    });
  });

  describe('with overrides', () => {
    afterEach(() => {
      delete process.env.CODE_FREEZE_OVERRIDE;
    });
    it('throws when frozen override is in effect', () => {
      process.env.CODE_FREEZE_OVERRIDE = 'frozen';
      expect(() => {
        codefreeze('2020-12-14 17:45', 'America/Los_Angeles'); // Monday
      }).toThrow(new Error('Code freeze full override in effect. All merges frozen.'));
    });
    it('does not throw when unfrozen override is in effect', () => {
      process.env.CODE_FREEZE_OVERRIDE = 'unfrozen';
      expect(() => {
        codefreeze('2020-12-18 17:45', 'America/Los_Angeles'); // Friday
      }).not.toThrow(new Error('Code freeze in effect: Today (12/18 05:45 PM) is between 12/17 06:00 AM and 12/19 11:00 AM'));
    });
  });

  describe('biweekly', () => {
    beforeEach(() => {
      process.env.CODE_FREEZE_BI_WEEKLY      = 'true';
      process.env.CODE_FREEZE_BI_WEEKLY_WEEK = 'odd';
    });

    describe('which crosses weekend', () => {
      beforeEach(() => {
        process.env.CODE_FREEZE_DAY_END = 'Monday';
      });

      it('exits without throwing when maybeNowOverride does not land in an active code freeze during freeze week', () => {
        expect(() => {
          // Freeze-week Monday before Thursday 6AM freeze start
          codefreeze('2020-12-14 17:45', 'America/Los_Angeles');
        }).not.toThrow();
      });

      it('exits without throwing when maybeNowOverride does not land in an active code freeze during non-freeze week', () => {
        expect(() => {
          // Next Tuesday after the Monday 11AM freeze end
          codefreeze('2020-12-22 17:45', 'America/Los_Angeles');
        }).not.toThrow();
      });

      it('throws when maybeNowOverride is in the code freeze at the end of the freeze week', () => {
        expect(() => {
          // Thursday after 6AM freeze start
          codefreeze('2020-12-17 17:45', 'America/Los_Angeles');
        }).toThrow(new Error('Code freeze in effect: Today (12/17 05:45 PM) is between 12/17 06:00 AM and 12/21 11:00 AM'));
      });

      it('throws when maybeNowOverride is in the code freeze at the beginning of the non-freeze week', () => {
        expect(() => {
          // Next Monday before 11AM freeze end
          codefreeze('2020-12-21 05:00', 'America/Los_Angeles');
        }).toThrow(new Error('Code freeze in effect: Today (12/21 05:00 AM) is between 12/17 06:00 AM and 12/21 11:00 AM'));
      });

      it('throws when maybeNowOverride is in the code freeze at the beginning of the non-freeze week when the even/odd calculation is inverted', () => {
        expect(() => {
          // Next Monday before 11AM freeze end
          process.env.CODE_FREEZE_BI_WEEKLY_WEEK = 'even';
          codefreeze('2020-12-28 05:00', 'America/Los_Angeles');
        }).toThrow(new Error('Code freeze in effect: Today (12/28 05:00 AM) is between 12/24 06:00 AM and 12/28 11:00 AM'));
      });
    });

    describe('which does not cross the weekend', () => {
      beforeEach(() => {
        process.env.CODE_FREEZE_DAY_END = 'Saturday';
      });

      it('exits without throwing when maybeNowOverride does not land in an active code freeze during freeze week', () => {
        expect(() => {
          // Freeze-week Monday before Thursday 6AM freeze start
          codefreeze('2020-12-14 17:45', 'America/Los_Angeles');
        }).not.toThrow();
      });

      it('throws when maybeNowOverride is in the code freeze during freeze week', () => {
        expect(() => {
          // Thursday after 6AM freeze start
          codefreeze('2020-12-17 17:45', 'America/Los_Angeles');
        }).toThrow(new Error('Code freeze in effect: Today (12/17 05:45 PM) is between 12/17 06:00 AM and 12/19 11:00 AM'));
      });

      it('exits without throwing when maybeNowOverride does not land anywhere in freeze week', () => {
        expect(() => {
          // Next Monday after last Saturday 11AM freeze end
          codefreeze('2020-12-21 05:00', 'America/Los_Angeles');
        }).not.toThrow();
      });
    });

    afterAll(() => {
      delete process.env.CODE_FREEZE_BI_WEEKLY;
      delete process.env.CODE_FREEZE_BI_WEEKLY_WEEK;
    });
  });

  describe('weekly', () => {
    describe('which crosses weekend', () => {
      beforeEach(() => {
        process.env.CODE_FREEZE_DAY_END = 'Monday';
      });

      it('exits without throwing when maybeNowOverride does not land in an active code freeze', () => {
        expect(() => {
          // Monday after 11AM freeze end, before Thursday 6AM freeze start
          codefreeze('2020-12-14 17:45', 'America/Los_Angeles');
        }).not.toThrow();
      });

      it('throws when maybeNowOverride is in the code freeze at the beginning of the week, while code was frozen last week over the weekend', () => {
        expect(() => {
          // Monday after last Thursday 6AM freeze start, but before same-day 11AM freeze end
          codefreeze('2020-12-14 05:00', 'America/Los_Angeles');
        }).toThrow(new Error('Code freeze in effect: Today (12/14 05:00 AM) is between 12/10 06:00 AM and 12/14 11:00 AM'));
      });

      it('throws when maybeNowOverride is in the code freeze at the end of the week, during code freeze which ends next week', () => {
        expect(() => {
          // Friday after the Thursday 6AM freeze start, but before next monday 11AM freeze end
          codefreeze('2020-12-18 05:00', 'America/Los_Angeles');
        }).toThrow(new Error('Code freeze in effect: Today (12/18 05:00 AM) is between 12/17 06:00 AM and 12/21 11:00 AM'));
      });
    });

    describe('which does not cross the weekend', () => {
      beforeEach(() => {
        process.env.CODE_FREEZE_DAY_END = 'Saturday';
      });

      it('exits without throwing when maybeNowOverride does not land in an active code freeze during freeze week', () => {
        expect(() => {
          // Freeze-week Monday before Thursday 6AM freeze start
          codefreeze('2020-12-14 17:45', 'America/Los_Angeles');
        }).not.toThrow();
      });

      it('throws when maybeNowOverride is in the code freeze', () => {
        expect(() => {
          // Thursday after 6AM freeze start
          codefreeze('2020-12-17 17:45', 'America/Los_Angeles');
        }).toThrow(new Error('Code freeze in effect: Today (12/17 05:45 PM) is between 12/17 06:00 AM and 12/19 11:00 AM'));
      });
    });
  });
});
