const fs = require("fs");
const readline = require("readline");

const keywordFile = "./assests/keywords.txt";
const outputFile = "./assests/output.txt";

const saveDataToFile = (results) => {
	for (const result of results) {
		fs.appendFileSync(
			outputFile,
			`URL: ${result.url}\nKeywords found: ${result.keywords}\nLocations mentioned: ${result.locations}\n \n`
		);
	}
	console.log("-----------COMPLETED-----------");
};

const readKeyWordsFromFile = async () => {
	//used this method to less time consumption
	const fileStream = fs.createReadStream(keywordFile);

	const readlineContents = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	const keywords = [];
	for await (const keyword of readlineContents) {
		keywords.push(keyword);
	}

	return keywords;
};

module.exports = {
	saveDataToFile,
	readKeyWordsFromFile,
};
