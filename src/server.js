require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/configEngine');
const routes = require('./routes/web');
const cronJobController = require('./controllers/cronJobContronler'); // Fixed typo?
const socketIoController = require('./controllers/socketIoController');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const useragent = require('express-useragent'); // For bot detection
const rateLimit = require('express-rate-limit'); // For rate limiting
const helmet = require('helmet'); // Security headers

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

// ========== 🔒 SECURITY MIDDLEWARES ========== //
app.use(helmet()); // Adds security headers (XSS, CSP, etc.)
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express()); // Detect bots via User-Agent

// ========== 🚫 BLOCK BOTS & CRAWLERS ========== //
app.use((req, res, next) => {
    const bots = [
        'googlebot', 'bingbot', 'yandexbot', 'duckduckbot',
        'slurp', 'baiduspider', 'facebot', 'ia_archiver',
        'ahrefsbot', 'semrushbot', 'mj12bot', 'dotbot'
    ];

    const isBot = bots.some(bot => req.useragent.source.toLowerCase().includes(bot));

    if (isBot) {
        return res.status(403).send(`
            <h1>403 - Forbidden</h1>
            <p>Bots/crawlers are not allowed on this website.</p>
        `);
    }
    next();
});

// ========== ⏱️ RATE LIMITING (Prevent Brute Force) ========== //
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per IP
    message: 'Too many requests. Please try again later.'
});
app.use(limiter);

// ========== 🖥️ VIEW ENGINE & ROUTES ========== //
configViewEngine(app);
routes.initWebRouter(app);

// ========== ⏰ CRON JOBS & SOCKET.IO ========== //
cronJobController.cronJobGame1p(io); 
socketIoController.sendMessageAdmin(io);

// ========== 🚀 START SERVER ========== //
server.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});