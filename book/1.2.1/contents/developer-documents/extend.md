Extend *ALEX*
=============
*ALEX* is designed to be expandable to some extend.


Add a new algorithm
-------------------
Create new class in the algorithm package with implements `LearnAlgorithmFactory` and
annotate it with `@LearnAlgorithm(name = "...")`. Implement the methods. 


Add a new action
----------------
Extend `SymbolAction` and implement the method `execute(ConnectorManager connector)` and add the new JSON sub type to the `SymbolAction` class like in the following:

```Java
   // MyNewAction.java
   @Entity
   @DiscriminatorValue("new_action_name")
   @JsonTypeName("new_action_name")
   public class MyNewAction extends SymbolAction {
       @Override
       public ExecuteResult execute(ConnectorManager connector) {
           // ...
       }
   }
   
   // SymbolAction.java
   // ...
   @JsonSubTypes({
        // ...
        @JsonSubTypes.Type(name = "new_action_name", value = MyNewAction.class),
   })
   public abstract class SymbolAction implements Serializable {
        // ...
   }
```

Use `return getSuccessOutput();` or `return getFailedOutput();` instead of directly `return OK;` or `return FAILED;`.
So the new action supports the *negated* attribute.

Also use `insertVariableValues(String text)` when possible to allow the use of variable and counters in the properties.