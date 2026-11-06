package com.example.BookCTickets.services;

import com.example.BookCTickets.model.Movie;
import com.example.BookCTickets.model.Screening;
import com.example.BookCTickets.repositories.ScreeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class ScreeningService {
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("H:mm");
    private static final int BOOKING_DAYS_AHEAD = 14;

    private final ScreeningRepository screeningRepository;

    public Screening getOrCreate(Movie movie, LocalDate date, String hour) {
        LocalTime time = parse(hour);

        boolean offered = Arrays.stream(movie.getHours().split(","))
                .map(String::trim)
                .filter(h -> !h.isEmpty())
                .anyMatch(h -> parse(h).equals(time));
        if (!offered) throw new IllegalArgumentException("This movie is not shown at " + hour);

        if (LocalDateTime.of(date, time).isBefore(LocalDateTime.now()))
            throw new IllegalArgumentException("This screening has already started");
        if (date.isAfter(LocalDate.now().plusDays(BOOKING_DAYS_AHEAD)))
            throw new IllegalArgumentException("Booking opens " + BOOKING_DAYS_AHEAD + " days ahead");

        return screeningRepository
                .findByMovieIdAndScreeningDateAndStartTime(movie.getId(), date, time)
                .orElseGet(() -> create(movie, date, time));
    }

    private Screening create(Movie movie, LocalDate date, LocalTime time) {
        try {
            return screeningRepository.saveAndFlush(Screening.builder()
                    .movie(movie).screeningDate(date).startTime(time).room(movie.getRoom()).build());
        } catch (DataIntegrityViolationException e) {
            // another request created it at the same moment
            return screeningRepository
                    .findByMovieIdAndScreeningDateAndStartTime(movie.getId(), date, time)
                    .orElseThrow(() -> e);
        }
    }

    private LocalTime parse(String hour) {
        try {
            return LocalTime.parse(hour.trim(), TIME);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid hour: " + hour);
        }
    }
}