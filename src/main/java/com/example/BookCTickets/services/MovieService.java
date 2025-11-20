package com.example.BookCTickets.services;

import com.example.BookCTickets.model.Movie;
import com.example.BookCTickets.repositories.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;

    public List<Movie> findAll() {return movieRepository.findAllByOrderByIdDesc();}
    public Movie save(Movie movie) {return movieRepository.save(movie);}
    public void deleteById(Long id) {movieRepository.deleteById(id);}
    public Movie findById(Long id) {return movieRepository.findById(id).orElse(null);}
    public Long countMovies() {return movieRepository.count();}
    public List<Movie> searchByTitle(String keyword) {
        return movieRepository.findByTitleContainingIgnoreCase(keyword);
    }
}
