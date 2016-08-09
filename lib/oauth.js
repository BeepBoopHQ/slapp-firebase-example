'use strict'

const bodyParser = require('body-parser')
const slack = require('slack')

module.exports = (server, db) => {
  let clientId = process.env.SLACK_CLIENT_ID
  let clientSecret = process.env.SLACK_CLIENT_SECRET
  let redirectURI = 'https://bharris.ngrok.io/add-to-slack'

  server.get('/', (req, res) => {
    res.send(`
    <html>
    <body style='display: flex; align-items: center; justify-content: center;'>
      <a href="https://slack.com/oauth/authorize?scope=bot&client_id=${clientId}&redirect_uri=${redirectURI}"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
    </body>
    </html>
    `)
  })

  server.get('/add-to-slack', bodyParser.json(), (req, res) => {
    let code = req.query.code

    // exchange code for access token
    slack.oauth.access({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectURI }, (err, oauthAccess) => {
      if (err) {
        console.error(err)
        return res.status(500).send(err.message || err)
      }

      // test access token
      slack.auth.test({ token: oauthAccess.access_token }, (err, authTest) => {
        if (err) {
          console.error(err)
          return res.status(500).send(err.message || err)
        }

        if (!authTest.team_id) {
          return res.status(500).send('No team_id present in auth.test response')
        }

        db.saveTeam(authTest.team_id, oauthAccess, (err) => {
          if (err) {
            console.error(err)
            return res.status(500).send(err.message || err)
          }

          console.log('Team added: %s', authTest.team_id)
          res.send('This app has been added to your Slack team.')
        })
      })
    })
  })
}
