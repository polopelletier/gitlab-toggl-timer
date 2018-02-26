# Gitlab/Toggl timer

[![NPM version](https://badge.fury.io/js/gitlab-toggl-timer.svg)](http://badge.fury.io/js/gitlab-toggl-timer)

Command line tool used to track you time working on a GitLab issue.

Each time you start working on something, the timer create a new Toggl time entry with the name of the branch you are currently on (assuming you are working on a merge request with a branch named `$issueID-$issue-title`. 

Once you are done, stop the current entry and the associated Toggl timer will be stopped and the duration of the timer will be added to the GitLab issue as spent time.

## Requirements
- [GitLab](https://gitlab.com) account
- [Toggl](https://toggl.com) account

## Installation
```bash
npm install -g gitlab-toggl-timer
```
### Toggl project
You need to create a Toggl project manualy. The project name must match the following format: `NAMESPACE/PROJECT`

## Usage
TODO: Change this part for a detailled work-flow with examples

The timer check your git repository to gather information about what you are currently working on
- Remote (by default origin): to get the name of the project you are working on 
- Current branch: to get the id of the issue you are working on (assuming you made a merge request where the branch name looks like `10-issue-name` where `10` is the issue id)

## Config
Config file is located at `~/.gitlab-toggl-timer.config`.
If you don't have a config file, you will be asked a few questions about your GitLab and Toggl accounts so that it can be created.

### Api token
#### GitLab
Create a [GitLab token with access to the api](https://docs.gitlab.com/ce/user/profile/personal_access_tokens.html)
#### Toggl
Create a [Toggle api token](https://support.toggl.com/my-profile/#api)

## Git config (aliases)
TODO: Check gitconfig filename
Add the following alias to `~/.git.config`
```
[alias]
start = !gitlab-toggl-timer start $@
stop = !gitlab-toggl-timer stop $@
current-timer = !gitlab-toggl-timer current $@
```
