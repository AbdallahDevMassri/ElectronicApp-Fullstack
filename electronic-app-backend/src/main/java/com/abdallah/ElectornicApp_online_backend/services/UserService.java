package com.abdallah.ElectornicApp_online_backend.services;

import com.abdallah.ElectornicApp_online_backend.dtos.UserDto;
import com.abdallah.ElectornicApp_online_backend.entites.User;
import com.abdallah.ElectornicApp_online_backend.exceptions.AppException;
import com.abdallah.ElectornicApp_online_backend.mappers.UserMapper;
import com.abdallah.ElectornicApp_online_backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserDto findByLogin(String login) {
        return userRepository.findByLogin(login)
                .map(userMapper::toUserDto)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
    }
}
