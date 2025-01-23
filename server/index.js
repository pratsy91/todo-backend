const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to database
connectDB();

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const buildPath = path.join(__dirname, '../client/build');
  
  // Log to verify the build path
  console.log('Build path:', buildPath);
  
  app.use(express.static(buildPath));

  // Handle React routing, return all requests to React app
  app.get('/*', function(req, res) {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running');
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 