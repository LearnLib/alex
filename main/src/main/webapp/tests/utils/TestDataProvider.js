var TestDataProvider = {

    projects: [
        {
            name: 'Test',
            baseUrl: 'http://localhost:8080',
            description: null,
            id: 1
        },
        {
            name: 'Test2',
            baseUrl: 'http://localhost:8080',
            description: null,
            id: 2
        }
    ],

    symbols: [],

    symbolGroups: [
        {
            "id": 0,
            "name": "Default Group",
            "symbols": [
                {
                    "abbreviation": "s4",
                    "actions": [
                        {
                            "type": "web_checkForText",
                            "negated": false,
                            "ignoreFailure": false,
                            "value": ".*Test Page [0-9].*",
                            "regexp": true
                        }
                    ],
                    "group": 0,
                    "hidden": false,
                    "id": 4,
                    "name": "s4",
                    "project": 2,
                    "revision": 2
                },
                {
                    "abbreviation": "reset",
                    "actions": [
                        {
                            "type": "web_goto",
                            "negated": false,
                            "ignoreFailure": false,
                            "url": "/test_app.html"
                        }
                    ],
                    "group": 0,
                    "hidden": false,
                    "id": 5,
                    "name": "reset",
                    "project": 2,
                    "revision": 3
                },
                {
                    "abbreviation": "s3",
                    "actions": [
                        {
                            "type": "web_click",
                            "negated": false,
                            "ignoreFailure": false,
                            "node": "#link2"
                        }
                    ],
                    "group": 0,
                    "hidden": false,
                    "id": 3,
                    "name": "s3",
                    "project": 2,
                    "revision": 2
                },
                {
                    "abbreviation": "s2",
                    "actions": [
                        {
                            "type": "web_click",
                            "negated": false,
                            "ignoreFailure": false,
                            "node": "#link"
                        }
                    ],
                    "group": 0,
                    "hidden": false,
                    "id": 2,
                    "name": "s2",
                    "project": 2,
                    "revision": 2
                },
                {
                    "abbreviation": "s1",
                    "actions": [
                        {
                            "type": "web_checkForText",
                            "negated": false,
                            "ignoreFailure": false,
                            "value": "Lorem Ipsum",
                            "regexp": false
                        }
                    ],
                    "group": 0,
                    "hidden": false,
                    "id": 1,
                    "name": "s1",
                    "project": 2,
                    "revision": 2
                }
            ],
            "project": 2,
            "symbolAmount": 5
        }
    ],

    actions: [],

    learnConfigurations: [
        {
            "configuration": {
                "algorithm": "TTT",
                "comment": null,
                "eqOracle": {
                    "type": "random_word",
                    "minLength": 1,
                    "maxLength": 5,
                    "maxNoOfTests": 10
                },
                "maxAmountOfStepsToLearn": 0,
                "resetSymbol": {
                    "id": 5,
                    "revision": 2
                },
                "symbols": [
                    {
                        "id": 4,
                        "revision": 2
                    },
                    {
                        "id": 3,
                        "revision": 2
                    },
                    {
                        "id": 2,
                        "revision": 2
                    },
                    {
                        "id": 1,
                        "revision": 2
                    }
                ]
            }
        }
    ],

    learnResults: [
        {
            "algorithmInformation": "",
            "sigma": "void",
            "errorText": "",
            "stepNo": 0,
            "testNo": 0,
            "configuration": {
                "resetSymbol": {
                    "id": 0,
                    "revision": 0
                },
                "eqOracle": "AbstractEquivalenceOracleProxy",
                "maxAmountOfStepsToLearn": 0,
                "symbols": [
                    {
                        "id": 0,
                        "revision": 0
                    }
                ],
                "algorithm": "LearnAlgorithms"
            },
            "json": "",
            "project": 0,
            "counterExample": "",
            "error": false,
            "hypothesis": {
                "nodes": [
                    0
                ],
                "edges": [
                    {
                        "output": "",
                        "input": "",
                        "from": 0,
                        "to": 0
                    }
                ],
                "initNode": 0
            },
            "statistics": {
                "duration": 0,
                "eqsUsed": 0,
                "startTime": "",
                "mqsUsed": 0,
                "symbolsUsed": 0
            }
        }
    ],

    counters: [
        {name: 'c1', value: 0, project: 1},
        {name: 'c2', value: 10, project: 1},
        {name: 'c3', value: 100, project: 1}
    ]
};