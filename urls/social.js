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
        clientID: "259516958244-2stgc0ecsu1m4sac922i8sdsdsl8oblb.apps.googleusercontent.com",
        clientSecret: "_dyBvosP0cz6NrTx3Lj_Kz7h",
        callbackURL: "http://api.diamarket.co/v1/social/google/callback"
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
            await UserController.create(userData)
        }
    }
))
passport.use(new FacebookStrategy({
        clientID: '738884009925990',
        clientSecret: 'a27242979ab5ccafda528d99ad704de5',
        callbackURL: 'http://api.diamarket.co/v1/social/facebook/callback',
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
        console.log(user)
        const auth = await AuthController.createTokenSocial(user.data)
        response.json(auth)
    }, 1000);

})

routes.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }))
routes.get('/google/callback', passport.authenticate('google'), async(request, response) => {
    setTimeout(async function() {
        const user = await UserController.detail({ email: request.user.email })
        const auth = await AuthController.createTokenSocial(user.data)
        response.json(auth)
    }, 1000)

})

module.exports = routes