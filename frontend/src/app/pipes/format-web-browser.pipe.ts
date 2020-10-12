import { Pipe, PipeTransform } from '@angular/core';
import { WebDriverConfig } from '../entities/web-driver-config';

@Pipe({
  name: 'formatWebBrowser'
})
export class FormatWebBrowserPipe implements PipeTransform {

  private browsers = {};

  constructor() {
    for (let key in WebDriverConfig.Browsers) {
      this.browsers[WebDriverConfig.Browsers[<string> key]] = key
    }
  }

  transform(value: string, ...args: string[]): string {
    return this.browsers[value];
  }
}
