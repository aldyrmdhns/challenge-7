if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const route = require('./src/routes/mailRoute');
const errorHandler = require('./src/middleware/errorHandler');
const app = express();
const PORT = 9090;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1', route);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`-> Listening on Port: ${PORT}`);
});

