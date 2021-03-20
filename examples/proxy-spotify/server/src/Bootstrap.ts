import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import passport from 'passport'
import { Strategy as SpotifyStrategy, StrategyOptions } from 'passport-spotify'

const spotifyStrategyOptions: StrategyOptions = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: '/auth/spotify/callback',
}

export function Bootstrap() {
  const app = express()

  passport.use(
    new SpotifyStrategy(
      spotifyStrategyOptions,
      (accessToken, refreshToken, profile, cb) => {
        cb(null, { accessToken })
      }
    )
  )

  app.use(cors())
  app.use(passport.initialize())

  app.get('/auth/spotify', passport.authenticate('spotify', { session: false }))
  app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { session: false }),
    (req, res) =>
      // @ts-expect-error Request does not know about user
      res.redirect(`http://localhost:3000?token=${req.user.accessToken}`)
  )

  app.listen(process.env.PORT, () =>
    console.log(`server is running on http://localhost:${process.env.PORT}`)
  )

  return app
}

Bootstrap()
