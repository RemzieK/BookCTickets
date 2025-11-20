package com.example.BookCTickets.Config;

import com.example.BookCTickets.model.Role;
import com.example.BookCTickets.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.BookCTickets.model.User;


@Configuration
public class AdminSetup {

    @Bean
    CommandLineRunner createAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.Admin);
                admin.setEmail("admin@example.com");
                admin.setFirstName("Admin");
                admin.setLastName("User");

                userRepository.save(admin);
                System.out.println("Admin user created!");
            }
        };
    }
}


