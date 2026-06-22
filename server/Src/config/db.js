const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    })

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected')
    })

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected — attempting reconnect')
    })

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err)
    })

  } catch (error) {
    console.error('Initial MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB;