
    // Test: <testName>
    // Expected Output: <output>
    @Test<if(previousTestMethodName)>(dependsOnMethods = "<previousTestMethodName>")<endif>
    public void <testMethodName>() {
        ExecuteResult testResult = testCase.get(<testMethodIndex>).execute(super.cm);
        Assert.assertEquals(testResult.getOutput(), outcome.get(<testMethodIndex>));
    }