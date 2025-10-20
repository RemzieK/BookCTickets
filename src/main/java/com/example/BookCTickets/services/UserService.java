package com.example.BookCTickets.services;

import com.example.BookCTickets.model.User;
import com.example.BookCTickets.repositories.TicketRepository;
import com.example.BookCTickets.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    public List<User> findAll(){
        return userRepository.findAll();
    }
    public Optional<User> findById(Long id){
        return userRepository.findById(id);
    }
    public User save(User user){
        return userRepository.save(user);
    }
    @Transactional
    public void deleteById(Long id){
        userRepository.deleteById(id);
    }

    public Map<Long, Integer> getTicketCounts() {
        return findAll().stream()
                .collect(Collectors.toMap(User::getId, u ->
                        ticketRepository.findByUser(u).stream()
                                .mapToInt(t -> t.getQuantity()).sum()
                ));
    }
}
