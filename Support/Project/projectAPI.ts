import {request} from "@playwright/test";
import { Project } from "./Project";

export class ProjectAPI {
    static async createProject(projectModel: Project){
    const url = `${process.env.API_URL}project`;
    const context = await request.newContext();
    const response = await context.post(url, {
        headers: {'Content-type': 'application/json'},
        data: projectModel
    });
    if (!response.ok()){
        console.error(`${response.status()} => ${response.statusText()}`);
        throw new Error(`${response.status()} => ${response.statusText()}`);
    };
    console.log('New project was created')
    };
}