package com.example.BookCTickets.controller;

import com.example.BookCTickets.services.MovieService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/index")
public class HomeController {

    private final MovieService movieService;

    public HomeController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public String index(Model model) {
        model.addAttribute("movies", movieService.findAll());
        return "index";
    }
}


