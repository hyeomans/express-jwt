const app         = require('express')();
const bodyParser  = require('body-parser');

const passport    = require('passport');

const jwtMiddleware = require('./jwtMiddleware')(app, passport);

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({message: 'Express is up!'});
});

app.post('/login', jwtMiddleware);

app.get('/secret',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({message: 'Success! You can not see this without a token'});
});

app.listen(3000, () => console.log('Express running'));
