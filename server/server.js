const express = require('express')
const app = express()
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);
app.listen(8080, () => console.log('Server listening on port 8080!'))
