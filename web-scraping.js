const axios = require("axios");
const cheerio = require("cheerio");

const urlList = [
  "https://admissions.unl.edu/majors/85/cob-accounting/",
  "https://admissions.unl.edu/majors/646/fpa-acting/",
  "https://admissions.unl.edu/majors/86/cob-actuarial-science/",
  "https://admissions.unl.edu/majors/32/anthropology/",
  "https://admissions.unl.edu/majors/606/arch-architecture/",
  "https://admissions.unl.edu/majors/170/fpa-art/",
  "https://admissions.unl.edu/majors/33/cas-biochemistry/",
  "https://admissions.unl.edu/majors/34/cas-biological-sciences/",
  "https://admissions.unl.edu/majors/158/eng-biological-systems-engineering/",
  "https://admissions.unl.edu/majors/183/cojmc-broadcasting/",
  "https://admissions.unl.edu/majors/88/cob-business-administration/",
  "https://admissions.unl.edu/majors/159/eng-chemical-engineering/",
  "https://admissions.unl.edu/majors/35/cas-chemistry/",
  "https://admissions.unl.edu/majors/608/cehs-child-youth-family-studies/",
  "https://admissions.unl.edu/majors/160/eng-civil-engineering/",
  "https://admissions.unl.edu/majors/37/cas-communication-studies/",
  "https://admissions.unl.edu/majors/161/eng-computer-enginering/",
  "https://admissions.unl.edu/majors/38/eng-computer-science/",
  "https://admissions.unl.edu/majors/163/eng-construction-management/",
  "https://admissions.unl.edu/majors/219/pac-criminology-and-criminal-justice/",
  "https://admissions.unl.edu/majors/172/fpa-dance/",
  "https://admissions.unl.edu/majors/89/cob-economics/",
  "https://admissions.unl.edu/majors/164/eng-electrical-engineering/",
  "https://admissions.unl.edu/majors/40/cas-english/",
  "https://admissions.unl.edu/majors/9/casnr-environmental-science/",
  "https://admissions.unl.edu/majors/90/cob-finance/",
  "https://admissions.unl.edu/majors/11/casnr-fisheries-and-wildlife/",
  "https://admissions.unl.edu/majors/12/casnr-food-science-and-technology/",
  "https://admissions.unl.edu/majors/206/casnr-forensic-science/",
  "https://admissions.unl.edu/majors/46/cas-geology/",
  "https://admissions.unl.edu/majors/710/fpa-graphic-design/",
  "https://admissions.unl.edu/majors/50/cas-history/",
  "https://admissions.unl.edu/majors/198/cehs-hospitality-restaurant-and-tourism-management/",
  "https://admissions.unl.edu/majors/184/cojmc-journalism/",
  "https://admissions.unl.edu/majors/93/cob-marketing/",
  "https://admissions.unl.edu/majors/55/cas-mathematics/",
  "https://admissions.unl.edu/majors/168/eng-mechanical-engineering/",
  "https://admissions.unl.edu/majors/57/cas-meteorology-and-climatology/",
  "https://admissions.unl.edu/majors/174/fpa-music/",
  "https://admissions.unl.edu/majors/607/cehs-nutrition-health-sciences/",
  "https://admissions.unl.edu/majors/58/cas-philosphy/",
  "https://admissions.unl.edu/majors/59/cas-physics/",
  "https://admissions.unl.edu/majors/60/cas-political-science/",
  "https://admissions.unl.edu/majors/77/cas-psychology/",
  "https://admissions.unl.edu/majors/709/cojmc-sports-media-and-communication/",
  "https://admissions.unl.edu/majors/644/fpa-theatre-design-technical-production/",
  "https://admissions.unl.edu/majors/24/casnr-veterinary-science/",
  "https://admissions.unl.edu/majors/83/cas-women-s-and-gender-studies/",
];

/**
 * Scrapes the HTML located at every URL in the given list and creates objects
 * that model individual majors.
 * @function
 * @param {Array} urlList - An array of URLs to fetch data from.
 * @returns {Array} responseList - An array of objects representing each major.
 */
const fetchData = (urlList) => {
  let responseList = [];
  let id = 0;

  urlList.forEach(async (url) => {
    await axios(url)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const name = $("h1").first().text();
        const academics = $(".adm-block-content h4").first().nextUntil("h4").text();
        const experience = $(".adm-block-content h4").eq(1).nextUntil("h4").text();
        const opportunities = $(".adm-block-content h4").last().nextUntil("h4").text();

        id += 1;

        const description = {
          academics: academics,
          experience: experience,
          opportunities: opportunities,
        };

        const majorInfo = {
          id: id,
          name: name,
          college: "",  // h1 seems to contain both major name and college
          description: description,
          affinity: 10,
        };

        responseList.push(majorInfo);
      })
    .catch(console.error);
  });
  return responseList;
};

/**
 * Sorts the given list of responses by name and reassigns IDs based on the
 * new ordering.
 * @function
 * @param {Array} responseList - An array of responses to sort.
 * @note IDs are reassigned to preserve the new ordering based on name.
 */
const sortList = (responseList) => {
  responseList.sort((item1, item2) => (item1.name >= item2.name) ? 1 : -1);
  let i = 0;
  responseList.forEach((item) => {
    i += 1;
    item.id = i;
  });
};

const responseList = fetchData(urlList);

// Timeout to wait for asynchronous calls
setTimeout(() => {
  sortList(responseList);
  console.log(responseList)
}, 2500);
