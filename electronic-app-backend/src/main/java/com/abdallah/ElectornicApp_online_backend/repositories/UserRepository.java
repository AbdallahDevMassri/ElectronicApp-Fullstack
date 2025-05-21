package com.abdallah.ElectornicApp_online_backend.repositories;


import com.abdallah.ElectornicApp_online_backend.entites.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLogin(String login);
}
