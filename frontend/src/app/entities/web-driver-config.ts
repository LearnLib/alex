export class WebDriverConfig {
  width = 0;
  height = 0;
  implicitlyWait = 0;
  pageLoadTimeout = 10;
  scriptTimeout = 10;
  platform = 'ANY';
  browser = '';
  version = '';
  headless: true;

  static Browsers = {
    'Chrome': 'chrome',
    'Edge': 'MicrosoftEdge',
    'Firefox': 'firefox',
    'HTML Unit': 'htmlunit',
    'Internet Explorer': 'iexplore',
    'Opera': 'operablink',
    'Safari': 'safari'
  };

  static Platforms = {
    'Default': {
      'Any': 'ANY'
    },
    'Windows': {
      'Windows': 'WINDOWS',
      'Windows 10': 'WIN10',
      'Windows 8.1': 'WIN8_1',
      'Windows 8': 'WIN8',
      'Windows Vista': 'VISTA',
      'Windows XP': 'XP'
    },
    'Mac OS': {
      'Mac OS': 'MAC',
      'Sierra': 'SIERRA',
      'El Capitan': 'EL_CAPITAN',
      'Yosemite': 'YOSEMITE',
      'Mavericks': 'MAVERICKS',
      'Mountain Lion': 'MOUNTAIN_LION',
      'Snow Leopard': 'SNOW_LEOPARD'
    },
    'Unix': {
      'Linux': 'LINUX',
      'Unix': 'UNIX'
    }
  };

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
