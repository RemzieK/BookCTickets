package com.example.BookCTickets.controller;

import com.example.BookCTickets.model.Movie;
import com.example.BookCTickets.services.MovieService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/movies")
public class MovieController {
    private final MovieService movieService;
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }
    @GetMapping
    public String movies(Model model) {
        List<Movie> movies = movieService.findAll()
                .stream()
                .sorted((a,b) -> b.getId().compareTo(a.getId()))
                .toList();
        model.addAttribute("movies", movies);
        return "movies";
    }
    @GetMapping("/search")
    public String searchMovies(@RequestParam("keyword") String keyword, Model model) {
        List<Movie> movies = movieService.searchByTitle(keyword);
        model.addAttribute("movies", movies);
        model.addAttribute("keyword", keyword);
        return "movies";
    }
}
