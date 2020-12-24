class MyCustomReporter {
  onRunComplete(contexts, results) {
    let report = '';
    results.testResults.forEach(async ({ testResults }) => {
      const failedTestResults = testResults.filter(
        (testResult) => testResult.status === 'failed'
      );

      if (failedTestResults.length !== 0) {
        report += failedTestResults
          .map((testResult) => testResult.fullName)
          .join('\n');
      }
    });
    console.log(report);
  }
}

module.exports = MyCustomReporter;
