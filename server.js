const express = require('express');
var app = express();

// Cors
const cors = require('cors');
app.use(cors());

// Body-parser Middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Express-session
const session = require('express-session');
app.use(session({
    secret: 'local',
    saveUninitialized: true,
    resave: true
}));

// Express-flash
const flash = require('express-flash');
app.use(flash());

// Method-override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Global variables
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// Path
const path = require('path');

// Serve Static Resources
app.use('/public', express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));

// Database
const { sequelize } = require('./config/database');
const { error } = require('console');
sequelize.authenticate().then(() => {
    console.log("Connection established successfully.");
}).catch((error) => {
    console.log('Unable To Connect Database.', error);
});

global.blacklistedTokens = new Set();

// Routes 
// Admin API Route
const adminApiRoutes = require('./routes/admin/api');
// app.use('/api/admin', adminApiRoutes);

// API Route
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// 404 Route
app.use((req, res, next) => {
    res.render('pages/404');
});

// View Engine Setup
app.set('views', 'views');
app.set('view engine', 'ejs')

// Server Listen 
let PORT = process.env.PORT || 4888;
let HOST = process.env.PORT || '127.0.0.1';

app.listen(PORT, HOST, (error)=>{
    if (error) {
        throw error;
    }
    console.log(`Server is listen at http://${HOST}:${PORT}`);
})

