package com.example.BookCTickets.services;

import com.example.BookCTickets.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class HoldCleanupTask {
    private final TicketRepository ticketRepository;

    @Scheduled(fixedRate = 30_000)
    @Transactional
    public void removeExpiredHolds() {
        ticketRepository.deleteAllExpiredHolds(
                LocalDateTime.now().minusMinutes(TicketService.HOLD_MINUTES));
    }
}