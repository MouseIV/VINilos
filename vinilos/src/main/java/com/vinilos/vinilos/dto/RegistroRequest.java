package com.vinilos.vinilos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistroRequest {
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    @Size(min = 5, max = 20)
    private String username;
    
    @NotBlank
    private String nombre;
    
    @NotBlank
    @Size(min = 10)
    private String password;
}