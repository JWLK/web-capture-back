const express = require('express')
const cors = require('cors')
const base64Img = require('base64-img')
const bodyParser = require('body-parser')
const fs = require('fs')
const https = require('https')

const app = express()
const ports = {
    https: 3000,
}
const httpsOptions = {
    key: fs.readFileSync('./cert/localhost.key'),
    cert: fs.readFileSync('./cert/localhost.crt'),
    requestCert: false,
    rejectUnauthorized: false,
}
/**
 * Cors : Cross Origin Resource Sharing
 */
let corsOption = {
    // origin: 'https://localhost:3443', // 허락하는 요청 주소
    origin: true,
    credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가됨.
}
app.use(cors(corsOption))

/**
 * Middleware
 */
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.static('./routes/images'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))

/**
 * Routes
 */
app.get('/', (req, res) => {
    res.status(200).json({
        name: 'BackEnd',
        type: '4',
        Cookies: req.cookies,
    })
})

app.post('/upload', (req, res) => {
    console.log('upload')
    const { imgSrc } = req.body
    base64Img.img(imgSrc, './routes/images', Date.now(), function (err, filepath) {
        const pathArr = filepath.split('/')
        const fileName = pathArr[pathArr.length - 1]
        // res.status(200).json({
        //     sucess: true,
        //     url: `http://127.0.0.1:${PORT}/${fileName}`,
        // });
        res.status(200).json({
            result: `http://127.0.0.1:${ports.https}/${fileName}` + '\nTrue\n[7,167,26]\n[7,167,26]\n[7,167,26]\n',
        })
    })
})

/** Default **/
const defaultRouter = require('./routes/default')
app.use('/default', defaultRouter)

/** Checker **/
const checkerRouter = require('./routes/checker')
app.use('/checker', checkerRouter)

/**
 *
 * Start listening
 *
 */

/** 404 **/
app.use((req, res, next) => {
    res.status(404).send('Sorry cant find that!')
})

/** Error **/
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const appHttps = https.createServer(httpsOptions, app)
appHttps.listen(ports.https, () => {
    console.log(`Listening for requests on PROT ${ports.https}`)
})
