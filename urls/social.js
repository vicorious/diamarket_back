'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const UserController = require('../controllers/userController')
const AuthController = require('../controllers/authController')
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
})

passport.deserializeUser(function(obj, done) {
    done(null, obj);
})
passport.use(new GoogleStrategy({

        clientID: "618036118210-4avg9o6c7bmmkbkum9gm7mdth0pojn0p.apps.googleusercontent.com",
        clientSecret: "-BnW47K9-FtHr7Ha4AdInlYx",
        callbackURL: `http://api.diamarket.co/v1/social/google/callback`
    },
    async function(accessToken, refreshToken, profile, done) {
        const { email, picture } = profile._json
        const { id, displayName } = profile
        const userData = {
            name: displayName,
            identidication: id,
            email,
            cellphone: '',
            password: '123456',
            images: picture,
            rol: 'client',
            isActive: true
        }
        done(null, userData)
        const user = await UserController.detail({ email })
        if (!user.data._id) {
            const userCreate = await UserController.create(userData)
        }
    }
))

passport.use(new FacebookStrategy({
        clientID: '534067730778763',
        clientSecret: '0e6eeaeaf1b83c0b69433c64246d319a',
        callbackURL: `http://api.diamarket.co/v1/social/facebook/callback`,
        profileFields: ['id', 'displayName', 'link', 'photos', 'email'],
        enableProof: true
    },
    async function(accessToken, refreshToken, profile, done) {
        const { id, name, provider, email } = profile._json
        const image = profile._json.picture.data.url
        const userData = {
            name: name,
            identidication: id,
            email,
            cellphone: '',
            password: '123456',
            images: image,
            rol: 'client',
            isActive: true
        }
        done(null, userData)
        const user = await UserController.detail({ email })
        if (!user.data._id) {
            await UserController.create(userData)
        }
    }
))

const routes = asyncify(express.Router())

routes.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))
routes.get('/facebook/callback', passport.authenticate('facebook'), async(request, response) => {
    setTimeout(async function() {
        const user = await UserController.detail({ email: request.user.email })
        const auth = await AuthController.createTokenSocial(user.data)
        const redirection = `/v1/social/facebooktoken?token=${auth.data.token}`
        response.redirect(redirection)
    }, 1000)
})
routes.get('/facebooktoken', async(request, response) => {
    response.json({})
})

routes.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }))
routes.get('/google/callback', passport.authenticate('google'), async(request, response) => {
    setTimeout(async function() {
        const user = await UserController.detail({ email: request.user.email })
        const auth = await AuthController.createTokenSocial(user.data)
        const redirection = `/v1/social/googletoken?token=${auth.data.token}`
        response.redirect(redirection)
    }, 1000)
})
routes.get('/googletoken', async(request, response) => {
    response.json({})
})



module.exports = routes