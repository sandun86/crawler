const { URLS } = require("./config/constant");
const { getLocations } = require("./dbHandler");
const { saveDataToFile, readKeyWordsFromFile } = require("./fileHandler");
const { getSubLinks, getHostName, fetchFromUrl, filterBodyContent } = require("./urlHandler");

const searchContent = async (textContent, keyWords, locations) => {
	let includedKeyWords = [];
	let includedLocations = [];
	keyWords.map((keyword) => {
		if (textContent.toLowerCase().indexOf(keyword.toLowerCase().trim()) !== -1) {
			//faster method, check the keyword
			return includedKeyWords.push(keyword.trim());
		}
	});

	locations.map((location) => {
		if (textContent.toLowerCase().indexOf(location.toLowerCase().trim()) !== -1) {
			return includedLocations.push(location.trim());
		}
	});

	return { includedLocations, includedKeyWords };
};

const processCrawler = async (keyWords, locations, thisUrl, isMainLink = false) => {
	try {
		//compare with existing urls
		if (processedLinks.includes(getHostName(thisUrl))) {
			return;
		}
		const body = await fetchFromUrl(thisUrl);
		const validContent = await filterBodyContent(body, "body p, h1, h2, h3, h4, h5, h6");//filter content

		const searchContents = await searchContent(validContent, keyWords, locations);
		processedLinks.push(getHostName(thisUrl));//push url to another array to track the processed

		if (searchContents.includedLocations.length > 0 && searchContents.includedKeyWords.length > 0) {
			count++;
			finalOutput.push({
				url: thisUrl,
				keywords: searchContents.includedKeyWords.filter((item) => !!item).join(","),
				locations: searchContents.includedLocations.filter((item) => !!item).join(","),
			});
			if (count >= 5) { //End the process if it is reached the counted value
				saveDataToFile(finalOutput);
				process.exit(0);
			}
		}

		if (isMainLink) {
			const subLinks = await getSubLinks(body, thisUrl);

			let index = 0;
			while (index <= subLinks.length - 1) {
				//check content in subLinks
				contentFound = await processCrawler(keyWords, locations, subLinks[index], false);
				index++;
			}
		}
	} catch (err) {
		console.log("ERROR:", err.message);
	}
};

const crawlStart = async () => {
	console.log("-----------Processing----------");
	const [keyWords, locations] = await Promise.all([readKeyWordsFromFile(), getLocations()]);
	for (const url of URLS) {
		processCrawler(keyWords, locations, url, true);
	}
};

let processedLinks = [];
let finalOutput = [];
let count = 0;

crawlStart();
