import {apiUrl} from "../../../../environments";

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

    getAll(projectId) {
        return this.$http.get(`${apiUrl}/projects/${projectId}/ltsFormulas`);
    }

    create(projectId, formula) {
        return this.$http.post(`${apiUrl}/projects/${projectId}/ltsFormulas`, formula);
    }

    update(projectId, formula) {
        return this.$http.put(`${apiUrl}/projects/${projectId}/ltsFormulas/${formula.id}`, formula);
    }

    delete(projectId, formulaId) {
        return this.$http.delete(`${apiUrl}/projects/${projectId}/ltsFormulas/${formulaId}`);
    }

    deleteMany(projectId, formulaIds) {
        return this.$http.delete(`${apiUrl}/projects/${projectId}/ltsFormulas/batch/${formulaIds.join(',')}`);
    }
}