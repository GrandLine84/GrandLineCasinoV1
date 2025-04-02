const mysql = require('mysql2/promise');

// const connection = mysql.createPool({
//     host: '217.21.94.191',
//     user: 'u736549907_diuwin',
//     password: 'Kunal292911n@',
//     database: 'u736549907_diuwin',
// });

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Manavsharma1$',
    database: 'GLCDB',
});
module.exports = connection;
