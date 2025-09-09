# Team UNL - Major Chooser

This repository hosts artifacts related to our term project for the summer offering of CSCI 4830. The project itself is a basic web app that helps users explore some of the majors offered at UNL. For users who are unsure of what major they want to pursue, a 28-question quiz can be taken that recommends a possible major based on their responses to each prompt. More information on each major is also offered below the quiz for users interested in learning more about any potential fields.

## Release Notes
### v1.0.0
- Read about majors by clicking on their tiles
-   - 48 majors to choose from
    - Viewable info is taken directly from the UNL admissions web pages
- Take a quiz to see which major you might be interested in
    - 28 yes/no questions

## Team Members
- Andrew Aldana
- JaeHyeok An
- Jacob Harvey

## Development Setup

To work on this project, first ensure you have Node installed on your machine and this repository cloned. Navigate to your local version of the repo and install dependencies.

```bash
npm install
```

You should then be able to start a local instance of the app.

```bash
npm start
```

This local instance should update with any changes you make to the source file. You should now be set up to begin development on the project.

## Deployment

To deploy the latest version of the project to GitHub pages, run the following command.

```bash
npm run deploy
```

This script will take care of the entire deployment process and you should be able to access the app at https://aaldana8.github.io/my_first/. **Note:** it may take a while before the deployment is complete.

