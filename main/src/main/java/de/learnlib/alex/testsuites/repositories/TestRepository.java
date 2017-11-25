package de.learnlib.alex.testsuites.repositories;

import de.learnlib.alex.testsuites.entities.Test;
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
public interface TestRepository extends JpaRepository<Test, UUID> {

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    @Query("SELECT t FROM Test t WHERE t.project.id = ?1 AND t.parent = NULL")
    List<Test> findAllByProject_Id(Long projectId);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    Test findOneByProject_IdAndId(Long projectId, Long id);

    @SuppressWarnings("checkstyle:methodname")
    Test findOneByProject_IdAndName(Long projectId, String name);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    @Query("SELECT MAX(t.id) FROM Test t WHERE t.project.id = ?1")
    Long findHighestTestNo(Long projectId);

}
