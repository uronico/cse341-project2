require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const app = express();
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 8080;

console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID);
console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET);
console.log('CALLBACK_URL:', process.env.CALLBACK_URL);

// Middleware for parsing JSON
app.use(bodyParser.json());

// Session middleware with MongoStore
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL, // Use your MongoDB connection string
        collectionName: 'sessions'
    })
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// CORS middleware
app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use(cors({ origin: '*' }));

// Configure GitHub strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    // Save user to database or perform any other operations
    return done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? 'Logged In as ${req.session.user.displayName}' : 'Logged Out') });

// Routes
app.use('/', require('./routes'));

// Error handling for uncaught exceptions
process.on('uncaughtException', (err, origin) => {
    console.error(`Caught exception: ${err}\nException origin: ${origin}`);
});

// Initialize database and start server
mongodb.initDb((err) => {
    if (err) {
        console.error(err);
    } else {
        app.listen(port, () => {
            console.log(`Database is connected and server is running on port ${port}`);
        });
    }
});