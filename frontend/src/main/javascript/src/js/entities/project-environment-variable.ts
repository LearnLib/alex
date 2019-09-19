export class ProjectEnvironmentVariable {
    id: number;
    name: string;
    value: string;
    environment: number;

    static fromData(data: any): ProjectEnvironmentVariable {
        const v = new ProjectEnvironmentVariable();
        v.id = data.id;
        v.name = data.name;
        v.value = data.value;
        v.environment = data.environment;
        return v;
    }

    copy(): ProjectEnvironmentVariable {
        return ProjectEnvironmentVariable.fromData(JSON.parse(JSON.stringify(this)));
    }
}