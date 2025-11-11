package com.example.BookCTickets.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    @ManyToOne(optional = false)
    private Movie movie;

    @Column(nullable = false)
    private String hour;

    @Column(nullable = false)
    private String cardName;

    @Column(nullable = false)
    private String hashedCardNumber;

    @Column(nullable = false)
    private String hashedExpiry;

    @Column(nullable = false)
    private String hashedCvc;
}
