import { environment as env } from '../../../environments/environment';
import { IHttpService, IPromise } from 'angular';

/** The resource for lts formulas. */
export class LtsFormulaResource {

  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Get all formulas.
   *
   * @param projectId The ID of the project.
   */
  getAll(projectId: number): IPromise<any> {
    return this.$http.get(`${env.apiUrl}/projects/${projectId}/ltsFormulas`);
  }

  /**
   * Create a new formula.
   *
   * @param projectId The ID of the project.
   * @param formula The formula to create.
   */
  create(projectId: number, formula: any): IPromise<any> {
    return this.$http.post(`${env.apiUrl}/projects/${projectId}/ltsFormulas`, formula);
  }

  /**
   * Update a formula.
   *
   * @param projectId The ID of the project.
   * @param formula The formula to update.
   */
  update(projectId: number, formula: any): IPromise<any> {
    return this.$http.put(`${env.apiUrl}/projects/${projectId}/ltsFormulas/${formula.id}`, formula);
  }

  /**
   * Delete a formula.
   *
   * @param projectId
   * @param formulaId
   */
  delete(projectId: number, formulaId: number): IPromise<any> {
    return this.$http.delete(`${env.apiUrl}/projects/${projectId}/ltsFormulas/${formulaId}`);
  }

  /**
   * Delete many formulas at once.
   *
   * @param projectId The ID of the project.
   * @param formulaIds The IDs of the formulas to delete.
   */
  deleteMany(projectId: number, formulaIds: number[]): IPromise<any> {
    return this.$http.delete(`${env.apiUrl}/projects/${projectId}/ltsFormulas/batch/${formulaIds.join(',')}`);
  }

  /**
   * Check formulas against a model.
   *
   * @param projectId The ID of the project.
   * @param config The configuration.
   */
  check(projectId: number, config: any): IPromise<any> {
    return this.$http.post(`${env.apiUrl}/projects/${projectId}/ltsFormulas/check`, config);
  }
}
