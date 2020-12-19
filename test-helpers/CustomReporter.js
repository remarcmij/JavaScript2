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
  onRunComplete(contexts, results) {
    results.testResults.forEach(async ({ testFilePath, testResults }) => {
      const baseName = path.basename(testFilePath, '.test.js');
      const reportDir = path.join(__dirname, '../test-reports');

      const todoFilePath = path.join(reportDir, `${baseName}.todo.md`);
      await unlink(todoFilePath);

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
