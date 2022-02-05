const express = require('express')
const router = express.Router()
const spawn = require('child_process').spawn
const base64Img = require('base64-img')
const path = require('path')
const dotenv = require('dotenv').config()

const routeName = 'checker'

router.get('/', async (req, res) => {
    try {
        var dataOrigin
        var elements0
        var elements1
        var elements2

        const result = spawn('python', ['./module/tracer.py', path.join(__dirname, '/images/sample_00.png')])
        result.stdout.on('data', (data) => {
            dataOrigin = data.toString()
            console.log(dataOrigin)
            var dataSplits = data.toString().split('\n', 3)
            // console.log(dataSplits);
            var re = ','
            elements0 = dataSplits[0].substring(1, dataSplits[0].length - 1).split(re)
            elements1 = dataSplits[1].substring(1, dataSplits[1].length - 1).split(re)
            elements2 = dataSplits[2].substring(1, dataSplits[2].length - 1).split(re)

            res.status(200).json(`/${routeName} : ` + elements0)
        })
    } catch (error) {
        res.status(400).json({ code: '400', error: error })
    }
})

router.post('/', async (req, res) => {
    // console.log('post request');
    try {
        const { imgSrc } = req.body
        // const result = spawn('python', ['./module/tracer.py', path.join(__dirname, imgSrc)]);
        base64Img.img(imgSrc, './routes/images', Date.now(), function (err, filepath) {
            const pathArr = filepath.split('/')
            const fileName = pathArr[pathArr.length - 1]
            const result = spawn('python', ['./module/tracer.py', `${process.env.SERVER}/${fileName}`])
            result.stdout.on('data', (data) => {
                dataOrigin = data.toString()
                console.log(dataOrigin)

                res.status(200).json({
                    result: dataOrigin,
                })
            })
        })
    } catch (error) {
        res.status(400).json({ code: '400', error: error })
    }
})

/**
 * End-Point
 */

module.exports = router
