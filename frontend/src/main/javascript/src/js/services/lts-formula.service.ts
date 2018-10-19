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

import * as remove from 'lodash/remove';
import {LtsFormulaResource} from './resources/lts-formula-resource.service';
import {IPromise} from 'angular';

export interface LtsFormulaStore {
  ltsFormulas: any[];
}

export class LtsFormulaService {

  /** The store. */
  public store: LtsFormulaStore;

  /**
   * Constructor.
   *
   * @param $uibModal
   * @param ltsFormulaResource
   */
  /* @ngInject */
  constructor(private $uibModal: any,
              private ltsFormulaResource: LtsFormulaResource) {

    this.store = {
      ltsFormulas: []
    };
  }

  /**
   * Load all formulas into the store.
   *
   * @param projectId The ID of the project.
   * @returns A promise with all formulas.
   */
  load(projectId: number): IPromise<any> {
    return this.ltsFormulaResource.getAll(projectId)
      .then(res => {
        this.store.ltsFormulas = res.data;
        return this.store.ltsFormulas;
      });
  }

  openCreateModal(): IPromise<any> {
    return this.$uibModal.open({
      component: 'ltsFormulaCreateModal'
    }).result;
  }

  openEditModal(formula: any): IPromise<any> {
    return this.$uibModal.open({
      component: 'ltsFormulaEditModal',
      resolve: {
        formula: () => JSON.parse(JSON.stringify(formula))
      }
    }).result;
  }

  create(projectId: number, formula: any): IPromise<any> {
    return this.ltsFormulaResource.create(projectId, formula)
      .then(res => {
        const createdFormula = res.data;
        this.store.ltsFormulas.push(createdFormula);
        return createdFormula;
      });
  }

  update(formula: any): IPromise<any> {
    return this.ltsFormulaResource.update(formula.projectId, formula)
      .then(res => {
        const updatedFormula = res.data;
        const i = this.store.ltsFormulas.findIndex(f => f.id === formula.id);
        if (i > -1) this.store.ltsFormulas[i] = updatedFormula;
        return updatedFormula;
      });
  }

  delete(formula: any): IPromise<any> {
    return this.ltsFormulaResource.delete(formula.projectId, formula.id)
      .then(() => {
        remove(this.store.ltsFormulas, f => f.id === formula.id);
        return formula.id;
      });
  }

  deleteMany(formulas: any[]): IPromise<any> {
    const ids = formulas.map(f => f.id);
    return this.ltsFormulaResource.deleteMany(formulas[0].projectId, ids)
      .then(() => {
        remove(this.store.ltsFormulas, f => ids.indexOf(f.id) > -1);
        return ids;
      });
  }
}