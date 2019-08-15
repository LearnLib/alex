export class ProjectUrl {
  id: number;
  environment: number;
  name: string;
  url: string;

  constructor() {
    this.url = 'http://';
  }

  static fromData(data: any): ProjectUrl {
    const e = new ProjectUrl();
    e.id = data.id;
    e.environment = data.environment;
    e.name = data.name;
    e.url = data.url;
    return e;
  }

  copy(): ProjectUrl {
    return ProjectUrl.fromData(JSON.parse(JSON.stringify(this)));
  }
}