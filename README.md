# slapp-firebase-example
An example [Slapp][slap] Slack App using [Firebase][firebase] as the persistence layer. A primary goal of this repo is to serve as an example of you you might integrate a custom persistence layer w/ [Slapp][slap].

Expects the following environment variables:

+ `PORT` - port to start http server on - defaults to `3000`
+ `DOMAIN` - domain name - defaults to pulling from host headers on requests
+ `SLACK_VERIFY_TOKEN` - Your Slack App's verify token
+ `SLACK_CLIENT_ID` - Your Slack App's Client ID
+ `SLACK_CLIENT_SECRET` - Your Slack App's Client Secret
+ `FIREBASE_DB_URL` - Your Firebase project's Database URL
+ `FIREBASE_SERVICE_ACCOUNT_BASE64` - Your Firebase project's ID

To create your `FIREBASE_SERVICE_ACCOUNT_BASE64` value you'll want to head to your Firebase project's Service Accounts settings and generate a new Private Key `json` file.  You'll need to base64 encode the contents of the file to be able to set it as an environment variable.

```bash
base64 /path/to/service-account.json
```

For development you can set your environment variables in an `env.sh` file (which is `.gitignored` for you), and then just source it.

```bash
export PORT="8080"
export SLACK_VERIFY_TOKEN="your-slack-verify-token"
export SLACK_CLIENT_ID="your-slack-app-client-id"
export SLACK_CLIENT_SECRET="your-slack-app-client-secret"
export FIREBASE_DB_URL="your-firebase-url"
export FIREBASE_SERVICE_ACCOUNT_BASE64="base64 encoded service account key file contents"
```

## Getting Started

You'll need to setup a [new Slack App](https://api.slack.com/apps/new) and add a *Bot User*, as well as enable *Event Subscriptions*. Pick any username for your Bot User, and for your Event Subscrition, use the following details:

+ Request URL: `https://<your-domain>/slack/event`
+ Add the following *Bot Events*
    * `message.channels`
    * `message.groups`
    * `message.im`
    * `message.mpim`

A [Firebase](firebase) project is also required.  Slack Team data from the "Add to Slack" OAuth flow, as well as conversation state is stored there.

## Running App
Once you have your app running, if you visit the root, `https://<your-domain>/` it will render a page with an "Add to Slack" button you can use to add it to one of your Slack teams and start sending it messages.

Try asking the bot for help in a direct message

![image](https://cloud.githubusercontent.com/assets/367275/17531990/b05399a4-5e3b-11e6-9dc0-21a29f27c913.png)

Try changing the messages the bot is listening for to get a feel for how things work by looking in [`lib/slapp.js`](https://github.com/BeepBoopHQ/slapp-firebase-example/blob/master/lib/slapp.js)

[slap]: https://github.com/BeepBoopHQ/slapp
[firebase]: https://firebase.google.com
