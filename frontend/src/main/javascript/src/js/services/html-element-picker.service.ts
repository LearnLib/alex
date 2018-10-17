/*
 * Copyright 2018 TU Dortmund
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

import {ICompileService, IDocumentService, IPromise, IQService, IRootScopeService} from 'angular';

/**
 * The service fot the html element picker.
 */
export class HtmlElementPickerService {

  /** The url that was opened until the picker got closed. */
  public url: string;

  /**
   * Constructor.
   */
  // @ngInject
  constructor(private $q: IQService,
              private $rootScope: IRootScopeService,
              private $compile: ICompileService,
              private $document: IDocumentService) {
    this.url = null;
  }

  /** Opens the element picker. */
  open(): IPromise<any> {
    const deferred = this.$q.defer();

    // make sure the element picker is not opened twice.
    if (document.getElementById('html-element-picker') !== null) {
      deferred.reject();
      return;
    }

    // the picker element
    let picker = null;

    // create an new scope for the picker
    const scope = <any> this.$rootScope.$new();
    scope.close = (data) => {
      this.url = data.url;
      deferred.resolve(data);
      picker.remove();
    };
    scope.dismiss = (data) => {
      this.url = data.url;
      deferred.reject(data);
      picker.remove();
    };
    scope.url = this.url;

    // create a new element picker under the current scope and append to the body
    picker = this.$compile('<html-element-picker close="close" dismiss="dismiss" url="url"></html-element-picker>')(scope);
    this.$document.find('body').prepend(picker);

    return deferred.promise;
  }
}
