import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {WebSocketService} from "./websocket.service";
import {WebSocketMessage} from "../entities/websocket-message";
import {NavigationEnd, Router} from "@angular/router";
import {TestApiService} from "./api/test-api.service";
import {filter} from "rxjs/operators";
import {ProjectApiService} from "./api/project-api.service";

@Injectable()
export class TestPresenceService {

  private accessedTests = new BehaviorSubject(new Map());

  private oldRoute = "";

  constructor(private webSocketService: WebSocketService,
              private router: Router,
              private projectApiService: ProjectApiService) {
    this.webSocketService.register(msg => msg.entity == "TestPresenceService"
                                                 && msg.type == "Status")
      .subscribe(msg => this.processStatus(msg));

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(r => this.routeChange(r));
  }

  private routeChange(r: any) {
    const newRoute = r.urlAfterRedirects;
    const oldProjectId = this.oldRoute.split("/")[3];
    const oldTestId = this.oldRoute.split("/")[5];
    const newProjectId = newRoute.split("/")[3];
    const newTestId = newRoute.split("/")[5];

    console.log(this.oldRoute);
    console.log(newRoute);
    console.log(oldProjectId);
    console.log(oldTestId);
    console.log(newProjectId);
    console.log(newTestId);

    if (/^\/app\/projects\/\d+\/tests/.test(newRoute) && !/^\/app\/projects\/\d+\/tests/.test(this.oldRoute)) {
      console.log("Status Request Triggered!");

      this.projectApiService.getAll().subscribe(projects => {
        const projectIds = [];
        projects.forEach(project => {
          projectIds.push(project.id);
        });
        this.requestStatus(projectIds);
      })
    }

    if (/^\/app\/projects\/\d+\/tests\/\d+/.test(newRoute)) {
      console.log("New Route qualifies as test.");
      if(!/^\/app\/projects\/\d+\/tests\/\d+/.test(this.oldRoute) || oldProjectId != newProjectId || oldTestId != newTestId) {
        this.userEnteredTest(Number(newProjectId), Number(newTestId));
      }
    } else {
      console.log("New Route NOT qualified as Test.");
      if (/^\/app\/projects\/\d+\/tests\/\d+/.test(this.oldRoute)) {
        this.userLeftTest(Number(oldProjectId), Number(oldTestId));
      }
    }

    this.oldRoute = newRoute;
  }

  private processStatus(msg: WebSocketMessage) {
    console.log(msg.content);

    const projects = msg.content;

    const update = this.accessedTests.getValue();
    for (let projectId in projects) {
      const tests = projects[projectId];

      if (!Object.keys(tests).length) {
        update.delete(projectId);
      } else {
        let testsObject = update.get(projectId);
        if (!testsObject) {
          testsObject = new Map();
        } else {
          testsObject.clear();
        }

        for (let testId in tests) {
          const test = tests[testId];
          const testObject: {[key: string]: any} = {};
          testObject.type = test.type;

          if (test.type == "case") {
            testObject.username = test.username;
            testObject.date = new Date(test.timestamp);
          } else {
            testObject.locks = test.locks;
          }

          testsObject.set(testId, testObject)
        }

        update.set(projectId, testsObject);
      }
    }

    this.accessedTests.next(update);
    console.log(this.accessedTests.getValue());
  }

  private userEnteredTest(projectId: number, testId: number) {
    const msg = new WebSocketMessage();
    msg.entity = "TestPresenceService";
    msg.type = "User Entered";
    msg.content = '{"projectId":"' + projectId + '",' +
                  '"testId":"' + testId + '"}';
    this.webSocketService.send(msg);
  }

  private userLeftTest(projectId: number, testId: number) {
    const msg = new WebSocketMessage();
    msg.entity = "TestPresenceService";
    msg.type = "User Left";
    msg.content = '{"projectId":"' + projectId + '",' +
      '"testId":"' + testId + '"}';
    this.webSocketService.send(msg);
  }

  public requestStatus(projectIds: number[]) {
    const msg = new WebSocketMessage();
    msg.entity = "TestPresenceService";
    msg.type = "Status Request";
    msg.content = '{"projectIds":[' + projectIds.toString() + ']}';
    this.webSocketService.send(msg);
  }

  get accessedTests$() {
    return this.accessedTests.asObservable();
  }

  get accessedTestsValue() {
    return this.accessedTests.getValue();
  }
}
