const database = require('./database')
const app = require('./app')

const PORT = process.env.PORT || 3000

database.createConnection()

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
