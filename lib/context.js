'use strict'

// Slapp context middleware function
// Looks up team info from db and enriches request
module.exports = (db) => {
  return (req, res, next) => {
    let teamId = req.slapp.meta.team_id

    db.getTeam(teamId, (err, team) => {
      if (err) {
        console.error(err)
        return res.send(err)
      }

      req.slapp.meta = Object.assign(req.slapp.meta, {
        app_token: team.access_token,
        bot_token: team.bot.bot_access_token,
        bot_user_id: team.bot.bot_user_id,
        team_name: team.team_name
      })

      next()
    })
  }
}
