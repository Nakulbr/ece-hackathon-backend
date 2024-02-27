const fs = require("fs");
const puppeteer = require("puppeteer");

const generatePDF = async (data) => {
  try {
    const htmlTemplate = fs.readFileSync("./template/template.html", "utf-8");

    // Replace placeholders with dynamic data
    const filledTemplate = htmlTemplate.replace(/{{(\w+)}}/g, (match, key) => {
      return data[key] || match;
    });

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set page content to filled HTML template
    await page.setContent(filledTemplate);

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    });

    // Close browser
    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

module.exports = { generatePDF };
