# Extending ALEX

ALEX is designed to be extendable to some extend.


## Adding a new algorithm

Every new algorithm that is added to ALEX should implement the `MealyLearner<I,O>` interface of LearnLib.
Then, create a new class for the algorithm in `de.learnlib.alex.learning.entities.algorithms` according to the following pattern:

```Java
// MyLearningAlgorithm.java
@JsonTypeName("MyLearningAlgorithm")
public class MyLearningAlgorithm extends AbstractLearningAlgorithm<String, String> implements Serializable {

    private static final long serialVersionUID = -1703212406344298512L; // e.g.

    @Override
    public LearningAlgorithm.MealyLearner<String, String> createLearner(Alphabet<String> sigma, MembershipOracle<String, Word<String>> oracle) {
        // return the learner
    }

    @Override
    public String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner) {
        // return the serialized data structure;
    }
}

// AbstractLearningAlgorithm.java
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "name")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "MyLearningAlgorithm", value = TTT.class)
})
public abstract class AbstractLearningAlgorithm<I, O> implements Serializable {
    // ...
}
```


## Adding a new action

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

Use `return getSuccessOutput();` or `return getFailedOutput();` int the `execute(...)` method to indicate whether the execution of the action succeeded or failed, respectively.

Also use `insertVariableValues(String text)` when possible to allow the use of variable and counters in the properties.