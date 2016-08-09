'use strict'

const Slapp = require('slapp')
const Context = require('./context')
const ConvoStore = require('./convo-store')

module.exports = (server, db) => {
  let app = Slapp({
    verify_token: process.env.SLACK_VERIFY_TOKEN,
    context: Context(db),
    convo_store: ConvoStore(db)
  })

  app
    .message('^(hi|hello|hey)$', ['direct_mention', 'direct_message'], (msg, text) => {
      msg
        .say(text + ', how are you?')
        .route('how-are-you', { text }, 60)
    })
    .route('how-are-you', (msg, state) => {
      var resp = msg.body.event && msg.body.event.text

      if (/good/i.test(resp)) {
        msg
          .say(['Great! Ready?', ':smile: Are you sure?'])
          .route('how-are-you', state, 60)
      } else {
        msg
          .say('Me too', () => msg.say(`Thanks for saying ${state.text}`))
      }
    })
    .message('^(thanks|thank you)', ['mention', 'direct_message'], (msg) => {
      msg.say(["You're welcome", 'Of course'])
    })
    .message('help', ['direct_message', 'direct_mention'], (msg) => {
      let help = `I will respond to the following messages:
\`@slapp hi||hello\` for a greeting.
\`mention me by name in a message\` to demonstrate detecting a mention.
\`@slapp help\` to see this again.`

      msg.say(help)
    })
    .message('fix it', 'ambient', (msg) => {
      msg.say('https://www.youtube.com/watch?v=yo3uxqwTxk0')
    })
    .message(/.*/, 'mention', (msg) => {
      msg.say('You really do care about me. :heart:')
    })
    .attachToExpress(server)

  return app
}
