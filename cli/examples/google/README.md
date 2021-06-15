# Examples

Execute the following commands from the root of this repository.

## Testing

### With a project file by setup name

```bash
node alex-cli.js \
        --uri "http://127.0.0.1:8000" \
        -d "test" \
        -u "admin@alex.example:admin" \
        -p "./examples/google/project.json" \
        --setup "test google" \
        --clean-up
```

## Learning

### With a project file by setup name

```bash
node alex-cli.js \
        --uri "http://127.0.0.1:8000" \
        -d "learn" \
        -u "admin@alex.example:admin" \
        -p "./examples/google/project.json" \
        --setup "learn google" \
        --clean-up
```

## Model comparison

```bash
alex-cli \
    --uri "http://127.0.0.1:8000" \
    --do "compare" \
    --user "admin@alex.example:admin" \
    --models "model1.json" "model2.json" \
    --output "model-difference-${aspect}.json"
```