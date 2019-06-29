const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.use('/css', express.static(path.join(__dirname, '/public/css')));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Routes
app.use('/', require(path.join(__dirname, '/routes/index')));
app.use('/users', require(path.join(__dirname, '/routes/users')));



const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`App listening on port ${PORT}`));