\<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
\<suite name ="<testSuiteName>">
	\<test name="<testSuiteName>">
		\<classes>
			<testCaseNames:{ tcn | \<class name="de.learnlib.alex.plugin.generated.<tcn>"/> }>
		\</classes>
	\</test>
\</suite>