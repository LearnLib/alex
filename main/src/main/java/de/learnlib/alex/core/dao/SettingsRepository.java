package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Settings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, Long> {

    @Query("SELECT s FROM Settings s WHERE s.id = 1")
    Settings get();

}
