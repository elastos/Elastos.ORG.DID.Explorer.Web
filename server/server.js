const express = require('express')
const app = express()
const apiRouter = require('./routes/index');
apiRouter(app)
app.listen(8080, () => console.log('Server listening on port 8080!'))
