package de.learnlib.alex.core.entities.validators;

import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Junction;
import org.hibernate.criterion.Restrictions;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

/**
 * The Validator related to the UniqueSymbolName annotation.
 */
public class UniqueSymbolNameValidator implements ConstraintValidator<UniqueSymbolName, Symbol> {

    @Override
    public void initialize(UniqueSymbolName validateUniqueNamePerUser) {
    }

    @Override
    public boolean isValid(Symbol symbol, ConstraintValidatorContext constraintValidatorContext) {
        String name = symbol.getName();
        User user = symbol.getUser();
        Project project = symbol.getProject();

        if (name == null || name.isEmpty()
                || user == null
                || project == null) {
            return false;
        }

        Junction restrictions = Restrictions.conjunction()
                                    .add(Restrictions.eq("name", name))
                                    .add(Restrictions.eq("user", user))
                                    .add(Restrictions.eq("project", project));
        if (symbol.getId() != null) {
            restrictions = restrictions.add(Restrictions.ne("idRevisionPair.id", symbol.getId()));
        }

        Session session = HibernateUtil.getSession();
        List<Symbol> symbols = session.createCriteria(Symbol.class)
                                            .add(restrictions)
                                            .list();

        for (Symbol s : symbols) {
            if (!s.equals(symbol)) {
                return false;
            }
        }

        return true;
    }
}
