var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require("connect-flash");
var session = require("express-session");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var request = require('./routes/request');
var toilet = require('./routes/toilet');

var User = require('./app/models/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// passport が ユーザー情報をシリアライズすると呼び出されます
passport.serializeUser(function (id, done) {
    done(null, id);
});

// passport が ユーザー情報をデシリアライズすると呼び出されます
passport.deserializeUser(function (id, done) {
    User.findById(id, (error, user) => {
        if (error) {
            return done(error);
        }
        done(null, user);
    });
});

// passport における具体的な認証処理を設定します。
passport.use(
    "local",
    new LocalStrategy({
        usernameField: "name",
        passwordField: "password",
        passReqToCallback: true
    }, function (request, name, password, done) {
        process.nextTick(() => {
            User.findOne({
                'name': name
            }, function (error, user) {
                if (error) {
                    return done(error);
                }
                if (!user || user.password != password) {
                    return done(null, false, request.flash("message", "Invalid username or password."));
                }
                // 保存するデータは必要最低限にする
                return done(null, user._id);
            });
        });
    })
);

// passport設定
app.use(session({
    secret: "some salt",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/request', request);
app.use('/toilet', toilet);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        request_link: '/',
        status_link: '/',
        log_link: '/'
    });
});

module.exports = app;
