package com.example.videollamada;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.videollamada.user.User;
import com.example.videollamada.user.UserService;

@SpringBootApplication
public class VideollamadaApplication {

	public static void main(String[] args) {
		SpringApplication.run(VideollamadaApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(
		UserService service
	) {
		return args -> {

			service.registerUser(User.builder()
			.username("Hueso")
			.email("Hueso@mail.com")
			.password("12345678")
			.build());

			service.registerUser(User.builder()
			.username("Palacios")
			.email("Palacios@mail.com")
			.password("12345678")
			.build());

			service.registerUser(User.builder()
			.username("Marlini")
			.email("Marlini@mail.com")
			.password("12345678")
			.build());

		};
	}

}
