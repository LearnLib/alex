package de.learnlib.alex.testsuits.repositories;

import de.learnlib.alex.testsuits.entities.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Repository to persist Test Cases.
 */
@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, UUID> {

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<TestCase> findAllByProject_Id(Long projectId);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    TestCase findOneByProject_IdAndId(Long projectId, Long id);

    @Query("SELECT t FROM TestCase t "
            + "WHERE t.project.id = ?1"
            + "      AND t.name = ?2")
    TestCase getTestCaseByName(Long projectId, String name);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    @Query("SELECT MAX(t.id) FROM TestCase t WHERE t.project.id = ?1")
    Long findHighestTestNo(Long projectId);

}
