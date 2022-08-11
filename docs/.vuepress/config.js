const env = require('./env.default.js');

module.exports = {
    base: env.BASE,
    title: 'ALEX Docs (v3.0.0)',
    description: 'User documentation for ALEX',
    dest: './.vuepress/dist',
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        lastUpdated: 'Last Updated',
        sidebarDepth: 2,
        sidebar: [
            ['/', 'Home'],
            {
                title: 'Getting started',
                collapsable: true,
                children: [
                    ['/contents/getting-started/installation-k8s/', 'Installation (Kubernetes)'],
                    ['/contents/getting-started/installation-docker/', 'Installation (Docker)']
                ]
            },
            {
                title: 'User manual',
                collapsable: true,
                children: [
                    ['/contents/user-manual/introduction/', 'Introduction'],
                    ['/contents/user-manual/user-management/', 'User management'],
                    ['/contents/user-manual/project-management/', 'Project management'],
                    ['/contents/user-manual/symbol-management/', 'Symbol management'],
                    ['/contents/user-manual/testing/', 'Testing'],
                    ['/contents/user-manual/learning/', 'Learning'],
                    ['/contents/user-manual/model-checking/', 'Model Checking'],
                    ['/contents/user-manual/integrations/', 'Integrations'],
                    ['/contents/user-manual/best-practices/', 'Best practices']
                ]
            },
            {
                title: 'Examples',
                collapsable: true,
                children: [
                    ['/contents/examples/todomvc/', 'TodoMVC']
                ]
            },
            {
                title: 'Development',
                collapsable: true,
                children: [
                    ['/contents/dev-docs/development-k8s/', 'Development (Kubernetes)'],
                    ['/contents/dev-docs/development-docker/', 'Development (Docker)'],
                    ['/contents/dev-docs/technologies/', 'Technologies'],
                    ['/contents/dev-docs/rest-api/', 'REST API'],
                    ['/contents/dev-docs/cli/', 'CLI'],
                    ['/contents/dev-docs/dependency/', 'ALEX as dependency'],
                    ['/contents/dev-docs/release/', 'Performing a release']
                ]
            },
            ['/contents/about/', 'About']
        ],
        nav: [
            {text: 'Homepage', link: 'https://learnlib.github.io/alex/'},
            {text: 'GitHub', link: 'https://github.com/LearnLib/alex'}
        ]
    }
};
