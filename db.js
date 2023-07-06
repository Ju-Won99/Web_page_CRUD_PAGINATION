const sql = require('mssql');
const config = {
    server : '192.168.1.160',
    port: 1433,
    options: {encrypt:false, database: 'Northwind'},
    authentication: {
        type:"default",
        options:{
            userName:"user999",
            password:"1234"
        }
    }
};

const pool = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL')
        return pool
    })
    .catch(err => console.log('Database Connection Failed! Bad config: ', err))

module.exports = {
    sql, pool
}