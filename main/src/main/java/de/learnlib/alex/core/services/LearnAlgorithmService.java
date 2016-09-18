package de.learnlib.alex.core.services;

import de.learnlib.alex.algorithms.LearnAlgorithmFactory;
import de.learnlib.alex.annotations.LearnAlgorithm;
import de.learnlib.alex.core.entities.Algorithm;
import org.springframework.stereotype.Service;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

/**
 * A Service to manage the available LearnAlgorithms.
 */
@Service
public class LearnAlgorithmService {

    /** Map to store the algorithms. */
    private Map<Algorithm, LearnAlgorithmFactory> learnAlgorithms;

    /**
     * Default constructor which only initializes the algorithm map.
     */
    public LearnAlgorithmService() {
        learnAlgorithms = new HashMap<>();
    }

    /**
     * Add a new LearnAlgorithm to the set of available algorithms.
     *
     * @param learnAlgorithmClass
     *         The {@link LearnAlgorithmFactory} class with the {@link LearnAlgorithm} annotation to add.
     * @throws IllegalArgumentException
     *         If the provided class has no {@link LearnAlgorithm} annotation, does not implement the
     *         {@link LearnAlgorithmFactory} interface, has no default constructor or fails the reflection in any
     *         other way.
     */
    public void addAlgorithm(Class<?> learnAlgorithmClass) throws IllegalArgumentException {
        LearnAlgorithm annotation = learnAlgorithmClass.getAnnotation(LearnAlgorithm.class);
        if (annotation == null) {
            throw new IllegalArgumentException("'" + learnAlgorithmClass + "' is missing the LearnAlgorithm "
                                                       + "annotation!");
        }
        String algorithmName       = annotation.name();
        String algorithmPrettyName = annotation.prettyName();

        if (!LearnAlgorithmFactory.class.isAssignableFrom(learnAlgorithmClass)) {
            throw new IllegalArgumentException("Missing LearnAlgorithmFactory implementation!");
        }

        try {
            Constructor<?> constructor = learnAlgorithmClass.getConstructor();
            LearnAlgorithmFactory algorithmFactory = (LearnAlgorithmFactory) constructor.newInstance();

            Algorithm algorithm = new Algorithm(algorithmName, algorithmPrettyName);

            learnAlgorithms.put(algorithm, algorithmFactory);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException
                | InstantiationException e) {
            throw new IllegalArgumentException("Could not initialize the LearnAlgorithmFactory!", e);
        }
    }

    /**
     * Get a LearnAlgorithmFactory by its corresponding {@link Algorithm} entity.
     *
     * @param name
     *         The name of the requested LearnAlgorithm.
     * @return The requested LearnAlgorithmFactory or null.
     */
    public LearnAlgorithmFactory getLearnAlgorithm(Algorithm name) {
        return learnAlgorithms.get(name);
    }

    /**
     * Returns the amount of available algorithms.
     *
     * @return How many algorithms are available.
     */
    public int size() {
        return learnAlgorithms.size();
    }

}
