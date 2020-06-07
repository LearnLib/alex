import {Injectable} from "@angular/core";
import {WebSocketService} from "./websocket.service";
import {BehaviorSubject} from "rxjs";
import {WebSocketMessage} from "../entities/websocket-message";
import {AppStoreService} from "./app-store.service";
import {ProjectApiService} from "./api/project-api.service";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import { filter } from 'rxjs/operators';

@Injectable()
export class ProjectPresenceService {

  private activeUsers = new BehaviorSubject(new Map());

  private oldRoute = "";

  constructor(private webSocketService: WebSocketService,
              private router: Router,
              private projectApiService: ProjectApiService) {
    this.webSocketService.register(msg => msg.entity == "ProjectPresenceService"
                                                 && msg.type == "Status")
      .subscribe(msg => this.processStatus(msg));

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(r => this.routeChange(r));
  }

  private routeChange(r: any) {
    const newRoute = r.urlAfterRedirects;
    const oldProjectId = this.oldRoute.split("/")[3];
    const newProjectId = newRoute.split("/")[3];

    if (newRoute.startsWith("/app") && !this.oldRoute.startsWith("/app")) {
      this.projectApiService.getAll().subscribe(projects => {
        const projectIds = [];
        projects.forEach(project => {
          projectIds.push(project.id);
        });
        this.requestStatus(projectIds);
      })
    }

    if (/^\/app\/projects\/\d+/.test(newRoute)) {
      if (!/^\/app\/projects\/\d+/.test(this.oldRoute) || oldProjectId != newProjectId) {
        this.userEnteredProject(Number(newProjectId));
      }
    } else {
      if (/^\/app\/projects\/\d+/.test(this.oldRoute)) {
        this.userLeftProject(Number(oldProjectId));
      }
    }

    this.oldRoute = newRoute;
  }

  private processStatus(msg: WebSocketMessage) {
    const projects = msg.content;

    const update = this.activeUsers.getValue();
    for (let projectKey in projects) {
      const project = projects[projectKey];

      if (!Object.keys(project.colors).length) {
        update.delete(project.projectId);
      } else {
        let projectUser = update.get(project.projectId);
        if (!projectUser) {
          projectUser = new Map();
        } else {
          projectUser.clear();
        }

        for (let userId in project.colors) {
          projectUser.set(userId, project.colors[userId]);
        }

        update.set(project.projectId, projectUser);
      }
    }
    this.activeUsers.next(update);
    console.log(this.activeUsers.getValue());
  }

  public requestStatus(projectIds: number[]) {
    const msg = new WebSocketMessage();
    msg.entity = "ProjectPresenceService";
    msg.type = "Status Request";
    msg.content = '{"projectIds":[' + projectIds.toString() + ']}';
    this.webSocketService.send(msg);
  }

  public userEnteredProject(projectId: number) {
    const msg = new WebSocketMessage();
    msg.entity = "ProjectPresenceService";
    msg.type = "User Entered";
    msg.content = '{"projectId":"' + projectId + '"}';
    this.webSocketService.send(msg);
  }

  public userLeftProject(projectId: number) {
    const msg = new WebSocketMessage();
    msg.entity = "ProjectPresenceService";
    msg.type = "User Left";
    msg.content = '{"projectId":"' + projectId + '"}';
    this.webSocketService.send(msg);
  }

  get activeUsers$() {
    return this.activeUsers.asObservable();
  }
}
