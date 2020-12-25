const fs = require('fs').promises;
const path = require('path');
const { HtmlValidate } = require('html-validate');
const { getFormatter } = require('html-validate/dist/cli/formatter');
const stylish = getFormatter('stylish');

const config = {
  baseUrl: 'http://localhost:5000/',
  blockedResourceTypes: ['image', 'stylesheet', 'font'],
};

async function copyFiles(exerciseDirName) {
  const exercisesDir = path.join(__dirname, '../js-exercises', exerciseDirName);
  await fs.copyFile(path.join(exercisesDir, 'index.html'), './temp/index.html');
  await fs.copyFile(path.join(exercisesDir, 'index.js'), './temp/index.js');
}

async function setUp(page) {
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (config.blockedResourceTypes.includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });
  return page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
}

const htmlValidate = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: { 'no-trailing-whitespace': 'off' },
});

async function validateHTML() {
  const outerHTML = await page.evaluate(
    () => document.documentElement.outerHTML
  );
  const htmlText = `<!DOCTYPE html>\n${outerHTML}`;
  const report = htmlValidate.validateString(htmlText);
  const validationReport = stylish(report);
  expect(validationReport).toBe('');
}

module.exports = {
  copyFiles,
  setUp,
  validateHTML,
};
