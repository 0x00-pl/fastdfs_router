let express = require('express')
let Busboy = require('busboy')
let fs = require('fs')
let path = require('path')

let router = express.Router()

module.exports = function (storage_path) {
    storage_path = storage || './upload'

    router.post('/upload', (req, res)=>{
        let busboy = new Busboy({headers: req.headers})
        busboy.on('file', (fieldname, file, filename, encoding, mimetype)=>{
            let saveto = path.join(storage_path, filename)
            file.pipe(fs.createWriteStream(saveto))
        })
        busboy.on('finish', ()=>{
            res.set('Access-Control-Allow-Origin', '*').end()
        })
        req.pipe(busboy)
    })

    router.get('/download', (req, res)=>{
        let loadfrom = path.join(storage_path, res.query.id)
        res.set('Access-Control-Allow-Origin', '*')
            .download(loadfrom)
    })

    router.get('/files', (req, res)=>{
        fs.readdir(storage_path, (err, files)=>{
            if(err){
                res.status(500).end(err)
            }else{
                res.set('Access-Control-Allow-Origin', '*')
                    .end(JSON.stringify(files))
            }
        })
    })

    return router
}
