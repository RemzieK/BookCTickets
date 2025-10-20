package com.example.BookCTickets.repositories;

import com.example.BookCTickets.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}
