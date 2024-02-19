import { nanoid } from "nanoid";
export class Project {
    name:string;
    enabled:boolean;
    internal:boolean;
    issuesJql:string;
    
    constructor(projectPrefix:string, enabled:boolean, internal:boolean, issuesJql?:string){
    const randomName: string = projectPrefix + nanoid(6);
    this.name = randomName;
    this.enabled = enabled;
    this.internal = internal;
    this.issuesJql = issuesJql ?? randomName;    
    }
}