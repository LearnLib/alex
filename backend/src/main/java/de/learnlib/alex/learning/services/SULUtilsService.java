package de.learnlib.alex.learning.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.learning.entities.ReadOutputConfig;
import de.learnlib.alex.learning.exceptions.LearnerException;
import de.learnlib.alex.learning.services.connectors.PreparedConnectorContextHandlerFactory;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SULUtilsService {

  private final PreparedConnectorContextHandlerFactory contextHandlerFactory;

  @Autowired
  public SULUtilsService(PreparedConnectorContextHandlerFactory contextHandlerFactory) {
    this.contextHandlerFactory = contextHandlerFactory;
  }

  /**
   * Determine the output of the SUL by testing a sequence of input symbols.
   *
   * @param user
   *         The current user.
   * @param project
   *         The project.
   * @param readOutputConfig
   *         The config to use.
   * @return The outputs of the SUL.
   */
  @Transactional(rollbackFor = Exception.class)
  public List<ExecuteResult> getSystemOutputs(
      User user,
      Project project,
      ProjectEnvironment environment,
      ReadOutputConfig readOutputConfig
  ) {
    final var ctxHandler = contextHandlerFactory.createPreparedContextHandler(
        user,
        project,
        readOutputConfig.getDriverConfig(),
        readOutputConfig.getPreSymbol(),
        readOutputConfig.getPostSymbol()
    );
    final var connectors = ctxHandler.create(environment).createContext();

    try {
      final var outputs = readOutputConfig.getSymbols().stream()
          .map(s -> s.execute(connectors))
          .toList();
      connectors.dispose();
      connectors.post();
      return outputs;
    } catch (Exception e) {
      connectors.dispose();
      connectors.post();

      throw new LearnerException("Could not read the outputs", e);
    }
  }
}
