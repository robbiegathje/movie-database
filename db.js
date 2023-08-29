const { Client } = require('pg');

let DB_URI = '';

if (process.env.NODE_ENV === 'test') {
	DB_URI = 'postgresql:///movies_test';
} else {
	DB_URI = process.env.DATABASE_URL || 'postgresql:///movies';
}

if (DB_URI.startsWith('postgres://')) {
	DB_URI = DB_URI.replace('postgres://', 'postgresql://');
}

let db = new Client({
	connectionString: DB_URI,
});

db.connect();

module.exports = db;
