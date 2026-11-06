package com.example.BookCTickets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BookCTicketsApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookCTicketsApplication.class, args);
	}

}
