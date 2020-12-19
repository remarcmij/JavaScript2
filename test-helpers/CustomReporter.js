const fs = require('fs').promises;
const path = require('path');

async function unlink(path) {
  try {
    await fs.unlink(path);
  } catch (_) {
    // ignore
  }
}

class MyCustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    results.testResults.forEach(async ({ testFilePath, testResults }) => {
      console.error(__dirname);
      const baseName = path.basename(testFilePath, '.test.js');
      const reportDir = path.join(__dirname, '../test-reports');

      const voidFilePath = path.join(reportDir, `${baseName}.void.md`);
      await unlink(voidFilePath);

      const passFilePath = path.join(reportDir, `${baseName}.pass.md`);
      await unlink(passFilePath);

      const failFilePath = path.join(reportDir, `${baseName}.fail.md`);
      await unlink(failFilePath);

      const failedTestResults = testResults.filter(
        testResult => testResult.status === 'failed'
      );

      let report;

      if (failedTestResults.length === 0) {
        report = 'All tests passed';
        console.error(report);
        await fs.writeFile(passFilePath, report, 'utf8');
      } else {
        report = failedTestResults
          .map(testResult => testResult.fullName)
          .join('\n');
        console.error(report);
        await fs.writeFile(failFilePath, '```\n' + report + '\n```', 'utf8');
      }
    });
  }
}

module.exports = MyCustomReporter;
