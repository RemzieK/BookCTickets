package com.example.BookCTickets.Authentication;

import com.example.BookCTickets.model.Role;
import com.example.BookCTickets.model.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthService authService, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
    }

    // Display registration form
    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    // Handle registration
    @PostMapping("/register")
    public String registerUser(User user) {
        authService.register(user); // saves user with encoded password
        return "redirect:/login";   // let the user log in via Spring Security form
    }


    // Display login form
    @GetMapping("/login")
    public String showLoginForm() {
        return "login"; // handled automatically by Spring Security on POST /login
    }
}
