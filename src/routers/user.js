const express = require('express')
const UserModel = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/register', async (req, res) => {
    const user = new UserModel(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await UserModel.findByMyData(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    }
    catch (e) {
        res.status(401).send(e)
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('loged out')
    }
    catch (e) {
        res.status(500).send()
    }
})

module.exports = router


