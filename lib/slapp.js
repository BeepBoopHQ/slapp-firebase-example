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
        .route('how-are-you', {}, 60)
    })
    .route('how-are-you', (msg) => {
      var resp = msg.body.event && msg.body.event.text

      if (new RegExp('good', 'i').test(resp)) {
        msg
          .say(['Great! Ready?', ':smile: Are you sure?'])
          .route('how-are-you', 60)
      } else {
        msg.say('Me too')
      }
    })
    .message('^(thanks|thank you)', ['mention', 'direct_message'], (msg) => {
      msg.say(['You are welcome', 'Of course'])
    })
    .message('good night|bye', ['mention', 'direct_message'], (msg) => {
      msg.say(['Cheers :beers:', 'Bye', 'Goodbye', 'Adios'])
    })
    // catch all
    .message('.*', ['direct_mention', 'direct_message'], (msg) => {
      // respond only 40% of the time
      if (Math.random() < 0.4) {
        msg.say([':wave:', ':pray:', ':raised_hands:'])
      }
    })
    .message(/.*/, 'mention', (msg) => {
      msg.say('You really do care about me. :heart:')
    })
    .message('help', ['direct_message', 'direct_mention'], (msg) => {
      let help = `I will respond to the following messages:
\`@slapp hi||hello\` for a greeting.
\`mention me by name in a message\` to demonstrate detecting a mention.
\`@slapp help\` to see this again.`

      msg.say(help)
    })
    // currently getting ignored in `slapp.ignoreBotsMiddleware()`
    .event('message', (msg) => {
      if (msg.body.event.subtype !== 'channel_join') {
        return
      }

      if (msg.meta.user_id === msg.meta.bot_user_id) {
        msg.say("I'm here!")
      }
    })
    .attachToExpress(server)

  return app
}
