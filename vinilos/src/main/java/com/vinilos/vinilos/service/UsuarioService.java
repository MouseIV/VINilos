package com.vinilos.vinilos.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vinilos.vinilos.config.JwtUtil;
import com.vinilos.vinilos.dto.LoginRequest;
import com.vinilos.vinilos.dto.LoginResponse;
import com.vinilos.vinilos.dto.RegistroRequest;
import com.vinilos.vinilos.model.Usuario;
import com.vinilos.vinilos.repository.UsuarioRepository;

@Service
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public UsuarioService(UsuarioRepository usuarioRepository, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtUtil = jwtUtil;
    }
    
    public Usuario registrar(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email ya registrado");
        }
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Nombre de usuario ya existe");
        }
        
        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setUsername(request.getUsername());
        usuario.setNombre(request.getNombre());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        
        return usuarioRepository.save(usuario);
    }
    
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));
        
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }
        
        String token = jwtUtil.generateToken(usuario.getEmail());
        
        return new LoginResponse(
            usuario.getId(),
            usuario.getEmail(),
            usuario.getUsername(),
            usuario.getNombre(),
            token
        );
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }
}
