package com.example.BookCTickets.services;

import com.example.BookCTickets.model.Screening;
import com.example.BookCTickets.model.Ticket;
import com.example.BookCTickets.model.User;
import com.example.BookCTickets.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketService {
    private static final int HOLD_MINUTES = 10;
    private static final int MAX_SEATS = 10;
    private static final String SEAT_PATTERN = "^[A-F]([1-9]|1[0-8])$";   // rows A-F, seats 1-18

    private final TicketRepository ticketRepository;

    public List<String> getUnavailableSeats(Long screeningId, Long userId) {
        return ticketRepository.findUnavailableSeats(
                screeningId, userId == null ? -1L : userId,
                LocalDateTime.now().minusMinutes(HOLD_MINUTES));
    }

    @Transactional
    public void reserveSeats(User user, Screening screening, List<String> seats) {
        validateSeats(seats);
        ticketRepository.deleteExpiredHolds(screening.getId(), LocalDateTime.now().minusMinutes(HOLD_MINUTES));

        for (String seat : seats) {
            Optional<Ticket> existing = ticketRepository.findByScreeningIdAndSeat(screening.getId(), seat);
            if (existing.isPresent()) {
                Ticket t = existing.get();
                if (t.getPaid() || !t.getUser().getId().equals(user.getId()))
                    throw new IllegalStateException("Seat " + seat + " is not available");
                t.setReservedAt(LocalDateTime.now());              // refresh my own hold
            } else {
                ticketRepository.save(Ticket.builder()
                        .user(user)
                        .screening(screening)
                        .seat(seat)
                        .price(screening.getMovie().getTicketPrice())
                        .paid(false)
                        .reservedAt(LocalDateTime.now())
                        .build());
            }
        }
    }

    @Transactional
    public void confirmPayment(User user, Screening screening, List<String> seats) {
        validateSeats(seats);
        for (String seat : seats) {
            Ticket t = ticketRepository.findByScreeningIdAndSeat(screening.getId(), seat)
                    .filter(x -> !x.getPaid() && x.getUser().getId().equals(user.getId()))
                    .orElseThrow(() -> new IllegalStateException(
                            "Your reservation for seat " + seat + " expired. Please select it again."));
            t.setPaid(true);
        }
    }

    public long countTickets() {
        return ticketRepository.countByPaid(true);
    }

    public List<String> getMyHolds(Long screeningId, Long userId) {
        if (userId == null) return List.of();
        return ticketRepository.findActiveHoldsByUser(
                screeningId, userId, LocalDateTime.now().minusMinutes(HOLD_MINUTES));
    }

    private void validateSeats(List<String> seats) {
        if (seats == null || seats.isEmpty()) throw new IllegalArgumentException("No seats selected");
        if (seats.size() > MAX_SEATS) throw new IllegalArgumentException("You can book at most " + MAX_SEATS + " seats");
        if (seats.stream().distinct().count() != seats.size()) throw new IllegalArgumentException("Duplicate seats");
        for (String s : seats)
            if (s == null || !s.matches(SEAT_PATTERN)) throw new IllegalArgumentException("Invalid seat: " + s);
    }
}