const inquirer = require('inquirer');
const { execSync } = require('child_process');
const menu = require('./test-menu.json');

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

async function main() {
  try {
    const { week } = await selectWeek();
    const { exercise } = await inquirer.prompt([
      {
        type: 'list',
        name: 'exercise',
        message: 'Which exercise?',
        choices: menu[week],
      },
    ]);
    console.log('Running test, please wait...');
    execSync(
      `npx jest ${exercise} --silent false --verbose false --reporters="./test-helpers/CustomReporter.js"`
    );
  } catch (_) {
    console.log('There were errors.');
  }
}

main();
