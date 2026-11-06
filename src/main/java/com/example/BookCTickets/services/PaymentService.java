package com.example.BookCTickets.services;

import com.example.BookCTickets.model.Payment;
import com.example.BookCTickets.model.Screening;
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
    public void processPaymentWithSeats(User user, Screening screening, List<String> seats,
                                        String cardName, String cardNumber, String expiry, String cvc) {
        // seats first: if the hold is gone we fail before saving any payment
        ticketService.confirmPayment(user, screening, seats);

        paymentRepository.save(Payment.builder()
                .user(user)
                .screening(screening)
                .cardName(cardName)
                .hashedCardNumber(encoder.encode(cardNumber))
                .hashedExpiry(encoder.encode(expiry))
                .hashedCvc(encoder.encode(cvc))
                .build());
    }
}