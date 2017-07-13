
let express = require('express')
let path = require('path')

let router = express.Router()

router.use('/', express.static(path.join(__dirname, '/index.html')))

module.exports = router
