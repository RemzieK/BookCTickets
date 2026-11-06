package com.example.BookCTickets.services;

import com.example.BookCTickets.model.User;
import com.example.BookCTickets.repositories.TicketRepository;
import com.example.BookCTickets.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    public List<User> findAll() {
        return userRepository.findAllByOrderByIdDesc();
    }
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    @Transactional
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
    public Map<Long, Integer> getTicketCounts() {
        Map<Long, Integer> counts = new HashMap<>();
        for (Object[] row : ticketRepository.countPaidByUser()) {
            counts.put((Long) row[0], ((Long) row[1]).intValue());
        }
        return counts;
    }
}
