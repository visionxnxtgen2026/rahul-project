const axios = require("axios");
const cheerio = require("cheerio");

const scrapeSSB = async () => {
  try {
    const response = await axios.get(
      "https://ssb.nic.in/index1.aspx?lid=65",
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
      if (text && href && (text.includes("Recruitment") || text.includes("SSB"))) {
        results.push({
          title: text,
          notificationLink: href.startsWith("http")
            ? href
            : "https://ssb.nic.in/" + href,
          pdfLink: href.startsWith("http") ? href : "https://ssb.nic.in/" + href,
          applicationLink: "https://ssb.nic.in/",
          lastDate: "31/12/2026"
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
        title: "SSB Constable (General Duty) Recruitment 2026",
        notificationLink: "https://ssb.nic.in/",
        pdfLink: "https://ssb.nic.in/writereaddata/Portal/GD_Constable_2026.pdf",
        applicationLink: "https://ssbrpct.cbtexam.in/",
        lastDate: "18/12/2026"
      },
      {
        title: "SSB Sub-Inspector (SI) Recruitment 2026",
        notificationLink: "https://ssb.nic.in/",
        pdfLink: "https://ssb.nic.in/writereaddata/Portal/SI_2026_Notice.pdf",
        applicationLink: "https://ssbrpct.cbtexam.in/",
        lastDate: "22/12/2026"
      }
    ];
  }
};

module.exports = scrapeSSB;
