package com.example.BookCTickets.repositories;

import com.example.BookCTickets.model.Ticket;
import com.example.BookCTickets.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUser(User user);
}
