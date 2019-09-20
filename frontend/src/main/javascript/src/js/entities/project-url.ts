export class ProjectUrl {
  id: number;
  environment: number;
  name: string;
  url: string;
  default: boolean;

  constructor() {
    this.url = 'http://';
    this.default = false;
  }

  static fromData(data: any): ProjectUrl {
    const u = new ProjectUrl();
    u.id = data.id;
    u.environment = data.environment;
    u.name = data.name;
    u.url = data.url;
    u.default = data.default;
    return u;
  }

  copy(): ProjectUrl {
    return ProjectUrl.fromData(JSON.parse(JSON.stringify(this)));
  }
}