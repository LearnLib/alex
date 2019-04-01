# Model checking

ALEX allows you to automatically verify properties of learned models using model checking.
Therefor, it offers the possibility to define LTL formulas.


## Setting up LTSmin

Model checking abilities in ALEX depend on the model checking library [LTSmin](ltsmin).
The library has to be downloaded from the homepage and extracted to a place of your choice.
Inside the folder, there is a *bin* directory that contains all the binaries.
When starting ALEX, specify the path to the bin directory as an additional argument:

`java -jar alex-1.7.0.war --ltsmin.path=/path/to/ltsmin/bin`


## Define LTL formulas

Currently, ALEX only supports model checking using LTL formulas.
To define formulas that you want to have checked later on:

1. In the sidebar, click on **Learning > Lts Formulas**
2. Click on the **Create**-button in the action bar
3. In the dialog, define a property using [this syntax](ltl-syntax) and give the formula an optional name.
   Additionally, use the keywords *input* and *output* to query edge labels of the automaton, e.g. 
   
   `[](input == "Delete" -> output == "Ok")`
   
4. Click on **Create**


## Verifying properties

1. Open any learned model
2. Select the model checking view by selecting the item **Checking** from the select menu on the top right
3. Select all formulas that you want to have verified or enter additional properties
4. Optionally, change the parameters for minimum unfolds and the multiplier 
5. Click on the **Run checks**-button
6. If a counterexample could be found, it is displayed below the corresponding formula


[ltsmin]: https://ltsmin.utwente.nl/
[ltl-syntax]: https://ltsmin.utwente.nl/assets/man/ltsmin-ltl.html