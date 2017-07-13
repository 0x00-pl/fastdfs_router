let express = require('express')
let path = require('path')

let tracker = require('../tracker')([['127.0.0.1:8091']])
let storage = require('../storage')(path.join(__dirname, '/upload'))
let client = require('../client')

let tracker_app = express()
tracker_app.use(tracker)
tracker_app.listen(8090)

let storage_app = express()
storage_app.use(storage)
storage_app.listen(8091)

let client_app = express()
client_app.use(client)
client_app.listen(8080)

