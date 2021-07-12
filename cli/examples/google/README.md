# Examples

Execute the following commands from the root of this repository.

## Testing

### With a project file and setup name

```bash
npm run start -- \
    test \
    --url "http://127.0.0.1:8000" \
    --email "admin@alex.example" \
    --password "admin" \
    --project-file "./examples/google/project.json" \
    --setup-name "test google" \
    --delete-project
```

### With an existing project and setup name

```bash
npm run start -- \
    test \
    --url "http://127.0.0.1:8000" \
    --email "admin@alex.example" \
    --password "admin" \
    --project-name "google" \
    --setup-name "test google"
```

## Learning

### With a project file and setup name

```bash
npm run start -- \
    learn \
    --url "http://127.0.0.1:8000" \
    --email "admin@alex.example" \
    --password "admin" \
    --project-file "./examples/google/project.json" \
    --setup-name "learn google" \
    --delete-project
```

### With an existing project and setup name

```bash
npm run start -- \
    learn \
    --url "http://127.0.0.1:8000" \
    --email "admin@alex.example" \
    --password "admin" \
    --project-name "google" \
    --setup-name "learn google"
```

## Model comparison

```bash
npm run start -- \
    compare \
    --url "http://127.0.0.1:8000" \
    --email "admin@alex.example" \
    --password "admin" \
    --models "model1.json" "model2.json" \
    --out "model-difference-${aspect}.json"
```

## Polling

### Test report

```bash
npm run start -- \
    poll \
    test-report \
    --url "http://127.0.0.1:8000" \
    --email "admin@alex.example" \
    --password "admin" \
    --project-name "google" \
    --report-id 5
    --timeout 5000
```

### Learner result

```bash
npm run start -- \
    poll \
    learner-result \
    --url "http://127.0.0.1:8000" \
    --email "admin@alex.example" \
    --password "admin" \
    --project-name "google" \
    --result-id 5
    --timeout 500000
```
