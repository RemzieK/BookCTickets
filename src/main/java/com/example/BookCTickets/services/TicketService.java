package com.example.BookCTickets.services;

import com.example.BookCTickets.model.Ticket;
import com.example.BookCTickets.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;

    public long countTickets(){
        return ticketRepository.findAll().stream().mapToInt(Ticket::getQuantity).sum();
    }

    public Map<String, List<String>> getBookedSeats(Long movieId) {
        List<Ticket> tickets = ticketRepository.findAll()
                .stream()
                .filter(t -> t.getMovie().getId().equals(movieId))
                .toList();

        Map<String, List<String>> bookedSeats = new HashMap<>();
        for (Ticket ticket : tickets) {
            bookedSeats.computeIfAbsent(ticket.getHour(), k -> new ArrayList<>()).add(ticket.getSeat());
        }
        return bookedSeats;
    }

    public Ticket save(Ticket ticket){
        return ticketRepository.save(ticket);
    }
}
