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

ENTITIES.symbols = [
    {id: 1, revision: 1, name: 's1', abbreviation: 's1', group: 1, project: 1, user: 1, actions: [], hidden: false},
    {id: 2, revision: 1, name: 's2', abbreviation: 's2', group: 1, project: 1, user: 1, actions: [], hidden: true},
    {id: 3, revision: 1, name: 's3', abbreviation: 's3', group: 1, project: 1, user: 1, actions: [], hidden: false}
];

ENTITIES.groups = [
    {
        id: 0, user: 1, project: 1, name: 'group1', symbols: [
        {actions: []}, {actions: []}, {actions: []}
    ]
    },
    {
        id: 1, user: 1, project: 1, name: 'group2', symbols: [
        {actions: []}, {actions: []}, {actions: []}
    ]
    },
    {
        id: 2, user: 1, project: 1, name: 'group2', symbols: [
        {actions: []}, {actions: []}, {actions: []}
    ]
    }
];

ENTITIES.eqOracles = {
    random: {type: 'random_word', minLength: 2, maxLength: 5, maxNoOfTests: 10},
    complete: {type: 'complete', minDepth: 2, maxDepth: 5},
    sample: {type: 'sample', counterExamples: [{input: 's1', output: 'OK'}, {input: 's2', output: 'FAILED'}]},
    wmethod: {type: 'wmethod', maxDepth: 2}
};

ENTITIES.learnConfigurations = [
    {
        symbols: [{id: 2, revision: 1}, {id: 3, revision: 1}],
        maxAmountOfStepsToLearn: -1,
        eqOracle: {type: 'random_word', minLength: 2, maxLength: 5, maxNoOfTests: 10},
        algorithm: 'TTT',
        resetSymbol: {id: 1, revision: 1},
        comment: null,
        browser: 'htmlunitdriver'
    }
];

ENTITIES.learnResults = [{
    "algorithm": "LSTAR",
    "browser": "htmlunitdriver",
    "hypothesis": {"nodes": [0], "initNode": 0, "edges": [{"from": 0, "input": "s1", "to": 0, "output": "OK"}]},
    "project": 2,
    "resetSymbol": {"id": 1, "revision": 2},
    "sigma": ["s1"],
    "statistics": {
        "duration": 8868,
        "eqsUsed": 1,
        "mqsUsed": 23,
        "startDate": "2016-02-01T20:02:58.256+01:00",
        "symbolsUsed": 112
    },
    "steps": [{
        "algorithmInformation": "+====+====+\n|    | s1 |\n+====+====+\n| ε  | OK |\n+====+====+\n| s1 | OK |\n+====+====+\n",
        "counterExample": "",
        "eqOracle": {"type": "random_word", "minLength": 1, "maxLength": 10, "maxNoOfTests": 20},
        "hypothesis": {"nodes": [0], "initNode": 0, "edges": [{"from": 0, "input": "s1", "to": 0, "output": "OK"}]},
        "statistics": {
            "duration": 8868,
            "eqsUsed": 1,
            "mqsUsed": 23,
            "startDate": "2016-02-01T20:02:58.256+01:00",
            "symbolsUsed": 112
        },
        "stepNo": 0,
        "stepsToLearn": -1
    },{
        "algorithmInformation": "+====+====+\n|    | s1 |\n+====+====+\n| ε  | OK |\n+====+====+\n| s1 | OK |\n+====+====+\n",
        "counterExample": "",
        "eqOracle": {"type": "random_word", "minLength": 1, "maxLength": 10, "maxNoOfTests": 20},
        "hypothesis": {"nodes": [0], "initNode": 0, "edges": [{"from": 0, "input": "s1", "to": 0, "output": "OK"}]},
        "statistics": {
            "duration": 8868,
            "eqsUsed": 1,
            "mqsUsed": 23,
            "startDate": "2016-02-01T20:02:58.256+01:00",
            "symbolsUsed": 112
        },
        "stepNo": 1,
        "stepsToLearn": -1
    }],
    "symbols": [{"id": 1, "revision": 2}],
    "testNo": 1,
    "user": 1
}, {
    "algorithm": "LSTAR",
    "browser": "htmlunitdriver",
    "hypothesis": {"nodes": [0], "initNode": 0, "edges": [{"from": 0, "input": "s1", "to": 0, "output": "OK"}]},
    "project": 2,
    "resetSymbol": {"id": 1, "revision": 2},
    "sigma": ["s1"],
    "statistics": {
        "duration": 7719,
        "eqsUsed": 2,
        "mqsUsed": 43,
        "startDate": "2016-02-04T13:43:15.984+01:00",
        "symbolsUsed": 220
    },
    "steps": [{
        "algorithmInformation": "+====+====+\n|    | s1 |\n+====+====+\n| ε  | OK |\n+====+====+\n| s1 | OK |\n+====+====+\n",
        "counterExample": "",
        "eqOracle": {"type": "random_word", "minLength": 1, "maxLength": 10, "maxNoOfTests": 20},
        "hypothesis": {"nodes": [0], "initNode": 0, "edges": [{"from": 0, "input": "s1", "to": 0, "output": "OK"}]},
        "statistics": {
            "duration": 7718,
            "eqsUsed": 1,
            "mqsUsed": 23,
            "startDate": "2016-02-04T13:43:15.984+01:00",
            "symbolsUsed": 112
        },
        "stepNo": 0,
        "stepsToLearn": -1
    }, {
        "algorithmInformation": "+====+====+\n|    | s1 |\n+====+====+\n| ε  | OK |\n+====+====+\n| s1 | OK |\n+====+====+\n",
        "counterExample": "",
        "eqOracle": {"type": "random_word", "minLength": 1, "maxLength": 10, "maxNoOfTests": 20},
        "hypothesis": {"nodes": [0], "initNode": 0, "edges": [{"from": 0, "input": "s1", "to": 0, "output": "OK"}]},
        "statistics": {
            "duration": 2,
            "eqsUsed": 1,
            "mqsUsed": 20,
            "startDate": "2016-02-04T13:43:27.932+01:00",
            "symbolsUsed": 108
        },
        "stepNo": 1,
        "stepsToLearn": -1
    }],
    "symbols": [{"id": 1, "revision": 2}],
    "testNo": 2,
    "user": 1
}];