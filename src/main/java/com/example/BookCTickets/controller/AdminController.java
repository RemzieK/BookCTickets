package com.example.BookCTickets.controller;

import org.springframework.ui.Model;
import com.example.BookCTickets.model.Movie;
import com.example.BookCTickets.services.MovieService;
import com.example.BookCTickets.services.TicketService;
import com.example.BookCTickets.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;
    private final MovieService movieService;
    private final TicketService ticketService;

    @GetMapping
    public String admin(Model model) {
        model.addAttribute("users", userService.findAll());
        model.addAttribute("movies", movieService.findAll());
        model.addAttribute("ticketCounts", userService.getTicketCounts());
        model.addAttribute("userCount", userService.findAll().size());
        model.addAttribute("movieCount", movieService.countMovies());
        model.addAttribute("ticketCount", ticketService.countTickets());
        return "admin";
    }

    @PostMapping("/movies/save")
    public String saveMovie(@ModelAttribute Movie movie,
                            @RequestParam("imageFile") MultipartFile imageFile) throws IOException {

        if (!imageFile.isEmpty()) {
            String originalFilename = Paths.get(imageFile.getOriginalFilename()).getFileName().toString();
            String filename = System.currentTimeMillis() + "_" + originalFilename;

            Path uploadDir = Paths.get("").toAbsolutePath().resolve("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            Path filePath = uploadDir.resolve(filename);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            movie.setImageUrl("/uploads/" + filename);
        }

        movieService.save(movie);
        return "redirect:/admin?tab=movies";
    }

    @GetMapping("/movies/delete/{id}")
    public String deleteMovie(@PathVariable Long id){
        movieService.deleteById(id);
        return "redirect:/admin?tab=movies";
    }

    // User delete
    @GetMapping("/users/delete/{id}")
    public String deleteUser(@PathVariable Long id){
        userService.deleteById(id);
        return "redirect:/admin?tab=users";
    }
}
