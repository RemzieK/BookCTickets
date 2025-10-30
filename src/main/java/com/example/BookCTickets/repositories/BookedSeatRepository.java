package com.example.BookCTickets.repositories;

import com.example.BookCTickets.model.BookedSeat;
import com.example.BookCTickets.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookedSeatRepository extends JpaRepository<BookedSeat, Long> {
    List<BookedSeat> findByMovieAndRoomAndHour(Movie movie, String room, String hour);
}

