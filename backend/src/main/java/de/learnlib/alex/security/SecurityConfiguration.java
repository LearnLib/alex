/*
 * Copyright 2015 - 2019 TU Dortmund
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

package de.learnlib.alex.security;

import de.learnlib.alex.auth.entities.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        final String adminAuthority = UserRole.ADMIN.toString();
        final String registeredAuthority = UserRole.REGISTERED.toString();

        httpSecurity.csrf().disable()
                .authorizeRequests()
                    .antMatchers(HttpMethod.GET, "/rest/settings").permitAll()
                    .antMatchers(HttpMethod.PUT, "/rest/settings").hasAuthority(adminAuthority)
                    .antMatchers("/rest/settings/drivers/**").hasAuthority(adminAuthority)
                    .antMatchers(HttpMethod.POST,"/rest/users/login").permitAll()
                    .antMatchers(HttpMethod.GET, "/rest/users").hasAuthority(adminAuthority)
                    .antMatchers(HttpMethod.POST, "/rest/users").permitAll()
                    .antMatchers(HttpMethod.PUT, "/rest/users/{\\d+}/promote").hasAuthority(adminAuthority)
                    .antMatchers(HttpMethod.PUT, "/rest/users/{\\d+}/demote").hasAuthority(adminAuthority)
                    .antMatchers(HttpMethod.DELETE, "/rest/users/batch/**").hasAuthority(adminAuthority)
                    .antMatchers("/rest/**").hasAnyAuthority(new String[]{registeredAuthority, adminAuthority}).and()
                .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .cors().disable();

        httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }
}