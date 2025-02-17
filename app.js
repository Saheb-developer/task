const { error, log } = require('console');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  fs.readdir('./files', (err, files) => {
    res.render('index', {files:files});
  })
});

app.post('/create', (req, res) => {
  
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, 'utf8', (err) => {
    res.redirect('/');
  });
})

app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  fs.readFile(`./files/${filename}`, 'utf8', (err, fileData) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    } else {
      res.render('show', { fileData: fileData, fileName: filename });
    }

  });
});

app.get('/edit/:filename',(req, res) => {
  res.render('edit' , {fileName:req.params.filename})
})

app.post('/edit',(req, res) => {
  fs.rename(`./files/${req.body.previous}`,`./files/${req.body.newFileName}`, (err) => {
    console.log(err)
  })
  res.redirect('/')
})


app.listen(3000, () => {
  console.log('Server is in running on port 3000');
});