const config = {
  baseUrl: 'http://localhost:5000/',
  blockedResourceTypes: ['image', 'stylesheet', 'font'],
};

async function setUp(page) {
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (config.blockedResourceTypes.includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });
  return page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
}

module.exports = {
  setUp,
};
