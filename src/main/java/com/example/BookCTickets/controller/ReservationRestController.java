package com.example.BookCTickets.controller;

import com.example.BookCTickets.model.Movie;
import com.example.BookCTickets.model.User;
import com.example.BookCTickets.services.MovieService;
import com.example.BookCTickets.services.PaymentService;
import com.example.BookCTickets.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reservation")
@RequiredArgsConstructor
public class ReservationRestController {
    private final MovieService movieService;
    private final TicketService ticketService;
    private final PaymentService paymentService;

    @GetMapping("/{movieId}/occupied-seats")
    public ResponseEntity<List<String>> getOccupiedSeats(
            @PathVariable Long movieId,
            @RequestParam String hour
    ) {
        Movie movie = movieService.findById(movieId);
        if (movie == null) return ResponseEntity.notFound().build();

        List<String> seats = ticketService.getOccupiedSeats(movieId, hour);
        return ResponseEntity.ok(seats);
    }

    @PostMapping("/{movieId}/reserve-seats")
    public ResponseEntity<Map<String, String>> reserveSeats(
            @PathVariable Long movieId,
            @RequestParam String hour,
            @RequestBody List<String> seats,
            @AuthenticationPrincipal User user
    ) {
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Authentication required"));

        Movie movie = movieService.findById(movieId);
        if (movie == null) return ResponseEntity.status(404).body(Map.of("message", "Movie not found"));

        try {
            ticketService.reserveSeats(user, movie, hour, seats);
            return ResponseEntity.ok(Map.of("message", "Seats reserved temporarily"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{movieId}/confirm-payment")
    public ResponseEntity<Map<String, String>> confirmPayment(
            @PathVariable Long movieId,
            @RequestParam String hour,
            @RequestBody PaymentRequest payment,
            @AuthenticationPrincipal User user
    ) {
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication required"));

        Movie movie = movieService.findById(movieId);
        if (movie == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Movie not found"));
        if (payment.cardName() == null || payment.cardNumber() == null
                || payment.expiry() == null || payment.cvc() == null
                || payment.cardName().isBlank() || payment.cardNumber().isBlank()
                || payment.expiry().isBlank() || payment.cvc().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Payment info incomplete"));
        }
        if (payment.seats() == null || payment.seats().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "No seats selected"));
        }
        try {
            paymentService.processPaymentWithSeats(user, movie, hour, payment.seats(),
                    payment.cardName(), payment.cardNumber(), payment.expiry(), payment.cvc());

            return ResponseEntity.ok(Map.of(
                    "message", "Payment successful! Your booking is confirmed.",
                    "card", "**** **** **** " + payment.cardNumber().substring(payment.cardNumber().length() - 4)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Payment processing failed: " + e.getMessage()));
        }
    }
    public record PaymentRequest(String cardName, String cardNumber, String expiry, String cvc, List<String> seats) {}
}
