const express = require('express')
const app = express()
const apiRouter = require('./routes/index');
//const jobs = require('./jobs/index')
apiRouter(app);
//jobs();
app.listen(8080, () => console.log('Server listening on port 8080!'))
