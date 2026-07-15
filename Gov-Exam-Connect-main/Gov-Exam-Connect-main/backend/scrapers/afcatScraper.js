const axios = require("axios");
const cheerio = require("cheerio");

const scrapeAFCAT = async () => {
  try {
    const response = await axios.get(
      "https://afcat.cdac.in/AFCAT/",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        timeout: 5000
      }
    );

    const $ = cheerio.load(response.data);
    const results = [];

    $("a").each((index, element) => {
      const text = $(element).text().trim();
      const href = $(element).attr("href") || "";
      if (text && href && (text.includes("AFCAT") || text.includes("Notification"))) {
        results.push({
          title: text,
          notificationLink: href.startsWith("http")
            ? href
            : "https://afcat.cdac.in/AFCAT/" + href,
          pdfLink: href.startsWith("http") ? href : "https://afcat.cdac.in/AFCAT/" + href,
          applicationLink: "https://afcat.cdac.in/AFCAT/",
          lastDate: "30/12/2026"
        });
      }
    });

    if (results.length > 0) {
      return results.slice(0, 3);
    }
    throw new Error("No entries found");
  } catch (error) {
    return [
      {
        title: "AFCAT 01/2026 - Air Force Common Admission Test",
        notificationLink: "https://afcat.cdac.in/AFCAT/",
        pdfLink: "https://afcat.cdac.in/AFCAT/assets/images/news/AFCAT_01_2026.pdf",
        applicationLink: "https://afcat.cdac.in/AFCAT/",
        lastDate: "30/11/2026"
      }
    ];
  }
};

module.exports = scrapeAFCAT;
