# slapp-firebase-example
An example [Slapp][slap] Slack App using [Firebase][firebase] as the persistence layer. A primary goal of this repo is to serve as an example of you you might integrate a custom persistence layer w/ [Slapp][slap].

Expects the following environment variables:

+ `PORT` - port to start http server on - defaults to `3000`
+ `DOMAIN` - domain name - defaults to pulling from host headers on requests
+ `SLACK_VERIFY_TOKEN` - Your Slack App's verify token
+ `SLACK_CLIENT_ID` - Your Slack App's Client ID
+ `SLACK_CLIENT_SECRET` - Your Slack App's Client Secret
+ `FIREBASE_DB_URL` - Your Firebase project's Database URL

Also expected is a [Firebase Service account key file](https://firebase.google.com/docs/server/setup) located in the root of the project, named `firebase.json`.

## Getting Started

You'll need to setup a [new Slack App](https://api.slack.com/apps/new) and add a *Bot User*, as well as enable *Event Subscriptions*. Pick any username for your Bot User, and for your Event Subscrition, use the following details:

+ Request URL: `https://<your-domain>/slack/event`
+ Add the following *Bot Events*
    * `message.channels`
    * `message.groups`
    * `message.im`
    * `message.mpim`

A [Firebase](firebase) project is also required.  Slack Team data from the "Add to Slack" OAuth flow, as well as conversation state is stored there. Make sure to add your service account key file as `firebase.json` and set your `FIREBASE_DB_URL` environment variable.

[slap]: https://github.com/BeepBoopHQ/slapp
[firebase]: https://firebase.google.com
