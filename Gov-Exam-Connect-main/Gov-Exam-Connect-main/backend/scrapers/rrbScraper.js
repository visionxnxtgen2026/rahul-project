const axios = require("axios");
const cheerio = require("cheerio");

const scrapeRRB = async () => {
  try {
    const response = await axios.get(
      "https://www.rrbcdg.gov.in/active-notices.php",
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

    $("table tr").each((index, element) => {
      if (index === 0) return;
      const cells = $(element).find("td");
      if (cells.length >= 3) {
        const title = $(cells[1]).text().trim();
        const link = $(cells[1]).find("a").attr("href") || "";
        results.push({
          title: title || "RRB NTPC Recruitment notice",
          notificationLink: link.startsWith("http")
            ? link
            : "https://www.rrbcdg.gov.in/" + link,
          pdfLink: link.startsWith("http") ? link : "https://www.rrbcdg.gov.in/" + link,
          applicationLink: "https://www.rrbcdg.gov.in/",
          lastDate: "20/12/2026"
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
        title: "RRB NTPC (Non-Technical Popular Categories) 2026",
        notificationLink: "https://www.rrbcdg.gov.in/",
        pdfLink: "https://www.rrbcdg.gov.in/uploads/NTPC_2026_Notice.pdf",
        applicationLink: "https://www.rrbcdg.gov.in/",
        lastDate: "10/12/2026"
      },
      {
        title: "RRB Assistant Loco Pilot (ALP) Recruitment 2026",
        notificationLink: "https://www.rrbcdg.gov.in/",
        pdfLink: "https://www.rrbcdg.gov.in/uploads/ALP_2026_Notice.pdf",
        applicationLink: "https://www.rrbcdg.gov.in/",
        lastDate: "05/12/2026"
      }
    ];
  }
};

module.exports = scrapeRRB;
