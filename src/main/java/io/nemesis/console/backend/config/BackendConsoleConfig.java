/*
 * nemesis Platform - NExt-generation Multichannel E-commerce SYStem
 *
 * Copyright (c) 2010 - 2014 nemesis
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of nemesis
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with nemesis.
 */
package io.nemesis.console.backend.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.AdviceMode;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.annotation.Resource;

@Configuration
@EnableWebSecurity
@ComponentScan(basePackages = { "io.nemesis.console.backend", "io.nemesis.platform.util" })
@Import(value = { CommonConsoleConfig.class })
@EnableConfigurationProperties(value = ConsoleProperties.class)
@EnableGlobalMethodSecurity(prePostEnabled = true, mode = AdviceMode.PROXY)
public class BackendConsoleConfig extends WebSecurityConfigurerAdapter {

    @Resource(name = "defaultAuthenticationFailureHandler")
    private AuthenticationFailureHandler defaultAuthenticationFailureHandler;

    @Resource(name = "defaultAccessDeniedHandler")
    private AccessDeniedHandler defaultAccessDeniedHandler;

    // @formatter:off
    
    @Override
    public void configure(final WebSecurity web) {
        web.ignoring().antMatchers("/resources/**");
    }
    
    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/resources/img/**").permitAll()
                .antMatchers("/login").permitAll()
                .antMatchers("/error").permitAll()
                .antMatchers("/**").hasRole("EMPLOYEEGROUP")
                .and()
            .headers().disable()
            .formLogin()
                .loginProcessingUrl("/j_spring_security_check")
                .loginPage("/login").permitAll()
                .defaultSuccessUrl("/admin")
                .failureHandler(defaultAuthenticationFailureHandler)
                .permitAll()
                .and()
            .logout()
                .logoutUrl("/j_spring_security_logout")
                .logoutSuccessUrl("/login")
                .permitAll()
                .and()
            .exceptionHandling()
                .accessDeniedHandler(defaultAccessDeniedHandler);
    }
    
    // @formatter:on
}
