package com.abdallah.ElectornicApp_online_backend.mappers;

import com.abdallah.ElectornicApp_online_backend.dtos.UserDto;
import com.abdallah.ElectornicApp_online_backend.entites.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(User user);



}
