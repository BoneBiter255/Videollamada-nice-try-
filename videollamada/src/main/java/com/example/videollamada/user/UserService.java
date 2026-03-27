package com.example.videollamada.user;


import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;


@Service
public class UserService {
    


    private static final List<User> USERS_LIST = new ArrayList<>();

    public void registerUser(User user) {
        user.setStatus("online");
        USERS_LIST.add(user);

    }
    public User login(User user){
        var userIndex = IntStream.range(0, USERS_LIST.size())
                .filter(i -> USERS_LIST.get(i).getUsername().equals(user.getUsername()) &&
                        USERS_LIST.get(i).getPassword().equals(user.getPassword()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        var cUser = USERS_LIST.get(userIndex);
        if (!cUser.getPassword().equals(user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
         cUser.setStatus("online");
         return cUser;


    }
    public void logout(String email){
        var userIndex = IntStream.range(0, USERS_LIST.size())
                .filter(i -> USERS_LIST.get(i).getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        USERS_LIST.get(userIndex).setStatus("offline");

    }

    public List<User> findAll() {
        return USERS_LIST;
        
    }
}
