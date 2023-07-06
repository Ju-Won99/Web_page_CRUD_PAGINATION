const sql = require('mssql');
const config = {
    server : 'IP Number',
    port: DB_Port_Number,
    options: {encrypt:false, database: 'Northwind'},
    authentication: {
        type:"default",
        options:{
            userName:"DB_ID",
            password:"DB_PASSWORD"
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
