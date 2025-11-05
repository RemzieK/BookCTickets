package com.example.BookCTickets.controller;

import com.example.BookCTickets.model.BookedSeat;
import com.example.BookCTickets.model.Movie;
import com.example.BookCTickets.model.Ticket;
import com.example.BookCTickets.model.User;
import com.example.BookCTickets.services.BookedSeatService;
import com.example.BookCTickets.services.MovieService;
import com.example.BookCTickets.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/book")
@RequiredArgsConstructor
public class TicketBookController {

    private final MovieService movieService;
    private final TicketService ticketService;

    @GetMapping("/{movieId}")
    public String bookTicket(@PathVariable Long movieId, Model model, Principal principal) {
        if (principal == null) {
            return "redirect:/login"; // redirect if not logged in
        }

        Movie movie = movieService.findById(movieId);
        model.addAttribute("movie", movie);

        // Split hours into list
        List<String> hours = Arrays.asList(movie.getHours().split(","));
        model.addAttribute("hours", hours);

        // Booked seats per hour
        Map<String, List<String>> bookedSeats = ticketService.getBookedSeats(movieId);
        model.addAttribute("bookedSeats", bookedSeats);

        return "book"; // Thymeleaf template
    }

    @PostMapping("/{movieId}/confirm")
    public String confirmBooking(@PathVariable Long movieId,
                                 @RequestParam String hour,
                                 @RequestParam String seats,
                                 @RequestParam String cardName,
                                 @RequestParam String cardNumber,
                                 @RequestParam String expiry,
                                 @RequestParam String cvc,
                                 Principal principal,
                                 RedirectAttributes redirectAttributes) {

        User user = (User) ((Authentication) ((UsernamePasswordAuthenticationToken) principal).getPrincipal());

        Movie movie = movieService.findById(movieId);

        for (String seat : seats.split(",")) {
            Ticket ticket = Ticket.builder()
                    .movie(movie)
                    .user(user)
                    .seat(seat)
                    .hour(hour)
                    .price(movie.getTicketPrice())
                    .build();
            ticketService.save(ticket);
        }

        redirectAttributes.addFlashAttribute("success", "Booking successful!");
        return "redirect:/movies";
    }

}
