# Model checking

ALEX allows you to automatically verify properties of learned models using model checking.
Therefor, it offers the possibility to define LTL formulas.


## Setting up LTSmin

Model checking abilities in ALEX depend on the model checking library [LTSmin](ltsmin).
The library has to be downloaded from the homepage and extracted to a place of your choice.
Inside the folder, there is a *bin* directory that contains all the binaries.
When starting ALEX, specify the path to the bin directory as an additional argument:

`java -jar alex.war --ltsmin.path=/path/to/ltsmin/bin`


## Define LTL formulas


## Verifying properties



[ltsmin]: https://ltsmin.utwente.nl/