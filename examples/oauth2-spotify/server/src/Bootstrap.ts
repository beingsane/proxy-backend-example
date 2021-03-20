import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import passport from 'passport'
import { Strategy as SpotifyStrategy, StrategyOptions } from 'passport-spotify'

// Extra package for refreshing
import refresh from 'passport-oauth2-refresh'

const spotifyStrategyOptions: StrategyOptions = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: '/auth/spotify/callback',
}

export function Bootstrap() {
  const app = express()

  const spotifyStrategy = new SpotifyStrategy(
    spotifyStrategyOptions,
    (accessToken, refreshToken, profile, cb) => {
      cb(null, { accessToken, refreshToken })
    }
  )

  passport.use(spotifyStrategy)
  // @ts-ignore
  refresh.use(spotifyStrategy)

  app.use(cors())
  app.use(passport.initialize())

  app.get('/auth/spotify', passport.authenticate('spotify', { session: false }))
  app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { session: false }),
    (req, res) =>
      res.redirect(
        // @ts-expect-error Request does not know about user
        `http://localhost:3000?accessToken=${req.user.accessToken}&refreshToken=${req.user.refreshToken}`
      )
  )
  app.get('/auth/refresh', (req, res) => {
    refresh.requestNewAccessToken(
      'spotify',
      // @ts-ignore
      req.query.refreshToken,
      // @ts-ignore
      (err, accessToken) => {
        if (err) {
          console.log(err)
          return
        }

        res.json({ accessToken })
      }
    )
  })

  app.listen(process.env.PORT, () =>
    console.log(`server is running on http://localhost:${process.env.PORT}`)
  )

  return app
}

Bootstrap()
