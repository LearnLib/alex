/*
 * Copyright 2015 - 2021 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.data.entities.actions.web;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.FileStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import java.io.Serializable;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

/** Action to upload a file into an input[type="file"] element. */
@Entity
@DiscriminatorValue("web_uploadFile")
@JsonTypeName("web_uploadFile")
public class UploadFileAction extends SymbolAction implements Serializable {

    private static final long serialVersionUID = -1094366952752580170L;

    private static final Logger LOGGER = LogManager.getLogger();

    /** The input element to upload the file to. */
    @NotNull
    @Embedded
    private WebElementLocator node;

    /** The name of the uploaded file in ALEX. */
    @NotEmpty
    private String fileName;

    @Override
    protected ExecuteResult execute(ConnectorManager connector) {
        final FileStoreConnector fileStore = connector.getConnector(FileStoreConnector.class);
        final WebSiteConnector webSiteConnector = connector.getConnector(WebSiteConnector.class);

        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            final String path = fileStore.getAbsoluteFileLocation(symbol.getProjectId(), fileName);
            final WebElement el = webSiteConnector.getElement(nodeWithVariables);

            if (el.getTagName().equals("input") && el.getAttribute("type").equals("file")) {
                el.sendKeys(path);
                return getSuccessOutput();
            } else {
                throw new NoSuchElementException("The element is not an input file element.");
            }
        } catch (IllegalStateException e) {
            LOGGER.info(LoggerMarkers.LEARNER, "The file '{}' could not be found in ALEX.", this.fileName);
            return getFailedOutput();
        } catch (NoSuchElementException e) {
            LOGGER.info(LoggerMarkers.LEARNER, "The element could not be found or is not an input element.");
            return getFailedOutput();
        } catch (Exception e) {
            LOGGER.info(LoggerMarkers.LEARNER, "The file could not be uploaded for an unknown reason", e);
            return getFailedOutput();
        }
    }

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
