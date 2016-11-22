package de.learnlib.alex.core.repositories;

import de.learnlib.alex.core.entities.SymbolAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * The repository for symbol actions.
 */
@Repository
public interface SymbolActionRepository extends JpaRepository<SymbolAction, Long> {

    @Transactional
    Long deleteBySymbol_Id(Long symbolId);
}
