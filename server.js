
const express = require('express')
// const bodyParser = require('body-parser')
// const morgan = require('morgan')
const session = require('express-session')
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

const app = express()


// Passport Config
require('..passport/config/passport')(passport);

// MIDDLEWARE
// Passport 
app.use(passport.initialize());
app.use(passport.session());


// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


  const PORT = process.env.PORT || 5000;

// Express body parser
app.use(express.urlencoded({ extended: true }));


// Sessions
app.use(
	session({
	  secret: 'secret',
	  resave: true,
	  saveUninitialized: true
	})
  );

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/user.js'));

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Starting Server 

app.listen(PORT, console.log(`Server started on port ${PORT}`));
