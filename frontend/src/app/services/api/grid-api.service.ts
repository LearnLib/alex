import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { EnvironmentProvider } from '../../../environments/environment.provider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridStatus } from '../../entities/grid';

@Injectable()
export class GridApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  getStatus(): Observable<GridStatus> {
    return this.http.get(`${this.env.apiUrl}/grid/status`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => <GridStatus> body)
      );
  }
}
