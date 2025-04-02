require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/configEngine'); // Fixed
const routes = require('./routes/web');
const cronJobController = require('./controllers/cronJobContronler'); // Fixed typo?
const socketIoController = require('./controllers/socketIoController');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);
routes.initWebRouter(app);
cronJobController.cronJobGame1p(io); 
socketIoController.sendMessageAdmin(io);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
