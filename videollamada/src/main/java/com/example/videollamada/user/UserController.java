package com.example.videollamada.user;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j

public class UserController {

    private final UserService service;
    

    @PostMapping("/register")

    public void registerUser(User user) {
       service.registerUser(user);

    }
    @PostMapping("/login")  
    public User login(User user){
        return service.login(user);
    }

    @PostMapping("/logout")
    public void logout(String email){
        service.logout(email); 
    }
    @GetMapping

    public List<User> findAll() {
        return service.findAll();

        
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.
        status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ex.getMessage());
    }

    
}
