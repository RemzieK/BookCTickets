package com.example.BookCTickets.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "screenings", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"room", "screening_date", "start_time"}),
        @UniqueConstraint(columnNames = {"movie_id", "screening_date", "start_time"})
})
public class Screening {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @Column(name = "screening_date", nullable = false, columnDefinition = "date")
    private LocalDate screeningDate;

    @Column(name = "start_time", nullable = false, columnDefinition = "time(0)")
    private LocalTime startTime;

    @Column(nullable = false)
    private String room;

    @OneToMany(mappedBy = "screening", cascade = CascadeType.REMOVE)
    private List<Ticket> tickets;

    @OneToMany(mappedBy = "screening", cascade = CascadeType.REMOVE)
    private List<Payment> payments;
}