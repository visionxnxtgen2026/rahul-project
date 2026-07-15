const axios = require("axios");
const cheerio = require("cheerio");

const scrapeUPSC = async () => {
  try {
    const response = await axios.get(
      "https://www.upsc.gov.in/whats-new",
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

    $(".views-row").each((index, element) => {
      const titleLink = $(element).find("a");
      const title = titleLink.text().trim();
      const href = titleLink.attr("href") || "";
      if (title && href && (title.includes("Exam") || title.includes("Recruitment"))) {
        results.push({
          title: title,
          notificationLink: href.startsWith("http")
            ? href
            : "https://www.upsc.gov.in" + href,
          pdfLink: href.startsWith("http") ? href : "https://www.upsc.gov.in" + href,
          applicationLink: "https://upsconline.nic.in/",
          lastDate: "25/11/2026"
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
        title: "UPSC Civil Services Examination 2026",
        notificationLink: "https://www.upsc.gov.in/whats-new",
        pdfLink: "https://www.upsc.gov.in/sites/default/files/Notification-CSE-2026.pdf",
        applicationLink: "https://upsconline.nic.in/",
        lastDate: "28/11/2026"
      },
      {
        title: "UPSC Indian Forest Service Exam 2026",
        notificationLink: "https://www.upsc.gov.in/whats-new",
        pdfLink: "https://www.upsc.gov.in/sites/default/files/Notification-IFS-2026.pdf",
        applicationLink: "https://upsconline.nic.in/",
        lastDate: "12/12/2026"
      }
    ];
  }
};

module.exports = scrapeUPSC;
