package de.learnlib.alex.actions;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class CredentialsTest {

    @Test
    public void shouldCreateCorrectBase64() {
        Credentials credentials = new Credentials("alex", "alex");

        assertThat(credentials.toBase64(), is(equalTo("YWxleDphbGV4")));
    }

}
