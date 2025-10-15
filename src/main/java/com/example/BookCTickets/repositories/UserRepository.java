package com.example.BookCTickets.repositories;

import com.example.BookCTickets.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findById(Long id);
    void deleteById(Long id);
}
