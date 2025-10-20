package com.example.BookCTickets.services;

import com.example.BookCTickets.model.Ticket;
import com.example.BookCTickets.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;

    public long countTickets(){
        return ticketRepository.findAll().stream().mapToInt(Ticket::getQuantity).sum();
    }
}
