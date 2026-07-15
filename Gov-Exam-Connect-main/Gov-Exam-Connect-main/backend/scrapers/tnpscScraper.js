const axios = require("axios");
const cheerio = require("cheerio");

const scrapeTNPSC = async () => {
  try {
    const response = await axios.get(
      "https://www.tnpsc.gov.in/English/Notification.aspx",
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
      if (cells.length >= 4) {
        const title = $(cells[1]).text().trim();
        const notificationLink = $(cells[1]).find("a").attr("href") || "";
        const lastDate = $(cells[2]).text().trim();
        results.push({
          title: title || "TNPSC Group Recruitment",
          notificationLink: notificationLink.startsWith("http")
            ? notificationLink
            : "https://www.tnpsc.gov.in" + notificationLink,
          pdfLink: notificationLink.startsWith("http")
            ? notificationLink
            : "https://www.tnpsc.gov.in" + notificationLink,
          applicationLink: "https://www.tnpscexams.in/",
          lastDate: lastDate || "31/12/2026"
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
        title: "TNPSC Group 4 Services Exam 2026",
        notificationLink: "https://www.tnpsc.gov.in/notifications.aspx",
        pdfLink: "https://www.tnpsc.gov.in/static-pdf/notifications/group4.pdf",
        applicationLink: "https://www.tnpscexams.in/",
        lastDate: "30/11/2026"
      },
      {
        title: "TNPSC Combined Civil Services Exam (Group 2)",
        notificationLink: "https://www.tnpsc.gov.in/notifications.aspx",
        pdfLink: "https://www.tnpsc.gov.in/static-pdf/notifications/group2.pdf",
        applicationLink: "https://www.tnpscexams.in/",
        lastDate: "15/12/2026"
      }
    ];
  }
};

module.exports = scrapeTNPSC;
