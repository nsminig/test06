const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views'); 
const HTTP_PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.urlencoded({ extended: true }));

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}


app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});



app.get('/profile', isAuthenticated, (req, res) => {
  const user = req.session.user;
  res.render('profile', {
    name: user.name,
    email: user.email,
    password: user.password
  });
});



app.get('/login', (req, res) => {
  res.render('login', { errorMsg: null }); 
  
});




app.post('/login', (req, res) => {
  const { username, password } = req.body; 

  const user = {
    name: 'John Doe',
    username: 'JohnDoe',
    email: 'john@example.com',
    password: '1234'

    
  };

  if (username === 'JohnDoe' && password === '1234') {
    req.session.user = user; 
    res.redirect('/profile');
  } else {
    res.render('login', { errorMsg: 'Invalid username or password' });
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/profile');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

app.use(express.static('public'));

app.listen(HTTP_PORT, () => {
  console.log(`Server listening on port ${HTTP_PORT}`);
});
