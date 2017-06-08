const app         = require('express')();
const bodyParser  = require('body-parser');
const jwt         = require('jsonwebtoken');

const passport    = require('passport');
const passportJWT = require('passport-jwt');

const extractJwt  = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const users = [
  {
    id: 1,
    name: 'hector',
    password: 'welcome1'
  }
];

const jwtOptions = {
  jwtFromRequest: extractJwt.fromAuthHeader(),
  secretOrKey: '123456'
};

const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {

  let user = users.find(user => jwtPayload.id == user.id);
  
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

app.use(passport.initialize());

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({message: 'Express is up!'});
});

app.post('/login', (req, res, next) => {
  const {
    name, 
    password
  } = req.body;
  
  if (!name || !password) {
    res.status(400).json({message:'Provide name and password'});
    return next();
  }

  let user = users.find(user => user.name == name);

  if (!user) {
    res.status(401).json({message:'no such user found'});
    return next();
  }

  if (user.password !== password) {
    res.status(401).json({message:'passwords did not match'});
    return next();
  }
  
  // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
  let payload = {id: user.id};
  let token = jwt.sign(payload, jwtOptions.secretOrKey);
  res.json({ token: token });
});

app.get('/secret', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    res.json({message: 'Success! You can not see this without a token'});
});

app.listen(3000, () => console.log('Express running'));