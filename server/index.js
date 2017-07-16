const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const app = express();
const Sequelize = require('sequelize');
const User = require('./models/users.js');
const Task = require('./models/tasks.js');
const Admin = require('./models/admin.js');
const Association = require('./models/associations.js')
const _ = require('underscore');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sessionStore = new session.MemoryStore();
const passport = require('passport')
const Strategy = require('passport-facebook').Strategy
console.log(process.env.clientID)
console.log(process.env.clientSecret)
console.log(process.env.sessionSecret)
console.log(process.env.callbackURL)

passport.use(new Strategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL,
    profileFields: ['id', 'displayName', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({where: {email: profile.emails[0].value}}).then(function(user, err) {
      process.nextTick(function () {
        return cb(null, profile);
      });
    });
  }
));

passport.serializeUser(function(req, user, done) {
  done(null, user.emails[0].value);
});
passport.deserializeUser(function(req, obj, done) {
  sessionStore.set(req.sessionID, req.session)
  done(null, obj);
});

app.use(morgan('combined', {skip: (req) => req.url === '/api/v1/status'}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: process.env.sessionSecret, store: sessionStore, cookieName: 'timeapp'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../login.html'))
})

app.use('/dist', isLoggedIn, express.static(path.join(__dirname, '../dist/')));
app.get('/home', isLoggedIn, function(req, res){
  res.cookie('timeapp', req.sessionID)
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/home', failureRedirect: '/' }))

app.get('/tasks', getAllTasks)
app.post('/createOrUpdateTask', createOrUpdateTask)

app.listen(3000, function () {
  console.log('Fun listening on port 3000!');
});

function getAllTasks(req, res) {
  sessionStore.get(req.cookies['timeapp'], function(sid, session) {
    User.find({where: {email:session.passport.user}, include: [Admin]}).then(function(adminsUsers) {
      if (adminsUsers.dataValues.Admins.length > 0) {
        let allUsers = [];
        adminsUsers.dataValues.Admins.forEach(function(user) {
          allUsers.push(user.dataValues.user_ID)
        });
        Task.findAll({where: {user_ID: allUsers}}).then(function(record){
          const allTasks = [];
          _.forEach(record, function(task) {
            allTasks.push({id: task.dataValues.id, description: task.dataValues.description, time: task.dataValues.time, updatedTime: task.dataValues.updatedAt})
          })
          return res.json(allTasks);
        })
      } else {
        Task.findAll({where: {user_ID: adminsUsers.dataValues.id}}).then(function(record) {
          if (record) {
            const allTasks = [];
            _.forEach(record, function(task) {
              allTasks.push({id: task.dataValues.id, description: task.dataValues.description, time: task.dataValues.time, updatedTime: task.dataValues.updatedAt})
            })
            return res.json(allTasks);
          } else {
            return res.send(500, "Error");
          }
        });
      }
    })
  })
}

function createOrUpdateTask(req, res) {
  sessionStore.get(req.cookies['timeapp'], function(sid, session) {
    if (req.body.id) {
      Task.update(
        {description: req.body.description, time: req.body.time},
        {where: {id: req.body.id}})
      .then(function() {
        return res.json();
      })
    } else {
      User.find({where: {email: session.passport.user}}).then(function(user) {
        Task.create({description: req.body.description, time: req.body.time, user_ID: user.dataValues.id}).then(function(){
          return res.json();
        })
      })
    }
  })
}

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
