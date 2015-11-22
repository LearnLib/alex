const ENTITIES = {};

ENTITIES.projects = [
    {id: 1, name: 'project1', baseUrl: 'http://localhost', user: 1, description: null},
    {id: 2, name: 'project2', baseUrl: 'http://localhost', user: 2, description: null},
    {id: 3, name: 'project3', baseUrl: 'http://localhost', user: 3, description: null}
];

ENTITIES.users = [
    {id: 1, email: 'user1@alex.example', role: 'ADMIN'},
    {id: 2, email: 'user2@alex.example', role: 'REGISTERED'},
    {id: 3, email: 'user3@alex.example', role: 'REGISTERED'}
];

ENTITIES.counters = [
    {user: 1, project: 1, name: 'i', value: 1},
    {user: 1, project: 1, name: 'j', value: 2},
    {user: 1, project: 1, name: 'k', value: 3}
];

ENTITIES.symbols = [];

ENTITIES.groups = [
    {id: 0, user: 1, project: 1, name: 'group1', symbols: [
        {actions: []}, {actions: []}, {actions: []}
    ]},
    {id: 1, user: 1, project: 1, name: 'group2', symbols: [
        {actions: []}, {actions: []}, {actions: []}
    ]},
    {id: 2, user: 1, project: 1, name: 'group2', symbols: [
        {actions: []}, {actions: []}, {actions: []}
    ]}
];