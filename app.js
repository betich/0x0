const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const port = 3040;


app.set('view engine', 'pug');

app.use(express.static('files'));
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 4 * 1024 * 1024 * 1024 //4MB max file(s) size
  },
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('oh hi :O');
})

.post('/', async (req, res) => {
  let hash = s => crypto.createHash('sha256').update(s).digest('base64').slice(0, 5);
  try {
    if (!req.files) {
      res.send('no file uploaded');
    } else if (!req.files.photo.name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      res.send('upload an image file');
    } else {
        let photo = req.files.photo;
        let photoName = hash(photo.name) + photo.name.match(/\.[^.]*$/).join('');
        
        photo.mv('./files/' + photoName);

        res.send(`http://localhost:${port}/${photoName}`);
    }
  } catch (err) {
    res.status(500).send(err);
  }
})

.get('/:id', (req, res) => {
  res.send(req.params.id);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
});