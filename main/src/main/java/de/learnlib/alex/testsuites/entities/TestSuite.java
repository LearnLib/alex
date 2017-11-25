package de.learnlib.alex.testsuites.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;


@Entity
@DiscriminatorValue("suite")
@JsonTypeName("suite")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TestSuite extends Test implements Serializable {

    private class TestRepresentation {
        private Long id;
        private String name;
        private String type;

        TestRepresentation(Long id, String name, String type) {
            this.id = id;
            this.name = name;
            this.type = type;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }

    private Set<Test> tests;
    private Set<Long> testsAsIds;

    public TestSuite() {
        this.tests = new HashSet<>();
    }

    @OneToMany(
            mappedBy = "parent",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}
    )
    @JsonIgnore
    public Set<Test> getTests() {
        return tests;
    }

    /**
     * @return A list of Test IDs.
     */
    @Transient
    @JsonIgnore
    public Set<Long> getTestsAsIds() {
        if (testsAsIds == null || testsAsIds.isEmpty()) {
            testsAsIds = new HashSet<>();
        }
        return testsAsIds;
    }

    @Transient
    @JsonProperty("tests")
    public Set<TestRepresentation> getTestRepresnations() {
        if (tests == null || tests.isEmpty()) {
            return new HashSet<>();
        } else {
            return tests.stream()
                    .map(t -> new TestRepresentation(t.id, t.name, t instanceof TestCase ? "case" : "suite"))
                    .collect(Collectors.toSet());
        }
    }

    @JsonIgnore
    public void setTests(Set<Test> tests) {
        if (tests == null) {
            this.tests = new HashSet<>();
        } else {
            this.tests = tests;
            this.testsAsIds = tests.stream().map(Test::getId).collect(Collectors.toSet());
        }
    }

    /**
     * @param testsAsIds A list of Test IDs.
     */
    @Transient
    @JsonProperty("tests")
    public void setTestsAsIds(Set<Long> testsAsIds) {
        this.testsAsIds = testsAsIds;
    }

    @JsonIgnore
    public void addTest(Test test) {
        this.tests.add(test);
        test.setParent(this);
    }

}

