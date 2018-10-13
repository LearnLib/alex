import {apiUrl} from '../../../../environments';

/** The resource for lts formulas. */
export class LtsFormulaResource {

    /**
     * Constructor.
     *
     * @param $http
     */
    // @ngInject
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Get all formulas.
     *
     * @param {number} projectId The ID of the project.
     * @return {Promise<Object>}
     */
    getAll(projectId) {
        return this.$http.get(`${apiUrl}/projects/${projectId}/ltsFormulas`);
    }

    /**
     * Create a new formula.
     *
     * @param {number} projectId The ID of the project.
     * @param {Object} formula The formula to create.
     * @return {Promise<Object>}
     */
    create(projectId, formula) {
        return this.$http.post(`${apiUrl}/projects/${projectId}/ltsFormulas`, formula);
    }

    /**
     * Update a formula.
     *
     * @param {number} projectId The ID of the project.
     * @param {Object} formula The formula to update.
     * @return {Promise<Object>}
     */
    update(projectId, formula) {
        return this.$http.put(`${apiUrl}/projects/${projectId}/ltsFormulas/${formula.id}`, formula);
    }

    /**
     * Delete a formula.
     *
     * @param {number} projectId
     * @param {number} formulaId
     * @return {Promise<Object>}
     */
    delete(projectId, formulaId) {
        return this.$http.delete(`${apiUrl}/projects/${projectId}/ltsFormulas/${formulaId}`);
    }

    /**
     * Delete many formulas at once.
     *
     * @param {number} projectId The ID of the project.
     * @param {number[]} formulaIds The IDs of the formulas to delete.
     * @return {Promise<Object>}
     */
    deleteMany(projectId, formulaIds) {
        return this.$http.delete(`${apiUrl}/projects/${projectId}/ltsFormulas/batch/${formulaIds.join(',')}`);
    }

    /**
     * Check formulas against a model.
     *
     * @param {number} projectId The ID of the project.
     * @param {Object} config The configuration.
     * @return {Promise<Object>}
     */
    check(projectId, config) {
        return this.$http.post(`${apiUrl}/projects/${projectId}/ltsFormulas/check`, config);
    }
}
