# Instructions for Setting Up the Project Locally

To set up and run the project on your local machine, please follow these steps:

1. **Clone the Repository**:

   ```
   git clone https://github.com/imtiaz-mamun/text-analyzer.git
   ```

2. **Navigate to the Project Directory**:

   ```
   cd text-analyzer/
   ```

3. **Install the Dependencies**:

   ```
   npm install
   ```

4. **Run the Application**:

   ```
   node app.js
   ```

   The application will be available at [http://localhost:3000/](http://localhost:3000/)

## SSO Service Integration

If you wish to test the SSO (Single Sign-On) integration, please follow these additional steps:

1. **Configure the SSO Server**:
   Edit the `keycloak.json` file to include your SSO server details.

2. **Run the Application with SSO**:

   ```
   node sso-app.js
   ```

   The application with SSO will be available at [http://localhost:3000/](http://localhost:3000/)

## Application Features

- **Input**: `sample.txt`
- **Output**: The application displays Word Count, Character Count, Sentence Count, Paragraph Count, and Longest Words extracted from `sample.txt`.
- **Real-time Updates**: The front end automatically updates to reflect changes in `sample.txt` without needing a page reload.

## Testing

To test the solution:

1. **Configure Your Test Input**:
   Edit the `test/api.test.js` file with the test data.

2. **Run the Tests**:

   ```
   node test/test-runner.js
   ```

   Test results will be displayed in the terminal.

## Report Analysis

The `report.txt` file in the root directory contains the analysis reports.
