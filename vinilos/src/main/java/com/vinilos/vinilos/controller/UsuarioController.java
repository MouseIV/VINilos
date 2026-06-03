package com.vinilos.vinilos.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vinilos.vinilos.dto.LoginRequest;
import com.vinilos.vinilos.dto.LoginResponse;
import com.vinilos.vinilos.dto.RegistroRequest;
import com.vinilos.vinilos.dto.UsuarioUpdateDTO;
import com.vinilos.vinilos.model.Usuario;
import com.vinilos.vinilos.repository.UsuarioRepository;
import com.vinilos.vinilos.service.UsuarioService;

@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"}, allowCredentials = "true", allowedHeaders = "*")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarTodos();
    }

    @SuppressWarnings("null")
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/registro")
    public Usuario registrar(@RequestBody RegistroRequest request) {
        return usuarioService.registrar(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return usuarioService.login(request);
    }
    
    @SuppressWarnings("null")
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioUpdateDTO updateDTO) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Usuario usuario = usuarioOpt.get();
        
        if (updateDTO.getApellido() != null) usuario.setApellido(updateDTO.getApellido());
        if (updateDTO.getCiudad() != null) usuario.setCiudad(updateDTO.getCiudad());
        if (updateDTO.getDireccion() != null) usuario.setDireccion(updateDTO.getDireccion());
        if (updateDTO.getCodigoPostal() != null) usuario.setCodigoPostal(updateDTO.getCodigoPostal());
        if (updateDTO.getTelefono() != null) usuario.setTelefono(updateDTO.getTelefono());
        if (updateDTO.getTipoColeccionista() != null) usuario.setTipoColeccionista(updateDTO.getTipoColeccionista());
        
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return ResponseEntity.ok(usuarioGuardado);
    }
    
    @SuppressWarnings("null")
    @PutMapping("/{id}/tipo")
    public ResponseEntity<Map<String, String>> actualizarTipoUsuario(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        String nuevoTipo = body.get("tipo");
        if (nuevoTipo == null || (!nuevoTipo.equals("comprador") && !nuevoTipo.equals("vendedor") && !nuevoTipo.equals("ambos"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tipo de usuario inválido. Debe ser 'comprador', 'vendedor' o 'ambos'"));
        }
        
        Usuario usuario = usuarioOpt.get();
        usuario.setTipoCliente(nuevoTipo);
        usuarioRepository.save(usuario);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Tipo de usuario actualizado correctamente");
        response.put("tipo", nuevoTipo);
        return ResponseEntity.ok(response);
    }
}