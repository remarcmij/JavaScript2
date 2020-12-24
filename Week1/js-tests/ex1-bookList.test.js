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

  test('should contain a <ul> with 3 <li> elements', async () => {
    const result = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('div[id=bookList] > ul > li');
      return nodeList ? nodeList.length : 0;
    });
    expect(result).toBe(3);
  });

  test('should include an <li> with title and author for each book', async () => {
    const result = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('div[id=bookList] > ul > li');
      return nodeList
        ? Array.from(nodeList)
            .map((node) => node.textContent)
            .join(', ')
        : '';
    });
    expect(result).toMatch(/The Design of Everyday Things/);
    expect(result).toMatch(/Don Norman/);
    expect(result).toMatch(/The Most Human Human/);
    expect(result).toMatch(/Brian Christian/);
    expect(result).toMatch(/The Pragmatic Programmer/);
    expect(result).toMatch(/Andrew Hunt/);
  });

  test('should include an <img> element for each book', async () => {
    const result = await page.evaluate(() => {
      const nodeList = document.querySelectorAll(
        'div[id=bookList] > ul > li img'
      );
      return nodeList ? nodeList.length : 0;
    });
    expect(result).toBe(3);
  });
});
