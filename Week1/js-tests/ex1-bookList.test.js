const fs = require('fs').promises;
const path = require('path');
const { HtmlValidate } = require('html-validate');
const { getFormatter } = require('html-validate/dist/cli/formatter');
const { setUp } = require('./helpers');

const stylish = getFormatter('stylish');

const exercisesDir = path.join(__dirname, '../js-exercises/ex1-bookList');

const htmlValidate = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: { 'no-trailing-whitespace': 'off' },
});

describe('Generated HTML', () => {
  beforeAll(async () => {
    await fs.copyFile(
      path.join(exercisesDir, 'index.html'),
      './temp/index.html'
    );
    await fs.copyFile(path.join(exercisesDir, 'index.js'), './temp/index.js');

    await setUp(page);
  });

  test('should be syntactically valid', async () => {
    const outerHTML = await page.evaluate(
      () => document.documentElement.outerHTML
    );
    const htmlText = `<!DOCTYPE html>\n${outerHTML}`;
    const report = htmlValidate.validateString(htmlText);
    const validationReport = stylish(report);
    expect(validationReport).toBe('');
  });

  test('should contain an unordered list', async () => {
    const textContent = await page.evaluate(() => {
      const elem = document.querySelector('div[id=bookList] > ul');
      return elem ? elem.textContent : '';
    });
    expect(textContent).toEqual(
      expect.stringContaining('The Design of Everyday Things')
    );
  });
});
