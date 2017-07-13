let express = require('express')
let Busboy = require('busboy')
let fs = require('fs')
let path = require('path')

let router = express.Router()

let storage_path = './storage'

router.post('/upload', (req, res)=>{
    let busboy = new Busboy({headers: res.headers})
    busboy.on('file', (fieldname, file, filename, encoding, mimetype)=>{
        let saveto = path.join(storage_path, filename)
        file.pipe(fs.createWriteStream(saveto))
    })
    busboy.on('finish', ()=>{
        res.end()
    })
    req.pipe(busboy)
})

router.get('/download', (req, res)=>{
    let loadfrom = path.join(storage_path, res.query.id)
    res.download(loadfrom)
})

router.get('/files', (req, res)=>{
    fs.readdir(storage_path, (err, files)=>{
        if(err){
            res.status(500).end(err)
        }else{
            res.end(JSON.stringify(files))
        }
    })
})

module.exports = storage_path_ => {
    storage_path = storage_path_ || storage_path
    return router
}
