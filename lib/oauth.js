'use strict'

const bodyParser = require('body-parser')
const slack = require('slack')

module.exports = (server, db) => {
  let clientId = process.env.SLACK_CLIENT_ID
  let clientSecret = process.env.SLACK_CLIENT_SECRET
  let domain = process.env.DOMAIN

  // Landing page w/ `Add to Slack` button
  server.get('/', (req, res) => {
    let redirectURI = `https://${domain || req.get('host')}/add-to-slack`

    res.send(`
    <html>
    <body style='display: flex; align-items: center; justify-content: center; flex-direction: column;font-family: sans-serif'>
      <h1><a href='https://github.com/BeepBoopHQ/slapp'>Slapp</a> Firebase Slack App</h1>
      <a href="https://slack.com/oauth/authorize?scope=bot&client_id=${clientId}&redirect_uri=${redirectURI}"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
      <a href="https://github.com/selfcontained/slapp-firebase-example"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"></a>
    </body>
    </html>
    `)
  })

  // OAuth receiver - exhange, verify and store tokens & team data
  server.get('/add-to-slack', bodyParser.json(), (req, res) => {
    let params = {
      code: req.query.code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `https://${domain || req.get('host')}/add-to-slack`
    }

    slack.oauth.access(params, (err, oauthAccess) => {
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
          res.send(`
            <html>
            <body style='display: flex; align-items: center; justify-content: center; flex-direction: column;font-family: sans-serif'>
              <h1><a href='https://github.com/BeepBoopHQ/slapp'>Slapp</a> Firebase Slack App</h1>
              <p>This Slack App has been successfully added to the <strong>${authTest.team}</strong> team</p>
              <a href="https://github.com/selfcontained/slapp-firebase-example"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"></a>
            </body>
            </html>
          `)
        })
      })
    })
  })
}
