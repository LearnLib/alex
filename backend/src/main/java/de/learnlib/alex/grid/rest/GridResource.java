/*
 * Copyright 2015 - 2022 TU Dortmund
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

package de.learnlib.alex.grid.rest;

import de.learnlib.alex.common.exceptions.RestException;
import de.learnlib.alex.grid.entities.GridStatus;
import javax.ws.rs.core.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController()
@RequestMapping("/rest/grid")
public class GridResource {

    @Value("${selenium.grid.host}")
    private String gridHost;

    @Value("${selenium.grid.port}")
    private String gridPort;

    @GetMapping(
            value = "/status",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<GridStatus> getStatus() {
        final var url = "http://" + gridHost + ":" + gridPort + "/status";
        final var res = new RestTemplate().getForEntity(url, GridStatus.class);

        if (!res.getStatusCode().equals(HttpStatus.OK)) {
            throw new RestException(HttpStatus.BAD_REQUEST, "Failed to get status of the grid");
        }

        return ResponseEntity.ok(res.getBody());
    }
}
