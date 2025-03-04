import app from './index'
import mongoose from 'mongoose'

// Database and Server Connection
const PORT = process.env.PORT || 5000
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Database connected')
    app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}`)
      )
  })
  .catch(err => console.error(err))
