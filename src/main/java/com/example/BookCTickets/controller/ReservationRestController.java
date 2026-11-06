package com.example.BookCTickets.controller;

import com.example.BookCTickets.model.Movie;
import com.example.BookCTickets.model.Screening;
import com.example.BookCTickets.model.User;
import com.example.BookCTickets.services.MovieService;
import com.example.BookCTickets.services.PaymentService;
import com.example.BookCTickets.services.ScreeningService;
import com.example.BookCTickets.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reservation")
@RequiredArgsConstructor
public class ReservationRestController {
    private final MovieService movieService;
    private final ScreeningService screeningService;
    private final TicketService ticketService;
    private final PaymentService paymentService;

    @GetMapping("/{movieId}/occupied-seats")
    public ResponseEntity<?> getOccupiedSeats(
            @PathVariable Long movieId,
            @RequestParam String hour,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal User user
    ) {
        Movie movie = movieService.findById(movieId);
        if (movie == null) return ResponseEntity.notFound().build();
        try {
            Screening screening = screeningService.getOrCreate(movie, date, hour);
            Long userId = user == null ? null : user.getId();
            return ResponseEntity.ok(Map.of(
                    "taken", ticketService.getUnavailableSeats(screening.getId(), userId),
                    "held", ticketService.getMyHolds(screening.getId(), userId)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{movieId}/reserve-seats")
    public ResponseEntity<Map<String, String>> reserveSeats(
            @PathVariable Long movieId,
            @RequestParam String hour,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestBody List<String> seats,
            @AuthenticationPrincipal User user
    ) {
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication required"));

        Movie movie = movieService.findById(movieId);
        if (movie == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Movie not found"));

        try {
            Screening screening = screeningService.getOrCreate(movie, date, hour);
            ticketService.reserveSeats(user, screening, seats);
            return ResponseEntity.ok(Map.of("message", "Seats reserved temporarily"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException | DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e instanceof IllegalStateException
                            ? e.getMessage() : "Someone just took one of these seats. Please pick other seats."));
        }
    }

    @PostMapping("/{movieId}/confirm-payment")
    public ResponseEntity<Map<String, String>> confirmPayment(
            @PathVariable Long movieId,
            @RequestParam String hour,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestBody PaymentRequest payment,
            @AuthenticationPrincipal User user
    ) {
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication required"));

        Movie movie = movieService.findById(movieId);
        if (movie == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Movie not found"));

        if (isBlank(payment.cardName()) || isBlank(payment.cardNumber())
                || isBlank(payment.expiry()) || isBlank(payment.cvc())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Payment info incomplete"));
        }
        if (payment.seats() == null || payment.seats().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "No seats selected"));
        }
        try {
            Screening screening = screeningService.getOrCreate(movie, date, hour);
            paymentService.processPaymentWithSeats(user, screening, payment.seats(),
                    payment.cardName(), payment.cardNumber(), payment.expiry(), payment.cvc());

            String number = payment.cardNumber();
            return ResponseEntity.ok(Map.of(
                    "message", "Payment successful! Your booking is confirmed.",
                    "card", "**** **** **** " + number.substring(Math.max(0, number.length() - 4))
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Payment processing failed"));
        }
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    public record PaymentRequest(String cardName, String cardNumber, String expiry, String cvc, List<String> seats) {}
}