import { test, expect} from '@playwright/test';
import {promises as fs} from 'fs'; 

test.describe.configure({mode: 'parallel'});
let project;
test.beforeEach(async ({ page }) => {
    project = await fs.readFile('.tmp/smokeSetup.json', (err, data) => {
        if (err) throw err;
        return data;
    }).then((data) => JSON.parse(data));
    await page.goto(process.env.APP_URL);
});
test.describe('Start all 3 smoke tests in parallel',async () => {
    test('Scrolling test',async ({page}) => {
        await page.getByLabel('Open').click();
        await page.getByRole('option', { name: project.name, exact: true }).click(); 
        const positionOfFifthUser = await page.getByRole('cell', { name: 'user05 Změnit rate' }).getByRole('button').boundingBox();
        const positionOfHeader = await page.getByText('KapkaPlán').boundingBox();
        console.log(`positionOfTenthUser x = ${positionOfFifthUser.x}; y = ${positionOfFifthUser.y}`);
        await page.mouse.wheel(0, positionOfFifthUser.y - positionOfHeader.height );
        await page.mouse.click(positionOfFifthUser.x + positionOfFifthUser.width / 2, positionOfHeader.height + positionOfFifthUser.height/2);
        await expect(page.getByRole('heading', { name: 'Změnit ratu user05 pro' })).toContainText(`Změnit ratu user05 pro projekt ${project.name}`);
        console.log('Scrolling test was finished')
    });
    test('Filter test',async ({page}) => {
        const d = new Date();
        const currentMonth = d.getMonth() + 1;
        const currentYear = d.getFullYear();
        let monthZero;
        let monthBefore;
        let monthAfter;
        if(currentMonth <= 9){
            monthZero = `0${currentMonth}`;
        }else {monthZero = `${currentMonth}`};

        if(currentMonth <= 10 && currentMonth > 1){
            monthBefore = `0${currentMonth - 1}`
        };
        if(currentMonth > 10 && currentMonth > 1){
            monthBefore = `${currentMonth - 1}`
        };
        if(currentMonth === 1){
            monthBefore = `11`
        };
        if(currentMonth <= 8){
            monthAfter = `0${currentMonth + 1}`
        };
        if(currentMonth > 8 && currentMonth < 12){
            monthAfter = `${currentMonth + 1}`
        };
        if(currentMonth === 12){
            monthAfter = `1`
        };
        console.log(`Current month = ${currentMonth}`);
        await page.getByLabel('Open').click();
        await page.getByRole('option', { name: project.name, exact: true }).click(); 
        for (let i = 1; i <= 3; i++){
            await page.locator('.MuiBox-root > button').click();
            await page.getByLabel(`${i}`).check();
            await page.getByRole('button').click();
            await page.getByText(`${currentYear}-${monthZero}`, {exact: true}).click()
            if (i > 1){
                await page.getByText(`${currentYear}-${monthAfter}`, {exact: true}).click()};
            if (i > 2){
                await page.getByText(`${currentYear}-${monthBefore}`, {exact: true}).click()};
        };
        console.log('Filter test was finished')
    });
        test('Form test',async ({page}) => {
        await page.getByLabel('Open').click();
        await page.getByRole('option', { name: project.name, exact: true }).click(); 
        await page.getByRole('row', { name: 'user10 Změnit rate Plánováno' }).getByRole('textbox').first().fill('555');
        const getUpdatedResponsePromise = page.waitForResponse((res) => res.url().includes('school.kapka.viableone.com/api/plan?projectId'));
        await page.getByRole('row', { name: 'user10 Změnit rate Plánováno' }).getByRole('textbox').first().press('Enter');
        const response = await getUpdatedResponsePromise;
        const resBody = await response.body();
        if (response.status()!= 200 || !resBody.includes('555')){
            throw new Error(`Rsponse status = ${response.status()}; response body = ${resBody}`)
        };
        console.log('Form test was finished')
    });
})