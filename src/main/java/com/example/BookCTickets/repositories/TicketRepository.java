package com.example.BookCTickets.repositories;

import com.example.BookCTickets.model.Ticket;
import com.example.BookCTickets.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Optional<Ticket> findByScreeningIdAndSeat(Long screeningId, String seat);

    // paid seats + active holds made by OTHER users
    @Query("""
            SELECT t.seat FROM Ticket t
            WHERE t.screening.id = :screeningId
              AND (t.paid = true
                   OR (t.reservedAt >= :cutoff AND t.user.id <> :userId))
            """)
    List<String> findUnavailableSeats(@Param("screeningId") Long screeningId,
                                      @Param("userId") Long userId,
                                      @Param("cutoff") LocalDateTime cutoff);

    @Query("""
        SELECT t.seat FROM Ticket t
        WHERE t.screening.id = :screeningId AND t.paid = false
          AND t.reservedAt >= :cutoff AND t.user.id = :userId
        """)
    List<String> findActiveHoldsByUser(@Param("screeningId") Long screeningId,
                                       @Param("userId") Long userId,
                                       @Param("cutoff") LocalDateTime cutoff);

    @Modifying
    @Query("DELETE FROM Ticket t WHERE t.screening.id = :screeningId AND t.paid = false AND t.reservedAt < :cutoff")
    void deleteExpiredHolds(@Param("screeningId") Long screeningId, @Param("cutoff") LocalDateTime cutoff);

    @Query("SELECT t.user.id, COUNT(t) FROM Ticket t WHERE t.paid = true GROUP BY t.user.id")
    List<Object[]> countPaidByUser();

    List<Ticket> findByUser(User user);

    long countByPaid(Boolean paid);
}