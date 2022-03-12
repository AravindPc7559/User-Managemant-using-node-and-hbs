var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./config/connection');
const port = 3000;
const hbs = require('hbs')
const session = require('express-session');

var adminRouter  = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret : "Hello",cookie:{maxAge:1000 * 60 * 60 * 24}}));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

//Database Connection.
db.connect((err)=>{
  if(err){
    console.log("Connection Error");
  }else{
    console.log("Database Connected successfull to 27017");
  }
})


app.use('/admin', adminRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port,()=>console.log("Server running on 3000"));

module.exports = app;
