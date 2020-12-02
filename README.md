![GitHub Logo](https://raw.githubusercontent.com/seancannon/codefreeze/HEAD/logo.png)

# CodeFreeze
### Simple resources to help enforce code freeze schedules.

#### Quick start

1. In your project, install `codefreeze`:
```bash 
yarn add codefreeze
```

2. Create a `GITHUB_ENV` file in the project root and populate it with your desired code freeze schedule:
```.env 
# Required
CODE_FREEZE_DAY_BEGIN=Thursday
CODE_FREEZE_HOUR_BEGIN=6
CODE_FREEZE_DAY_END=Monday
CODE_FREEZE_HOUR_END=11

# Optional preferences
CODE_FREEZE_BI_WEEKLY=true
CODE_FREEZE_BI_WEEKLY_WEEK=odd
CODE_FREEZE_TIMEZONE=America/New_York
```
3. On your next pull request, you should see the action in the pull request build status:

![Build Success](https://raw.githubusercontent.com/seancannon/codefreeze/HEAD/screenshotSuccess.png)

If code freeze is in effect, the previous screen will show that the action did not pass, and the details will look like this: 

![Build Fail](https://raw.githubusercontent.com/seancannon/codefreeze/HEAD/screenshotError.png)

### More details

This script depends on the following environment variables : 
```bash
CODE_FREEZE_DAY_BEGIN    # Case-sensitive day of the week the code freeze starts. Example: "Thursday"
CODE_FREEZE_HOUR_BEGIN   # Numeric hour of the day the code freeze begins, 0-23.  Example: "14" would be 2:00PM
CODE_FREEZE_DAY_END      # Case-sensitive day of the week the code freeze starts. Example: "Thursday"
CODE_FREEZE_HOUR_END     # Numeric hour of the day the code freeze begins, 0-23.  Example: "9" would be 9:00AM
```

The script timezone defaults to `'America/Los_Angeles'` but you can override : 
```bash 
CODE_FREEZE_TIMEZONE=America/Los_Angeles
```
You must use one of the supported [moment.js timezones](https://momentjs.com/timezone/docs/#/using-timezones/getting-zone-names/)

If you have a bi-weekly sprint, you can enforce this script on odd or even weeks : 
```bash 
CODE_FREEZE_BI_WEEKLY=true       # "true" or nothing. Just omit this variable completely to enforce weekly code freezes
CODE_FREEZE_BI_WEEKLY_WEEK=odd   # One of "odd" or "even"
```

If you need an off-schedule code freeze or want to bypass this script completely, you can override : 
```bash 
CODE_FREEZE_OVERRIDE=frozen   # One of "frozen" (code freeze in full effect) or "unfrozen" (bypass the code freeze check)
```

You can create your own Github actions file and export these env vars, or you can use the one we provide for you, which is 
automatically copied to :
```
./.github/workflows/githubAction.yml
```
If you are going to use your own Github actions file, you'll want to omit `codefreeze` from your `package.json` so it doesn't copy the included yml 
on your next `npm install` or `yarn install`.


## Planned Enhancements
 - Support multiple code freezes per week
 - Make github action yml copy optional
