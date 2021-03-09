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

package de.learnlib.alex.common.exceptions;

import de.learnlib.alex.common.utils.RESTError;
import de.learnlib.alex.learning.exceptions.LearnerException;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.EntityNotFoundException;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import javax.ws.rs.InternalServerErrorException;
import org.apache.shiro.authz.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.NestedExceptionUtils;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * ExceptionMapper that will catch all {@link DataIntegrityViolationException}s thrown by the REST resources.
 */
@Order
@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(RestExceptionHandler.class);

    @ExceptionHandler(DataIntegrityViolationException.class)
    protected ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        logger.info("DataIntegrityViolationException caught.", e);
        final RESTError error = new RESTError(HttpStatus.INTERNAL_SERVER_ERROR, e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(LearnerException.class)
    protected ResponseEntity<Object> handleLearnerException(LearnerException e) {
        logger.info("LearnerException caught.", e);
        final RESTError error = new RESTError(HttpStatus.BAD_REQUEST, e);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(ForbiddenOperationException.class)
    protected ResponseEntity<Object> handleForbiddenOperationException(ForbiddenOperationException e) {
        logger.info("ForbiddenOperationException caught.", e);
        final RESTError error = new RESTError(HttpStatus.FORBIDDEN, e);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(NotFoundException.class)
    protected ResponseEntity<Object> handleNotFoundException(NotFoundException e) {
        logger.info("NotFoundException caught.", e);
        final RESTError error = new RESTError(HttpStatus.NOT_FOUND, e);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    protected ResponseEntity<Object> handleEntityNotFoundException(EntityNotFoundException e) {
        logger.info("EntityNotFoundException caught.", e);
        final RESTError error = new RESTError(HttpStatus.NOT_FOUND, e);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(TransactionSystemException.class)
    protected ResponseEntity<Object> handleTransactionSystemException(TransactionSystemException e) {
        logger.info("TransactionSystemException caught.", e);

        String message;
        final Throwable rootCause = NestedExceptionUtils.getRootCause(e);
        if (rootCause instanceof ConstraintViolationException) {
            final List<String> messages = ((ConstraintViolationException) rootCause).getConstraintViolations().stream()
                    .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                    .collect(Collectors.toList());
            message = String.join(",", messages);
        } else {
            message = e.getMessage();
        }

        final RESTError error = new RESTError(HttpStatus.BAD_REQUEST, new Exception(message));
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(UnauthorizedException.class)
    protected ResponseEntity<Object> handleUnauthorizedException(UnauthorizedException e) {
        logger.info("UnauthorizedException caught.", e);
        final RESTError error = new RESTError(HttpStatus.UNAUTHORIZED, e);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(InternalServerErrorException.class)
    protected ResponseEntity<Object> handleInternalServerErrorException(InternalServerErrorException e) {
        logger.info("InternalServerErrorException caught.", e);
        final RESTError error = new RESTError(HttpStatus.INTERNAL_SERVER_ERROR, e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(ValidationException.class)
    protected ResponseEntity<Object> handleValidationException(ValidationException e) {
        logger.info("ValidationException caught.", e);
        final RESTError error = new RESTError(HttpStatus.BAD_REQUEST, e);
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    protected ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException e) {
        logger.info("IllegalArgumentException caught.", e);
        final RESTError error = new RESTError(HttpStatus.BAD_REQUEST, e);
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(EntityLockedException.class)
    protected ResponseEntity<Object> handleEntityLockedException(EntityLockedException e) {
        logger.info("EntityLockedException caught.", e);
        final RESTError error = new RESTError(HttpStatus.LOCKED, e);
        return ResponseEntity.status(HttpStatus.LOCKED).body(error);
    }

    @ExceptionHandler(ResourcesExhaustedException.class)
    protected ResponseEntity<Object> handleResourcesExhaustedException(ResourcesExhaustedException e) {
        logger.info("ResourcesExhaustedException.java caught.", e);
        final RESTError error = new RESTError(HttpStatus.LOCKED, e);
        return ResponseEntity.status(HttpStatus.LOCKED).body(error);
    }
}
