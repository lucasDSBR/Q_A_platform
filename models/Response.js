const Sequelize = require('sequelize');
const connection = require('../database/database');

const Response  = connection.define('responses', {
	body: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	questionId: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
});
Response.sync({force: false}).then(() => {})

module.exports = Response;