package com.example.BookCTickets.services;

import com.example.BookCTickets.model.Movie;
import com.example.BookCTickets.model.Ticket;
import com.example.BookCTickets.model.User;
import com.example.BookCTickets.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;

    public List<String> getOccupiedSeats(Long movieId, String hour) {
        return ticketRepository.findOccupiedSeatsByMovieIdAndHour(movieId, hour);
    }

    @Transactional
    public void reserveSeats(User user, Movie movie, String hour, List<String> seats) {
        String room = movie.getRoom();

        for (String seat : seats) {
            if (ticketRepository.existsByMovieIdAndHourAndSeatAndPaid(movie.getId(), hour, seat, true)) {
                throw new IllegalStateException("Seat " + seat + " is already booked and paid for at " + hour);
            }
        }

        for (String seat : seats) {
            Ticket existing = ticketRepository.findByMovieIdAndHourAndSeatAndUser(
                    movie.getId(), hour, seat, user);
            if (existing != null) {
                ticketRepository.delete(existing);
            }
        }

        List<Ticket> tickets = seats.stream()
                .map(seat -> Ticket.builder()
                        .user(user)
                        .movie(movie)
                        .seat(seat)
                        .hour(hour)
                        .room(room)
                        .price(movie.getTicketPrice())
                        .paid(false)
                        .build())
                .toList();

        ticketRepository.saveAll(tickets);
    }

    @Transactional
    public void confirmPayment(User user, Movie movie, String hour, List<String> seats) {
        for (String seat : seats) {
            Ticket ticket = ticketRepository.findByMovieIdAndHourAndSeatAndUser(
                    movie.getId(), hour, seat, user);
            if (ticket != null) {
                ticket.setPaid(true);
                ticketRepository.save(ticket);
            } else {
                Ticket newTicket = Ticket.builder()
                        .user(user)
                        .movie(movie)
                        .seat(seat)
                        .hour(hour)
                        .room(movie.getRoom())
                        .price(movie.getTicketPrice())
                        .paid(true)
                        .build();
                ticketRepository.save(newTicket);
            }
        }
    }

    public long countTickets() {
        return ticketRepository.countByPaid(true);
    }
}