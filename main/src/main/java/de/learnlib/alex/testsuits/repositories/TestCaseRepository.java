package de.learnlib.alex.testsuits.repositories;

import de.learnlib.alex.testsuits.entities.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository to persist Test Cases.
 */
@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
}
