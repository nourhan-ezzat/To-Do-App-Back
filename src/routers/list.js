const express = require('express')
const ListModel = require('../models/list')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/lists', auth, async (req, res) => {
    const list = new ListModel({
        ...req.body,
        owner: req.user._id
    })
    try {
        await list.save()
        res.send(list)
    } catch (e) {
        res.send(e)
    }
})

router.get('/lists', auth, async (req, res) => {
    try {
        console.log(req.user._id)
        const lists = await ListModel.find({ owner: req.user._id })
        res.send(lists)
    }
    catch (e) {
        res.send(e)
    }
})

router.get('/lists/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const list = await List.findOne({ _id, owner: req.user._id })
        if (!list) return res.send('not found')
        res.send(list)
    }
    catch (e) {
        res.send()
    }
})

router.patch('/lists/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) return res.send({ error: 'invalid updates' })
    try {
        const list = await ListModel.findOne({ _id: req.params.id, owner: req.user._id })
        if (!list) return res.send('not found')
        updates.forEach((update) => list[update] = req.body[update])
        await list.save()
        res.send(list)
    }
    catch (e) {
        res.send(e)
    }
})

router.delete('/lists/:id', auth, async (req, res) => {
    try {
        const list = await ListModel.findOne({ _id: req.params.id, owner: req.user._id })
        if (!list) return res.send('not found')
        await list.remove()
        res.send('deleted')
    }
    catch (e) {
        res.send()
    }
})

module.exports = router