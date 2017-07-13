let express = require('express')
let Busboy = require('busboy')
let md5 = require('md5');

let router = express.Router()

let storage_servers = [[]]

function choose_server(name){
    let server_set = Number.parseInt(md5(name), 16) % storage_servers.length
    if(Array.isArray(server)){
        return Number.parseInt(md5('~'+name), 16) % server_set.length
    }else{
        return server_set
    }
}

router.post('/upload', (req, res)=>{
    let busboy = new Busboy({headers: req.headers, limits: {files: 1}})
    busboy.on('filesLimit', ()=>{
        res.status(404).end('too many files.')
    })
    busboy.on('file', (fieldname, file, filename, encoding, mimetype)=>{
        let server = choose_server(filename)
        let url = req.portocol+'://'+server+req.originalUrl
        res.redirect(307, url)
    })
    busboy.on('finish', ()=>{
        res.status(404).end('no file found.')
    })
})

router.get('/download', (req, res)=>{
    let filename = res.query.id
    let server = choose_server(filename)
    let url = req.portocol+'://'+server+req.originalUrl
    res.redirect(url)
})

router.get('/files', (req, res)=>{
    res.end(JSON.stringify(['*']))
    // TODO: fetch files from all server
})

module.exports = storage_servers_ => {
    storage_servers = storage_servers_ || storage_servers
    return router
}