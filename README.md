# Gitlab/Toggl timer

[![NPM version](https://badge.fury.io/js/gitlab-toggl-timer.svg)](http://badge.fury.io/js/gitlab-toggl-timer)

TODO: Description and asumptions (remote/branch-name)

## Installation
```bash
npm install -g gitlab-toggl-timer
```

### Toggl project
TODO: You need to create a toggl project named `NAMESPACE/PROJECT`

## Usage
The timer check your git repository to gather information about what you are currently working on
- Remote (by default origin): to get the name of the project you are working on 
- Current branch: to get the id of the issue you are working on (assuming you made a merge request where the branch name looks like `10-issue-name` where `10` is the issue id)

## Config
Config file is located at `~/.gitlab-toggl-timer.config`.
If you don't have a config file, you will be asked a few questions about your GitLab and Toggl accounts so that it can be created.

### Api token
#### GitLab
TODO
#### Toggl
TODO

## Git config (aliases)
TODO
```
[alias]
start = !gitlab-toggl-timer start $@
stop = !gitlab-toggl-timer stop $@
```
