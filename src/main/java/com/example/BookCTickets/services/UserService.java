package com.example.BookCTickets.services;

import com.example.BookCTickets.model.User;
import com.example.BookCTickets.repositories.TicketRepository;
import com.example.BookCTickets.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    public List<User> findAll() {
        return userRepository.findAllByOrderByIdDesc();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public boolean usernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Transactional
    public User save(User user) {
        if (usernameExists(user.getUsername())) {
            throw new IllegalArgumentException("Username already taken.");
        }

        if (emailExists(user.getEmail())) {
            throw new IllegalArgumentException("Email already registered.");
        }

        if (!isValidEmail(user.getEmail())) {
            throw new IllegalArgumentException("Invalid email format.");
        }

        if (!isStrongPassword(user.getPassword())) {
            throw new IllegalArgumentException(
                    "Password must be at least 8 characters and include uppercase, number, and special character."
            );
        }

        return userRepository.save(user);
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        return Pattern.compile(emailRegex).matcher(email).matches();
    }

    private boolean isStrongPassword(String password) {
        // Minimum 8 chars, at least one upper, one lower, one number, one special
        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$";
        return Pattern.compile(passwordRegex).matcher(password).matches();
    }

    @Transactional
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public Map<Long, Integer> getTicketCounts() {
        return findAll().stream()
                .collect(Collectors.toMap(User::getId, u ->
                        ticketRepository.findByUser(u).size()
                ));
    }
}
