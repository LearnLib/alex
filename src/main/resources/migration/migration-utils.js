const fs = require('fs');
const path = require('path');

module.exports.readInput = function () {
    const argv = process.argv;
    if (argv.length !== 4) {
        console.error('You haven\'t specified and input and an output file.');
        return 0;
    }

    const input = path.join(process.cwd(), argv[2]);
    const output = path.join(process.cwd(), argv[3]);

    if (!fs.existsSync(input)) {
        console.error('The input file cannot be found.');
        process.exit(1);
    }

    const content = fs.readFileSync(input);
    let data = null;
    try {
        data = JSON.parse(content);
    } catch (e) {
        console.error('Could not parse input file.');
        process.exit(1);
    }

    return {
        inFile: input,
        outFile: output,
        data: data
    };
};

module.exports.writeOutput = function (config, version) {
    config.data.version = version;
    fs.writeFileSync(config.outFile, JSON.stringify(config.data, null, 2));
};
