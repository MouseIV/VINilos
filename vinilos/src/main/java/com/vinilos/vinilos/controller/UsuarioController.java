package com.vinilos.vinilos.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vinilos.vinilos.model.Usuario;
import com.vinilos.vinilos.repository.UsuarioRepository;

@CrossOrigin(origins = "*") 
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // GET: listar todos los usuarios
    @GetMapping
    public List<Usuario> getUsuarios() {
        return usuarioRepository.findAll();
    }

    // GET: obtener usuario por ID
    @GetMapping("/{id}")
    public Usuario getUsuario(@PathVariable @NonNull Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    // POST: crear usuario
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // POST: login
    @PostMapping("/login")
    public String login(@RequestBody Usuario datos) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(datos.getEmail());

        if (usuario.isPresent() && usuario.get().getPassword().equals(datos.getPassword())) {
            return "Inicio de sesión correcto";
        } else {
            return "Credenciales incorrectas";
        }
    }
}
