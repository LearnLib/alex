import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { setAngularJSGlobal } from '@angular/upgrade/static';
import * as angular from 'angular';

if (environment.production) {
  enableProdMode();
}

setAngularJSGlobal(angular);
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
