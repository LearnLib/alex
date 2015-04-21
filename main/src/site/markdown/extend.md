Extend *ALEX*
=============
*ALEX* is designed to be expandable to some extends.

Add a new Algorithm
-------------------
Create new class in the algorithm package with implements `LearnAlgorithmFactory` and
annotate it with `@LearnAlgorithm(name = "...")`.

Implement the methods. 

Add a new Action
----------------
Extend `SymbolAction` and implement the method `execute(ConnectorManager connector)`.

Use `return getSuccessOutput();` or `return getFailedOutput();` instead of directly `return OK;` or `return FAILED;`.
So the new action supports the *negated* attribute.

Also use `insertVariableValues(String text)` when possible to allow the use of variable and counters in the properties.