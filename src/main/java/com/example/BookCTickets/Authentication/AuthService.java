package com.example.BookCTickets.Authentication;

import com.example.BookCTickets.model.Role;
import com.example.BookCTickets.model.User;
import com.example.BookCTickets.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(User user) {

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already taken.");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered.");
        }
        if (!isValidEmail(user.getEmail())) {
            throw new IllegalArgumentException("Invalid email format: " + user.getEmail());
        }
        if (!isStrongPassword(user.getPassword())) {
            throw new IllegalArgumentException("Password must be at least 8 characters and include uppercase, number, and special character.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.User);
        userRepository.save(user);
    }

    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return Pattern.compile(regex).matcher(email.trim()).matches();
    }

    private boolean isStrongPassword(String password) {
        if (password == null) return false;
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$";
        return Pattern.compile(regex).matcher(password).matches();
    }
}