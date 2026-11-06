package com.example.BookCTickets.repositories;

import com.example.BookCTickets.model.Screening;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

public interface ScreeningRepository extends JpaRepository<Screening, Long> {
    Optional<Screening> findByMovieIdAndScreeningDateAndStartTime(Long movieId, LocalDate date, LocalTime time);
}