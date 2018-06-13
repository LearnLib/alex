/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.common.utils;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import de.learnlib.alex.auth.security.JWTHelper;
import org.jose4j.lang.JoseException;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

public final class UserHelper {

    private UserHelper() {
    }

    public static String login(User user) {
        String token = null;
        try {
            token = JWTHelper.generateJWT(user);
        } catch (JoseException e) {
            e.printStackTrace();
        }
        return "Bearer " + token;
    }

    public static void initFakeAdmin(User user) {
        given(user.getId()).willReturn(1L);
        given(user.getEmail()).willReturn("admin@alex.example");
        given(user.getRole()).willReturn(UserRole.ADMIN);
        given(user.isValidPassword(anyString())).willReturn(true);
    }

}
