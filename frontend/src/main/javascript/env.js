(function (window) {
    window.__env = window.__env || {};

    /**
     * API URL
     *
     * Change it to '/rest' before ALEX is packaged.
     * Otherwise change it to the URL where the API is currently running.
     *
     * @type {string}
     */
    window.__env.apiUrl = '/rest';
    // window.__env.apiUrl = 'http://localhost:8000/rest';
}(this));
