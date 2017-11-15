package de.learnlib.alex.testsuits.repositories;

import de.learnlib.alex.testsuits.entities.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Repository to persist Test Cases.
 */
@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<TestCase> findAllByUser_IdAndProject_Id(Long userId, Long projectId);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    TestCase findOneByUser_IdAndProject_IdAndId(Long userId, Long projectId, Long id);

    @Query("SELECT t FROM TestCase t "
            + "WHERE t.user.id = ?1"
            + "      AND t.project.id = ?2"
            + "      AND t.name = ?3")
    TestCase getTestCaseByName(Long userId, Long projectId, String name);

}
