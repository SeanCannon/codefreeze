# CodeFreeze
### Simple resources to help enforce code freeze schedules.

![GitHub Logo](/logo.png)

##### This package helps enforce code freeze schedules directly with Github Actions or indirectly with the CI tool of your choice.

This script depends on the following environment variables : 
```bash
CODE_FREEZE_DAY_BEGIN    # Case-sensitive day of the week the code freeze starts. Example: "Thursday"
CODE_FREEZE_HOUR_BEGIN   # Numeric hour of the day the code freeze begins, 0-23.  Example: "14" would be 2:00PM
CODE_FREEZE_DAY_END      # Case-sensitive day of the week the code freeze starts. Example: "Thursday"
CODE_FREEZE_HOUR_END     # Numeric hour of the day the code freeze begins, 0-23.  Example: "9" would be 9:00AM
```

If you have a bi-weekly sprint, you can enforce this script on odd or even weeks : 
```bash 
CODE_FREEZE_BI_WEEKLY=true       # "true" or nothing. Just omit this variable completely to enforce weekly code freezes
CODE_FREEZE_BI_WEEKLY_WEEK=odd   # One of "odd" or "even"
```

If you need an off-schedule code freeze or want to bypass this script completely, you can override : 
```bash 
CODE_FREEZE_OVERRIDE=frozen   # One of "frozen" (code freeze in full effect) or "unfrozen" (bypass the code freeze check)
```

You can create your own Github actions file and export these env vars, or you can use the one we provide for you, which is copied to :
```
./.github/workflows/githubAction.yml
```

If you want to use our file outright, simply create a `GITHUB_ENV` file in your project root which looks something like this : 
```bash 
CODE_FREEZE_DAY_BEGIN=Thursday
CODE_FREEZE_HOUR_BEGIN=6
CODE_FREEZE_DAY_END=Monday
CODE_FREEZE_HOUR_END=11
CODE_FREEZE_BI_WEEKLY=true
CODE_FREEZE_BI_WEEKLY_WEEK=odd
```

# CHANGELOG
 - 1.0.0 - initial commit
 - 1.0.1 - fix bi-weekly bug

# PLANNED ENHANCEMENTS
 - Support multiple code freezes per week
