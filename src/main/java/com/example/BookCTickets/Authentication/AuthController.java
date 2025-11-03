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

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(User user) {
        // Store raw password before encoding (important for authentication)
        String rawPassword = user.getPassword();

        // Save user (your AuthService should encode password)
        authService.register(user);

        // Automatically log the user in
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), rawPassword)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Redirect to index page (now logged in)
        return "redirect:/index";
    }


    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }
}
