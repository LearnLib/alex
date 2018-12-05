# Migration to ALEX 1.6.*

A migration of the database is not foreseen for this version, but is planned for future versions.
Instead, export and import symbols and tests that you want to use in the new version.

The migration requires you have *Node.js v10* installed.

## Symbols

1. Export the symbols you want to migrate to the new version.
2. Execute `node migrate-symbols-1.5.0-to-1.6.0.js ./symbols.old.json ./symbols.new.json`.
   The new file can be imported in version 1.6.0.

## Tests

1. Export the tests you want to migrate to the new version.
2. Execute `node migrate-tests-1.5.0-to-1.6.0.js ./tests.old.json ./tests.new.json`.
   The new file can be imported in version 1.6.0.
   *Make sure that you have migrated the required symbols first.*
