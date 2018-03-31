package de.learnlib.alex.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.learnlib.alex.testing.entities.TestCaseSymbolStep;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

/**
 * The value of a symbol parameter.
 */
@Entity
public class SymbolParameterValue implements Serializable {

    private static final long serialVersionUID = 2125637165072908329L;

    /** The id of the value in the db. */
    @Id
    @GeneratedValue
    private Long id;

    /** The parameter for which its value is saved */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "symbolParameterId")
    private SymbolParameter parameter;

    /** The step where the value is referenced. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testCaseSymbolStepId")
    @JsonIgnore
    private TestCaseSymbolStep step;

    /** The value for the parameter */
    private String value;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SymbolParameter getParameter() {
        return parameter;
    }

    public void setParameter(SymbolParameter parameter) {
        this.parameter = parameter;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public TestCaseSymbolStep getStep() {
        return step;
    }

    public void setStep(TestCaseSymbolStep step) {
        this.step = step;
    }
}
