import {Project, ProjectsApi} from "@greenspark/projects"

async function getProjects() {
    try {
        const projectsApi = new ProjectsApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
        const {data}: Project[] = await projectsApi.getProjects()
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

console.log(getProjects())
