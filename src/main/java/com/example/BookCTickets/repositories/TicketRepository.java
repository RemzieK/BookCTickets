package com.example.BookCTickets.repositories;

import com.example.BookCTickets.model.Ticket;
import com.example.BookCTickets.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Check if a paid ticket exists for this seat
    boolean existsByMovieIdAndHourAndSeatAndPaid(Long movieId, String hour, String seat, Boolean paid);

    // Find a specific reservation
    Ticket findByMovieIdAndHourAndSeatAndPaid(Long movieId, String hour, String seat, Boolean paid);

    // Find user's reservation for a specific seat
    Ticket findByMovieIdAndHourAndSeatAndUser(Long movieId, String hour, String seat, User user);

    // Get occupied (paid) seats
    @Query("select t.seat from Ticket t where t.movie.id = :movieId and t.hour = :hour and t.paid = true")
    List<String> findSeatsByMovieIdAndHour(@Param("movieId") Long movieId, @Param("hour") String hour);

    List<Ticket> findByUser(User user);

    long countByPaid(Boolean paid);

    // Clean up expired temporary reservations (optional)
    void deleteByPaidFalse();
}
