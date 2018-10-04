
    // Test: <testName>
    // Expected Output: should <if(!shouldFail)>not <endif>fail
    @Test<if(previousTestMethodName)>(dependsOnMethods = "extern_<previousTestMethodName>")<endif>
    public void extern_<testMethodName>() {
        TestCaseStep step = testCase.get(<testMethodIndex>);
        ExecuteResult testResult = step.getPSymbol().execute(super.cm);
        Assert.assertEquals(testResult.isSuccess(), !step.isShouldFail());
    }
