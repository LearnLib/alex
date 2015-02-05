package de.learnlib.weblearner.entities;


import com.fasterxml.jackson.annotation.JsonValue;

/**
 * The enumeration of all available Symbol types.
 */
public enum SymbolTypes {

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

    @Override
    @JsonValue
    public String toString() {
        return name().toLowerCase();
    }

}

