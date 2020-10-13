# Examples

Execute the following commands from the root of this repository.

## Testing

### With symbols and test files

```bash
node alex-cli.js \
        --uri "http://localhost:8000" \
        --targets "https://www.google.com" "https://www.google.com" \
        -d "test" \
        -u "admin@alex.example:admin" \
        -s "./examples/google/symbols.json" \
        -t "./examples/google/tests.json" \
        -c "./examples/google/config.testing.json" \
        --clean-up
```

### With a project file

```bash
node alex-cli.js \
        --uri "http://localhost:8000" \
        -d "test" \       
        -u "admin@alex.example:admin" \ 
        -p "./examples/google/project.json" \
        -c "./examples/google/config.testing.json" \
        --clean-up
```

## Learning

```bash
node alex-cli.js \
        --uri "http://localhost:8000" \
        --targets "https://www.google.com" "https://www.google.com" \
        -d "learn" \
        -u "admin@alex.example:admin" \
        -s "./examples/google/symbols.json" \
        -c "./examples/google/config.learning.json" \
        --clean-up
```