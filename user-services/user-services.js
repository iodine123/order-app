const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const sequelize = require('./config/database');
const { DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

// Define the User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sync database
sequelize.sync({ force: true }).then(() => console.log('User DB and table synced'));

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.json({ message: 'User registered', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ username }, 'secretkey');
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

const PORT = 4001;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
