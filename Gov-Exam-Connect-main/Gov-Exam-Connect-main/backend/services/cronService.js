const cron = require("node-cron");
const Exam = require("../models/Exam");
const scrapeTNPSC = require("../scrapers/tnpscScraper");
const scrapeUPSC = require("../scrapers/upscScraper");
const scrapeRRB = require("../scrapers/rrbScraper");
const scrapeAFCAT = require("../scrapers/afcatScraper");
const scrapeSSB = require("../scrapers/ssbScraper");

const defaultMetadata = {
  TNPSC: {
    organization: "Tamil Nadu Public Service Commission",
    category: "Civil",
    description: "Recruitment to various state government posts in Tamil Nadu public administration services.",
    eligibility: "Graduate in any discipline from a recognized University, knowledge of Tamil is mandatory.",
    ageLimit: "21 to 32 Years",
    vacancies: "870 Posts"
  },
  UPSC: {
    organization: "Union Public Service Commission",
    category: "Civil",
    description: "All India premier civil service examinations to recruit candidates into top administrative posts including IAS, IPS, and IFS.",
    eligibility: "Bachelor's Degree in any discipline from a recognized University.",
    ageLimit: "21 to 32 Years",
    vacancies: "1056 Posts"
  },
  RRB: {
    organization: "Railway Recruitment Board",
    category: "Civil",
    description: "Central government vacancies in Indian Railways across technical and non-technical popular categories.",
    eligibility: "12th Standard or Graduation depending on individual posts.",
    ageLimit: "18 to 33 Years",
    vacancies: "11558 Posts"
  },
  AFCAT: {
    organization: "Indian Air Force",
    category: "Defence",
    description: "Commissioned Officers recruitment test in flying, technical, and ground duty branches of IAF.",
    eligibility: "Graduation (B.E./B.Tech) with minimum 60% marks in Physics and Mathematics at 10+2 level.",
    ageLimit: "20 to 26 Years",
    vacancies: "317 Posts"
  },
  SSB: {
    organization: "Sashastra Seema Bal",
    category: "Defence",
    description: "Recruitment of personnel in security border forces under the Ministry of Home Affairs.",
    eligibility: "10th/12th standard or graduation from a recognized board or university.",
    ageLimit: "18 to 25 Years",
    vacancies: "272 Posts"
  },
  Agniveer: {
    organization: "Indian Armed Forces",
    category: "Defence",
    description: "Indian Army Agniveer recruitment scheme for rendering service in national defence operations.",
    eligibility: "Class 10th Matriculation or 12th Intermediate pass.",
    ageLimit: "17.5 to 21 Years",
    vacancies: "25000 Posts"
  }
};

const runScrapers = async () => {
  try {
    const tnpscData = await scrapeTNPSC();
    for (const item of tnpscData) {
      await Exam.findOneAndUpdate(
        { title: item.title },
        {
          ...item,
          organization: defaultMetadata.TNPSC.organization,
          category: defaultMetadata.TNPSC.category,
          subCategory: "TNPSC",
          description: defaultMetadata.TNPSC.description,
          eligibility: defaultMetadata.TNPSC.eligibility,
          ageLimit: defaultMetadata.TNPSC.ageLimit,
          vacancies: defaultMetadata.TNPSC.vacancies
        },
        { upsert: true, new: true }
      );
    }

    const upscData = await scrapeUPSC();
    for (const item of upscData) {
      await Exam.findOneAndUpdate(
        { title: item.title },
        {
          ...item,
          organization: defaultMetadata.UPSC.organization,
          category: defaultMetadata.UPSC.category,
          subCategory: "UPSC",
          description: defaultMetadata.UPSC.description,
          eligibility: defaultMetadata.UPSC.eligibility,
          ageLimit: defaultMetadata.UPSC.ageLimit,
          vacancies: defaultMetadata.UPSC.vacancies
        },
        { upsert: true, new: true }
      );
    }

    const rrbData = await scrapeRRB();
    for (const item of rrbData) {
      await Exam.findOneAndUpdate(
        { title: item.title },
        {
          ...item,
          organization: defaultMetadata.RRB.organization,
          category: defaultMetadata.RRB.category,
          subCategory: "RRB",
          description: defaultMetadata.RRB.description,
          eligibility: defaultMetadata.RRB.eligibility,
          ageLimit: defaultMetadata.RRB.ageLimit,
          vacancies: defaultMetadata.RRB.vacancies
        },
        { upsert: true, new: true }
      );
    }

    const afcatData = await scrapeAFCAT();
    for (const item of afcatData) {
      await Exam.findOneAndUpdate(
        { title: item.title },
        {
          ...item,
          organization: defaultMetadata.AFCAT.organization,
          category: defaultMetadata.AFCAT.category,
          subCategory: "AFCAT",
          description: defaultMetadata.AFCAT.description,
          eligibility: defaultMetadata.AFCAT.eligibility,
          ageLimit: defaultMetadata.AFCAT.ageLimit,
          vacancies: defaultMetadata.AFCAT.vacancies
        },
        { upsert: true, new: true }
      );
    }

    const ssbData = await scrapeSSB();
    for (const item of ssbData) {
      await Exam.findOneAndUpdate(
        { title: item.title },
        {
          ...item,
          organization: defaultMetadata.SSB.organization,
          category: defaultMetadata.SSB.category,
          subCategory: "SSB",
          description: defaultMetadata.SSB.description,
          eligibility: defaultMetadata.SSB.eligibility,
          ageLimit: defaultMetadata.SSB.ageLimit,
          vacancies: defaultMetadata.SSB.vacancies
        },
        { upsert: true, new: true }
      );
    }

    await Exam.findOneAndUpdate(
      { title: "Indian Army Agniveer Recruitment Rally 2026" },
      {
        title: "Indian Army Agniveer Recruitment Rally 2026",
        organization: defaultMetadata.Agniveer.organization,
        category: defaultMetadata.Agniveer.category,
        subCategory: "Agniveer",
        description: defaultMetadata.Agniveer.description,
        eligibility: defaultMetadata.Agniveer.eligibility,
        ageLimit: defaultMetadata.Agniveer.ageLimit,
        vacancies: defaultMetadata.Agniveer.vacancies,
        lastDate: "28/11/2026",
        notificationLink: "https://joinindianarmy.nic.in/",
        pdfLink: "https://joinindianarmy.nic.in/",
        applicationLink: "https://joinindianarmy.nic.in/"
      },
      { upsert: true, new: true }
    );

    console.log("Scrapers run completed successfully.");
  } catch (error) {
    console.error("Scraper scheduler failed:", error);
  }
};

const initScheduler = () => {
  cron.schedule("0 */12 * * *", () => {
    runScrapers();
  });
};

module.exports = {
  initScheduler,
  runScrapers
};
