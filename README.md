# slapp-firebase-example
An example Slapp Slack App using Firebase as the persistence layer

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
