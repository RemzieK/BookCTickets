package com.example.BookCTickets.controller;

import com.example.BookCTickets.model.Movie;
import com.example.BookCTickets.model.User;
import com.example.BookCTickets.services.MovieService;
import com.example.BookCTickets.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("/book")
@RequiredArgsConstructor
public class TicketBookController {
    private final MovieService movieService;
    private final TicketService ticketService;

    @GetMapping("/{movieId}")
    public String bookTicket(
            @PathVariable Long movieId,
            @AuthenticationPrincipal User user,
            Model model
    ) {
        if (user == null) return "redirect:/login";

        Movie movie = movieService.findById(movieId);
        if (movie == null) return "redirect:/movies";

        model.addAttribute("movie", movie);
        List<String> hours = Arrays.stream(movie.getHours().split(","))
                .map(String::trim)
                .filter(h -> !h.isEmpty())
                .toList();
        model.addAttribute("hours", hours);

        return "book";
    }
}
