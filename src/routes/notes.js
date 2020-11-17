const express = require('express')
const router = express.Router()

const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note')
})

router.post('/notes/new-note', isAuthenticated, async(req, res) => {
    const { title, description } = req.body
    const errors = []
    if (!title) {
        errors.push({text: "Por favor ingrese un titulo"})
    }
    if (!description) {
        errors.push({text: "Por favor ingrese una descripción"})
    }
    if(errors.length > 0){
        res.render('notes/new-note', {
            errors,
            title,
            description
        })
    }
    else {
        const newNote = new Note({ title, description })
        newNote.user = req.user.id
        await newNote.save()
        req.flash('succes_msg', 'Curso agregado exitosamente.')
        res.redirect('/notes')
    }
})

router.get('/notes', isAuthenticated, async(req,res) => {
    const notes = await Note.find({user: req.user.id }).sort({date: 'desc'}).lean()
    res.render('notes/all-notes', { notes })
})

router.get('/notes/edit/:id', isAuthenticated, async(req, res) => {
    const note = await Note.findById(req.params.id).lean()
    res.render('notes/edit-note', {note})
})

router.put('/notes/edit-note/:id', isAuthenticated, async(req,res) => {
    const { title, description } = req.body
    await Note.findByIdAndUpdate(req.params.id, { title, description }).lean()
    req.flash('succes_msg', 'Curso actualizado exitosamente.')
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated, async(req, res) => {
    await Note.findByIdAndDelete(req.params.id)
    req.flash('succes_msg', 'Curso eliminado exitosamente.')
    res.redirect('/notes')
})

module.exports = router