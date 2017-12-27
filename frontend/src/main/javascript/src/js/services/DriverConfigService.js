/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {webBrowser} from '../constants';

/**
 * The service to create new web driver config objects.
 */
export class DriverConfigService {

    /**
     * The name of the web driver to create.
     *
     * @param {string} name - The name of the web driver.
     * @returns {*}
     */
    static createFromName(name) {
        const config = {
            width: screen.width,
            height: screen.height,
            implicitlyWait: 0,
            pageLoadTimeout: 10,
            scriptTimeout: 10
        };

        switch (name) {
            case webBrowser.CHROME:
                return Object.assign(config, {
                    name: webBrowser.CHROME,
                    headless: false,
                    xvfbPort: null
                });
            case webBrowser.EDGE:
                return Object.assign(config, {
                    name: webBrowser.EDGE
                });
            case webBrowser.FIREFOX:
                return Object.assign(config, {
                    name: webBrowser.FIREFOX,
                    headless: false,
                    xvfbPort: null
                });
            case webBrowser.HTML_UNIT:
                return Object.assign(config, {
                    name: webBrowser.HTML_UNIT
                });
            case webBrowser.SAFARI:
                return Object.assign(config, {
                    name: webBrowser.SAFARI
                });
            case webBrowser.REMOTE:
                return Object.assign(config, {
                    name: webBrowser.REMOTE,
                    platform: 'ANY',
                    browser: '',
                    version: ''
                });
            default:
                return {};
        }
    }
}
