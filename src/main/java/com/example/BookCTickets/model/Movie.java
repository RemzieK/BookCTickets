package com.example.BookCTickets.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 1000)
    private String description;
    private String director;
    private String actors;
    private String genre;
    private String duration;
    private Double ticketPrice;
    private String hours;
    private String room;
    private String language;
    private String ageRestriction;
    private String imageUrl;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.REMOVE)
    private List<Payment> payments;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.REMOVE)
    private List<Ticket> tickets;
}
