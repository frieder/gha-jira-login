# Github Action - Jira Login

[![Build Status](https://img.shields.io/github/actions/workflow/status/frieder/gha-jira-login/pr.yml?label=Build%20Status)](https://github.com/frieder/gha-jira-login/actions/workflows/pr.yml)
[![Open Issues](https://img.shields.io/github/issues-raw/frieder/gha-jira-login?label=Open%20Issues)](https://github.com/frieder/gha-jira-login/issues?q=is%3Aopen+is%3Aissue)
[![Sonar Issues](https://img.shields.io/sonar/violations/frieder_gha-jira-login/main?format=long&server=https%3A%2F%2Fsonarcloud.io&label=Sonar%20Violations)](https://sonarcloud.io/project/overview?id=frieder_gha-jira-login)
[![Known Vulnerabilities](https://snyk.io/test/github/frieder/gha-jira-login/badge.svg)](https://snyk.io/test/github/frieder/gha-jira-login)

A Github action that takes access credentials and verifies them again Jira REST API.
Upon successful login, the credentials are stored locally in `~/jira/config.yml`.
This behavior is in line with how [atlassian/gajira-login](https://github.com/marketplace/actions/jira-login) 
works to act as a drop-in replacement.

> Atlassian does not maintain its Github actions anymore. This is an issue since they are
> built with Node v16, which has been marked deprecated by Github and will soon get removed.

Instead of just writing the data to the file, it performs a login attempt to verify the
provided credentials. This allows to fail early if the credentials are incorrect.

## Usage

```yaml
name: Test Action

on:
  [..]

env:
  JIRA_BASE_URL: ${{ secrets.JIRA_URL }} # https://???.atlassian.net
  JIRA_USER_EMAIL: ${{ secrets.JIRA_EMAIL }}
  JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}

jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Jira Login
        uses: frieder/gha-jira-login@v1
        with:
          baseUrl: ${{ secrets.JIRA_URL }}
          email: ${{ secrets.JIRA_EMAIL }}
          token: ${{ secrets.JIRA_TOKEN }}
```

The access information can be provided either as direct action arguments or by setting
env variables. For the env variable names it will use the same names as Atlassian's
login action does to allow for a drop-in replacement. When both are provided, the 
input fields take precedence over the env variables.

## Build Code

Install packages: `npm i`              <br>
Compile code: `npm run build`          <br>
Format code: `npm run format`          <br>
Format check: `npm run format-check`   <br>
Code check: `npm run lint`

## Test Action

This action can be tested during development with the use of https://github.com/nektos/act.

```
act -j check -s JIRA_URL=*** -s JIRA_EMAIL=*** -s JIRA_TOKEN=***
```

