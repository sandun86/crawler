const _ = require("lodash");

const locationModel = require("./model/locations");

const getLocations = async () => {
	const fetchLocations = await locationModel.fetchAll();
	return _.map(fetchLocations, "name");//return only the location names
};

module.exports = {
    getLocations
}