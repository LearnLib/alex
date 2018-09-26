module.exports = {
    title: 'ALEX Docs (v1.6.0)',
    description: 'User documentation for ALEX',
    dest: './.vuepress/dist',
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        sidebarDepth: 2,
        sidebar: [
            ['/', 'Home'],
            ['/contents/about/', 'About'],
            ['/contents/faq/', 'FAQ'],
            {
                title: 'Getting started',
                collapsable: true,
                children: [
                    ['/contents/getting-started/installation/', 'Installation'],
                    ['/contents/getting-started/configuration/', 'Configuration']
                ]
            },
            {
                title: 'User manual',
                collapsable: true,
                children: []
            },
            {
                title: 'Examples',
                collapsable: true,
                children: [
                    ['/contents/examples/todomvc/', 'TodoMVC']
                ]
            },
            {
                title: 'Developer docs',
                collapsable: true,
                children: []
            }
        ],
        nav: [
            {text: 'Homepage', link: 'https://learnlib.github.io/alex/'},
            {text: 'GitHub', link: 'https://github.com/LearnLib/alex'}
        ]
    }
};
