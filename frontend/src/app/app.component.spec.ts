import { waitForAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppStoreService } from './services/app-store.service';
import { ClipboardService } from './services/clipboard.service';
import { ProjectApiService } from './services/api/project-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvironmentProvider } from '../environments/environment.provider';
import { WebSocketService } from './services/websocket.service';
import { WebSocketAPIService } from './services/api/websocket-api.service';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        AppStoreService,
        ClipboardService,
        ProjectApiService,
        EnvironmentProvider,
        WebSocketService,
        WebSocketAPIService
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
