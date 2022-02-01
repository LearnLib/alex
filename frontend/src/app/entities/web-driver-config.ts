export class WebDriverConfig {

  static Browsers = {
    Chrome: 'chrome',
    Edge: 'msedge',
    Firefox: 'firefox',
    Opera: 'opera',
    Safari: 'safari'
  };

  width = 1920;
  height = 1080;
  implicitlyWait = 0;
  pageLoadTimeout = 10;
  scriptTimeout = 10;
  platform = 'ANY';
  browser = '';
  version = '';
  headless: true;

  static fromData(data: any = {}): WebDriverConfig {
    const c = new WebDriverConfig();
    c.width = data.width;
    c.height = data.height;
    c.headless = data.headless;
    c.implicitlyWait = data.implicitlyWait;
    c.pageLoadTimeout = data.pageLoadTimeout;
    c.scriptTimeout = data.scriptTimeout;
    c.platform = data.platform;
    c.browser = data.browser;
    c.version = data.version;
    return c;
  }
}
