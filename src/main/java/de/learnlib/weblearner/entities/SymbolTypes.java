package de.learnlib.weblearner.entities;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * The enumeration of all available Symbol types.
 */
public enum SymbolTypes {

    UNKNOWN(Symbol.class),

    /** Symbol for web sites. */
    WEB(WebSymbol.class),

    /** Symbol for web services. */
    REST(RESTSymbol.class);


    /** The class represented by the enum entry. */
    private Class<? extends Symbol> clazz;

    /**
     * Private constructor because it is an enum.
     *
     * @param clazz The class related to the enum entry.
     */
    private SymbolTypes(Class<? extends Symbol> clazz) {
        this.clazz = clazz;
    }

    /**
     * Get the class represented by the enum entry.
     *
     * @return The related class.
     */
    public Class<? extends Symbol> getClazz() {
        return clazz;
    }

    /**
     * Parse a string into an entry of this enum.
     * It is forbidden to override toValue(), so we use this method to allow the lowercase variants, too.
     * This method will not throw an exception; IF the name could not be parsed 'UNKNOWN' is returned.
     *
     * @param name
     *         THe name to parse into an entry.
     * @return The fitting entry of this enum or 'UNKNOWN'.
     */
    @JsonCreator
    public static SymbolTypes fromString(String name) {
        try {
            return SymbolTypes.valueOf(name.toUpperCase());
        } catch (IllegalArgumentException e) {
            return UNKNOWN;
        }
    }

    @Override
    @JsonValue
    public String toString() {
        return name().toLowerCase();
    }

}

