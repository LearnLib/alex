/*
 * Copyright 2015 - 2020 TU Dortmund
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

import { Pipe, PipeTransform } from '@angular/core';
import { BaseApiService } from '../services/api/base-api.service';
import { ImgCacheService } from '../services/img-cache.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { EnvironmentProvider } from '../../environments/environment.provider';

@Pipe({
    name: 'fetchImgSecure'
})
export class FetchImgSecurePipe extends BaseApiService implements PipeTransform {

    constructor(private imgCacheService: ImgCacheService,
                private http: HttpClient, private env: EnvironmentProvider) {
        super();
    }

    transform(src: string): BehaviorSubject<string> {
        if (this.imgCacheService.has(src)) {
            return this.imgCacheService.get(src);
        }

        const options = {
            headers: this.defaultHttpHeaders.set('Accept', 'application/octet-stream'),
            responseType: 'blob',
            observe: 'response'
        };

        /* deliver blank image while loading the real image */
        const bSubject = new BehaviorSubject<string>('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
        this.imgCacheService.put(src, bSubject);

        this.http.get(`${this.env.apiUrl}${src}`, options as any).subscribe((response: any) => {
            const reader = new FileReader();
            reader.readAsDataURL(response.body);
            reader.onloadend = function() {
                bSubject.next(reader.result as string);
            };
        });

        return bSubject;
    }
}
