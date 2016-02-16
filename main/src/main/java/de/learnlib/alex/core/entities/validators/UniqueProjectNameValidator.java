package de.learnlib.alex.core.entities.validators;

import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

/**
 * The Validator related to the UniqueProjectName annotation.
 */
public class UniqueProjectNameValidator implements ConstraintValidator<UniqueProjectName, Project> {

    @Override
    public void initialize(UniqueProjectName validateUniqueNamePerUser) {
    }

    @Override
    public boolean isValid(Project project, ConstraintValidatorContext constraintValidatorContext) {
        String name = project.getName();
        if (name == null || name.isEmpty()) {
            return false;
        }

        User user = project.getUser();
        if (user == null) {
            return false;
        }

        Session session = HibernateUtil.getSession();
        List<Project> projects = session.createCriteria(Project.class)
                                            .add(Restrictions.eq("name", name))
                                            .add(Restrictions.eq("user", user))
                                            .list();

        for (Project p : projects) {
            if (!p.equals(project)) {
                return false;
            }
        }

        return true;
    }
}
