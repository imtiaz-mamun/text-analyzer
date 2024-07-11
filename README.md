# text-analyzer

## Project Setup

1. Clone the repository.
2. Go to the cloned directory by the terminal/console. _(`Example: cd text-analyzer/`)_
3. Run commands in this order
   1. npm i
   2. node app.js
4. Now the app is running at _http://localhost:3000/_

## For `SSO Service` Integrated Project

1. Configure your SSO server in `keycloak.json` file
2. Run commands in this order
   1. npm i
   2. node sso-app.js
3. Now the app with sso is running at _http://localhost:3000/_

## Application's Input/Output

1. **Input:** sample.txt
2. **Output:**
   1. The application shows Word Count, Character Count, Sentence Count, Paragraph Count, and Longest Words from the `sample.txt` file.
   2. Value automatic changes on the front end if the `sample.txt` file's text is updated. Do not require to reload the page to see the updated results.

## For `Testing` the solution

1. Configure your input in `test/api.test.js` file as per `sample.txt`
2. Run command: node test/test-runner.js
3. Now the terminal will show the test results

## For `Report Analysis` you can find a `report.txt` file in root directory
