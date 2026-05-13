package com.vinilos.vinilos.controller;

import com.vinilos.vinilos.config.JwtUtil;
import com.vinilos.vinilos.model.Coleccion;
import com.vinilos.vinilos.model.Disco;
import com.vinilos.vinilos.service.DiscoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/discos")
public class DiscoController {
    
    private final DiscoService discoService;
    private final JwtUtil jwtUtil;
    
    public DiscoController(DiscoService discoService, JwtUtil jwtUtil) {
        this.discoService = discoService;
        this.jwtUtil = jwtUtil;
    }
    
    // Extraer email del token (usando el método correcto de JwtUtil)
    private String extraerEmail(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        // Usa extractUsername (que devuelve el email) o el método que tengas
        return jwtUtil.extractUsername(token);
    }
    
    // ========== ENDPOINTS PÚBLICOS ==========
    
    @GetMapping
    public List<Disco> listarCatalogo() {
        return discoService.listarCatalogo();
    }
    
    @GetMapping("/buscar")
    public List<Disco> buscarEnDiscogs(@RequestParam String q) {
        return discoService.buscarEnDiscogs(q);
    }
    
    @PostMapping("/importar/{discogsId}")
    public ResponseEntity<?> importarAlCatalogo(@PathVariable String discogsId) {
        try {
            Disco disco = discoService.importarAlCatalogo(discogsId);
            return ResponseEntity.ok(disco);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // ========== ENDPOINTS PROTEGIDOS ==========
    
    @PostMapping("/{discoId}/agregar")
    public ResponseEntity<?> agregarAColeccion(@RequestHeader("Authorization") String token,
                                                @PathVariable Long discoId) {
        try {
            String email = extraerEmail(token);
            Coleccion coleccion = discoService.agregarAColeccion(email, discoId);
            return ResponseEntity.status(HttpStatus.CREATED).body(coleccion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/mi-coleccion")
    public ResponseEntity<?> listarMiColeccion(@RequestHeader("Authorization") String token) {
        try {
            String email = extraerEmail(token);
            List<Coleccion> coleccion = discoService.listarColeccion(email);
            return ResponseEntity.ok(coleccion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}