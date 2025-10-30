package com.example.BookCTickets.services;

import com.example.BookCTickets.model.BookedSeat;
import com.example.BookCTickets.model.Movie;
import com.example.BookCTickets.repositories.BookedSeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookedSeatService {
    private final BookedSeatRepository bookedSeatRepository;

    public List<BookedSeat> getBookedSeats(Movie movie, String room, String hour){
        return bookedSeatRepository.findByMovieAndRoomAndHour(movie, room, hour);
    }

    public void bookSeats(List<BookedSeat> seats){
        bookedSeatRepository.saveAll(seats);
    }
}
