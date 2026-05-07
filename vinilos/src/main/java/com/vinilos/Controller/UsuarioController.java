package com.vinilos.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class Usuariocontroller {

    private final UsuarioRepository usuarioRepository;

    public Usuariocontroller(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Crear usuario
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuario(@PathVariable Long id) {
        Optional<Usuario> usuarioExistente = (Optional<Usuario>) usuarioRepository.findById(id);
        return usuarioExistente.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Listar todos los usuarios
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario datos) {
        Optional<Usuario> usuarioExistente = (Optional<Usuario>) usuarioRepository.findById(id);
        return usuarioExistente.map(usuario -> {
            datos.setId(id);
            Usuario actualizado = usuarioRepository.save(datos);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Borrar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<?> borrarUsuario(@PathVariable Long id) {
        Optional<Usuario> usuarioExistente = (Optional<Usuario>) usuarioRepository.findById(id);
        if (usuarioExistente.isPresent()) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.ok("Usuario eliminado");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}