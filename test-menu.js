const fs = require('fs').promises;
const path = require('path');
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const menu = require('./test-menu.json');

async function unlink(path) {
  try {
    await fs.unlink(path);
  } catch (_) {
    // ignore
  }
}

async function writeReport(name, report) {
  const reportDir = path.join(__dirname, './test-reports');
  const todoFilePath = path.join(reportDir, `${name}.todo.txt`);
  await unlink(todoFilePath);

  const passFilePath = path.join(reportDir, `${name}.pass.txt`);
  await unlink(passFilePath);

  const failFilePath = path.join(reportDir, `${name}.fail.txt`);
  await unlink(failFilePath);

  if (report) {
    await fs.writeFile(failFilePath, report, 'utf8');
    return report;
  }

  const message = 'All tests passed';
  await fs.writeFile(passFilePath, message, 'utf8');
  return message;
}

function selectWeek() {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'week',
      message: 'Which week?',
      choices: Object.keys(menu),
    },
  ]);
}

function selectExercise(exercises) {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'name',
      message: 'Which exercise?',
      choices: Object.keys(exercises),
    },
  ]);
}

function execJest(name) {
  try {
    execSync(
      `npx jest ${name} --silent false --verbose false --reporters="./test-helpers/CustomReporter.js"`,
      { encoding: 'utf8' }
    );
    return '';
  } catch (err) {
    return `*** Unit Test Report ***\n\n${err.stdout}`;
  }
}

function execESLint(path) {
  try {
    execSync(`npx eslint ${path}`, { encoding: 'utf8' });
    return '';
  } catch (err) {
    return `\n*** ESLint Report ***\n${err.stdout}`;
  }
}

async function main() {
  const { week } = await selectWeek();
  const exercises = menu[week];
  const { name } = await selectExercise(exercises);

  console.log('\nRunning test, please wait...\n');

  let report = execJest(name);
  report += execESLint(exercises[name]);

  const message = await writeReport(name, report);
  console.log(message);
}

main();
