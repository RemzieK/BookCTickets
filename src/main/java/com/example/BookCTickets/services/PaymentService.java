package com.example.BookCTickets.services;

import com.example.BookCTickets.model.Movie;
import com.example.BookCTickets.model.Payment;
import com.example.BookCTickets.model.User;
import com.example.BookCTickets.repositories.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final TicketService ticketService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Transactional
    public void processPaymentWithSeats(User user, Movie movie, String hour, List<String> seats,
                                        String cardName, String cardNumber, String expiry, String cvc) {

        Payment payment = Payment.builder()
                .user(user)
                .movie(movie)
                .hour(hour)
                .cardName(cardName)
                .hashedCardNumber(encoder.encode(cardNumber))
                .hashedExpiry(encoder.encode(expiry))
                .hashedCvc(encoder.encode(cvc))
                .build();

        paymentRepository.save(payment);

        ticketService.confirmPayment(user, movie, hour, seats);
    }
}