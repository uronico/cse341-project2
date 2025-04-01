require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const app = express();
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app
.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}))
// This is the basic express session({..}) initialization
.use(passport.initialize())

// init passport on every route call
.use(passport.session())


app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }))
.use(cors({ origin: '*' }))
.use('/', require('./routes/index.js'));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        // Save user to database or perform any other operations
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? 'Logged In as ${req.session.user.displayName}' : 'Logged Out') });

app.use('/', require('./routes'));

process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
  });

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }

    else {
        app.listen(port, () => {console.log(`Database is listening and node is Running on port ${port}`)});
    }
})




