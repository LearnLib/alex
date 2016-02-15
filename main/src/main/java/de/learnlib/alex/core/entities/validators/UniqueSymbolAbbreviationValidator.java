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
 * The Validator related to the UniqueSymbolAbbreviation annotation.
 */
public class UniqueSymbolAbbreviationValidator implements ConstraintValidator<UniqueSymbolAbbreviation, Symbol> {

    @Override
    public void initialize(UniqueSymbolAbbreviation validateUniqueAbbreviationPerUser) {
    }

    @Override
    public boolean isValid(Symbol symbol, ConstraintValidatorContext constraintValidatorContext) {
        String abbreviation = symbol.getAbbreviation();
        User user = symbol.getUser();
        Project project = symbol.getProject();

        if (abbreviation == null || abbreviation.isEmpty()
                || user == null
                || project == null) {
            return false;
        }

        Junction restrictions = Restrictions.conjunction()
                                    .add(Restrictions.eq("abbreviation", abbreviation))
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
