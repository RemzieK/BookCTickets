package com.example.BookCTickets.repositories;

import com.example.BookCTickets.model.Ticket;
import com.example.BookCTickets.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    boolean existsByMovieIdAndHourAndSeatAndPaid(Long movieId, String hour, String seat, Boolean paid);
    Ticket findByMovieIdAndHourAndSeatAndPaid(Long movieId, String hour, String seat, Boolean paid);

    Ticket findByMovieIdAndHourAndSeatAndUser(Long movieId, String hour, String seat, User user);

    @Query("SELECT t.seat FROM Ticket t WHERE t.movie.id = :movieId AND t.hour = :hour AND t.paid = true")
    List<String> findOccupiedSeatsByMovieIdAndHour(@Param("movieId") Long movieId, @Param("hour") String hour);

    @Query("SELECT t.seat FROM Ticket t WHERE t.movie.id = :movieId AND t.hour = :hour AND t.paid = false")
    List<String> findTemporaryReservationsByMovieIdAndHour(@Param("movieId") Long movieId, @Param("hour") String hour);

    List<Ticket> findByUser(User user);

    long countByPaid(Boolean paid);

    void deleteByPaidFalseAndMovieIdAndHour(Long movieId, String hour);
}