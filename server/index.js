const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

var handlePrompt = require('./routes/handlePrompts');

app.use(cors());
app.use(bodyParser.json());

require('./dbconnection');

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

app.post('/add', handlePrompt.add);
app.post('/read', handlePrompt.read);
app.post('/edit/:id', handlePrompt.edit);
app.post('/delete/:id', handlePrompt.delete);