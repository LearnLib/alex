package de.learnlib.alex.core.entities.validators;

import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

/**
 * The Validator related to the UniqueSymbolGroupName annotation.
 */
public class UniqueSymbolGroupNameValidator implements ConstraintValidator<UniqueSymbolGroupName, SymbolGroup> {

    @Override
    public void initialize(UniqueSymbolGroupName validateUniqueNamePerUser) {
    }

    @Override
    public boolean isValid(SymbolGroup group, ConstraintValidatorContext constraintValidatorContext) {
        String name = group.getName();
        User user = group.getUser();
        Project project = group.getProject();

        if (name == null || name.isEmpty()
                || user == null
                || project == null) {
            return false;
        }

        Session session = HibernateUtil.getSession();
        List<SymbolGroup> groups = session.createCriteria(SymbolGroup.class)
                                            .add(Restrictions.eq("name", name))
                                            .add(Restrictions.eq("user", user))
                                            .add(Restrictions.eq("project", project))
                                            .list();

        for (SymbolGroup g : groups) {
            if (!g.equals(group)) {
                return false;
            }
        }

        return true;
    }
}
