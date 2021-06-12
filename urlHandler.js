const cheerio = require("cheerio");
const fetch = require("node-fetch");

const getSubLinks = async (body, thisUrl) => {
	const thisHostName = getHostName(thisUrl);

	const subLinks = body
		.find("a")
		.map((i, link) => link.attribs.href)
		.get();

	return subLinks.filter((subLink) => {
		if (subLink.indexOf("https://") !== -1 || subLink.indexOf("http://") !== -1) {//validate the link
            let subPathName = new URL(subLink);
			const subHostName =
            subPathName && subPathName.hostname.includes("www.")
            ? subPathName.hostname.replace("www.", "")
            : subPathName.hostname;
			if (subHostName !== thisHostName) {
				return subLink.includes("https://") || subLink.includes("http://");
			}
		}
	});
};

const getHostName = (url) => {
	let thisPathName = new URL(url);
	const thisHostName = thisPathName.hostname.includes("www.")
		? thisPathName.hostname.replace("www.", "")
		: thisPathName.hostname;

	return thisHostName;
};

const fetchFromUrl = async (url) => {
	const response = await fetch(url);
	const html = await response.text();

	const $ = cheerio.load(html);
	const body = $("body");

	return body;
};

const filterBodyContent = async (body, tags) => {
	const output = body.find(tags).text();
	return output;
};

module.exports = {
	getSubLinks,
	getHostName,
    fetchFromUrl,
    filterBodyContent,
};
