# Performing a release

In the `developer` branch, perform the following steps:

1. Update the version, in the following files:
    * `backend/pom.xml`
    * `frontend/package.json`
    * `frontend/src/environments/environment.*.ts`
    * `cli/package.json`
    * `docs/package.json`
2. Commit and push the changes to the `developer` branch.
    - Ensure that the [CI pipeline][ci] passes.
3. Merge the `developer` branch in the `master` branch.
    - Ensure that the [CI pipeline][ci] passes.
4. In the `master` branch, create a new tag with the new version and perform a GitHub release.
    - Append the current `docker-compose.production.yml` file.
      For this purpose, rename the file according to the current release version, e.g. ``docker-compose.alex-3.0.0.yml``
5. In the `developer` branch, increment the version in all files from step 1 to the next minor version and append the *-SNAPSHOT* suffix.

[ci]: https://github.com/LearnLib/alex/actions
