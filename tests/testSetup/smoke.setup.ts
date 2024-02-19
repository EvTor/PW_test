import { Project } from "../../Support/Project/Project";
import {test as setup, expect} from '@playwright/test';
import { ProjectAPI } from "../../Support/Project/projectAPI";
import {users} from "../../Support/User/Users";
import fs from 'fs';

//Project object creation
const newProject:Project = new Project('TestProject', true, true);
setup('Smoke tests setup',async ({page}) => {
//Project creation by API request
await ProjectAPI.createProject(newProject);
const saveDataToJSON = () =>{
    const data = JSON.stringify(newProject);
    fs.writeFile('.tmp/smokeSetup.json', data, (err)=> {
        if (err){
            console.error(err);
        } else {
            console.log('JSON data were successfully created')
        };
    })
};
saveDataToJSON();
//Add users to the project
await page.goto(process.env.APP_URL);
await page.getByLabel('Open').click();
await page.getByRole('option', { name: newProject.name, exact: true }).click();
for await (const user of Object.values(users)){
await page.getByRole('cell', { name: 'Personální Výnosy/Náklady', exact: true }).getByRole('button').click();
await page.getByRole('button', { name: 'Open', exact: true  }).click();
await page.getByRole('option', { name: user, exact: true }).click();
await page.getByRole('button', { name: 'Uložit', exact: true  }).click();
};
console.log(`All 10 users were added to the project ${newProject.name}`)
console.log('Test setup is OK');
})