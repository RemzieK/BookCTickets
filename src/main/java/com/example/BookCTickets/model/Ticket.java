package com.example.BookCTickets.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tickets", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"movie_id", "hour", "seat", "room"})
})
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @Column(nullable = false)
    private String seat;

    @Column(nullable = false)
    private String hour;

    @Column(nullable = false)
    private String room;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Boolean paid = false;
}