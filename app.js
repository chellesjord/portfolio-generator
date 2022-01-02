const {writeFile, copyFile } = require("./utils/generate-site.js");
const inquirer = require("inquirer");
const generatePage = require("./src/page-template.js");

//Promt user for portfolio data
/**
 * 
 * @returns 
 */
const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is your name? (Required)',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter your name!');
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "github",
            message: "Enter your GitHub Username (Required)",
            validate: githubInput => {
                if (githubInput) {
                    return true;
                } else {
                    console.log("Please enter your GitHub Username!");
                }
            }
        },
        {
            type: "confirm",
            name: "confirmAbout",
            message: "Would you like to enter some information about yourself for an 'About' section?",
            default: true
        },
        {
            type: "input",
            name: "about",
            message: "Provide some information about yourself:",
            when: ({ confirmAbout }) => {
                if (confirmAbout) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]);
};


//recursively call promptProject() for as many projects as user wants to add
//Each project iwll be pushed into a projects array in the collection of protfolio information
const promptProject = portfolioData => {
    console.log(`
    =================
    Add a New Project
    =================
    `);

    //if there's not "projects" array property, create one
    if (!portfolioData.projects) {
        portfolioData.projects = [];
    }
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of your project? (Required)",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter your project name!");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "description",
            message: "Provide a description of the project (Required)",
            validate: descriptionInput => {
                if (descriptionInput) {
                    return true;
                } else {
                    console.log("Please include a description of the project!");
                    return false;
                }
            }
        },
        {
            type: "checkbox",
            name: "languages",
            message: "What did you build this project with? (Check all that apply)",
            choices: ["JavaScript", "HTML", "CSS", "ES6", "jQuery", "Bootstrap", "Node"]
        },
        {
            type: "input",
            name: "link",
            message: "Enter the GitHub link to your project. (Required)",
            validate: linkInput => {
                if (linkInput) {
                    return true;
                } else {
                    console.log("Please include the GitHub link for this project!");
                    return false;
                }
            }
        },
        {
            type: "confirm",
            name: "feature",
            message: "Would you like to feature this project?",
            default: false
        },
        {
            type: "confirm",
            name: "confirmAddProject",
            message: "Would you like to enter another project?",
            default: false
        }
    ])
        .then(projectData => {
            portfolioData.projects.push(projectData);
            if (projectData.confirmAddProject) {
                return promptProject(portfolioData);
            } else {
                return portfolioData;
            }
        });
};

promptUser()
    .then(promptProject)
    //final set of data is returned as portfolioData and sent to generatePage() function
    .then(portfolioData => {
        return generatePage(portfolioData);
    })
    //this will return finished HTML template code to pageHTML
    .then(pageHTML => {
        //which passes throught writeFile() and returns a Promise.
        return writeFile(pageHTML);
    })
    //writeFileResponse object created by writeFile() logs it and reutrns copyFile()
    .then(writeFileResponse => {
        console.log(writeFileResponse);
        return copyFile();
    })
    //the promise returned by copyFile() lets us know if the CSS file is copied correctly.
    .then(copyFileResponse => {
        console.log(copyFileResponse);
    })
    .catch(err => {
        console.log(err);
    });

// fs.writeFile('./dist/index.html', pageHTML, err => {
//     if (err) throw new Error(err);
//     console.log('Page created! Check out index.html in this directory to see it!');

//     fs.copyFile('./src/style.css', './dist/style.css', err => {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         console.log('Style sheet copied successfully!');
//     });
// });