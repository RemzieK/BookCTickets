package com.example.BookCTickets.controller;

import com.example.BookCTickets.model.Movie;
import com.example.BookCTickets.services.MovieService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/index")
public class HomeController {

    private final MovieService movieService;

    public HomeController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public String home(Model model) {
        // Fetch last 4 movies (assuming ID is auto-increment)
        List<Movie> lastMovies = movieService.findAll()
                .stream()
                .sorted((a,b) -> b.getId().compareTo(a.getId()))
                .limit(4)
                .toList();
        model.addAttribute("lastMovies", lastMovies);
        return "index";
    }
}


