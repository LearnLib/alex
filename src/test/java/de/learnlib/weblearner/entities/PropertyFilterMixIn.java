package de.learnlib.weblearner.entities;

import com.fasterxml.jackson.annotation.JsonFilter;

/**
 * Helper class to filter entities on JSON serializing without adding the filter annotation to them.
 */
@JsonFilter("filter properties by name")
public class PropertyFilterMixIn {}