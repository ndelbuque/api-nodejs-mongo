const mongoose = require('mongoose')

mongoose.createConnection = () => {
  if (!mongoose.connection.readyState) {
    return mongoose.connect('mongodb://localhost/noderest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
      .then(() => console.log('Connected to MongoDB'))
      .catch(() => setTimeout(mongoose.createConnection, 3000))
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected...')
  return setTimeout(mongoose.createConnection, 10000)
})

module.exports = mongoose
