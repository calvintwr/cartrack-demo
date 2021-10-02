import express from 'express'

const router = express.Router()

router.get('/', (req, res, next) => {
    res.send({
        success: true,
        data: 'Welcome to cartrack-demo.'
    })
})

export default router