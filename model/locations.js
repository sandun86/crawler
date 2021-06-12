const util = require("util");
const db = require("../config/db");

const location = {
	fetchAll: (next) => {
		const query = "SELECT name FROM locations";
		db.query(query, null, next);
	},
};

module.exports = {
	fetchAll: util.promisify(location.fetchAll),
};

