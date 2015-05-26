var TestDataProvider = {

    projects: [],

    symbols: [],

    actions: [],

    learnConfigurations: [],

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