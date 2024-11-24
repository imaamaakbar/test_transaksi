const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');
const router = require('./routes/apiRoutes');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Untuk JSON
app.use(express.json());

// Untuk form-urlencoded
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static(path.join(__dirname, 'public/uploads')));
// Routes
app.use('',router);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
