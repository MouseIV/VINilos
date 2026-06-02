package com.vinilos.vinilos.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vinilos.vinilos.model.Coleccion;
import com.vinilos.vinilos.model.Disco;
import com.vinilos.vinilos.repository.ColeccionRepository;
import com.vinilos.vinilos.service.DiscoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/discos")
public class DiscoController {

    @Autowired
    private DiscoService discoService;
    
    @Autowired
    private ColeccionRepository coleccionRepository;

    @GetMapping("/buscar")
    public ResponseEntity<List<Disco>> buscarDiscos(@RequestParam String q) {
        return ResponseEntity.ok(discoService.buscarEnDiscogs(q));
    }

    @GetMapping("/mi-coleccion")
    public ResponseEntity<?> obtenerMiColeccion(@RequestHeader("Authorization") String auth) {
        String email = extractEmailFromToken(auth);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido");
        }
        return ResponseEntity.ok(discoService.listarColeccion(email));
    }

    @PostMapping
    public ResponseEntity<?> importarDisco(@RequestBody Disco disco, @RequestHeader("Authorization") String auth) {
        String email = extractEmailFromToken(auth);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido");
        }
        
        Disco discoGuardado = discoService.importarAlCatalogo(disco.getTitulo());
        Coleccion coleccion = discoService.agregarAColeccion(email, discoGuardado.getId());
        return ResponseEntity.ok(coleccion);
    }
    
    @PostMapping("/agregar")
    public ResponseEntity<?> agregarADiscos(@RequestBody Map<String, Object> body, @RequestHeader("Authorization") String auth) {
        String email = extractEmailFromToken(auth);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido");
        }
        
        try {
            Long discoId = ((Number) body.get("discoId")).longValue();
            String estado = (String) body.get("estado");
            Integer calificacion = (Integer) body.get("calificacion");
            
            Coleccion coleccion = discoService.agregarAColeccion(email, discoId);
            
            if (estado != null && !estado.isEmpty()) {
                coleccion.setEstado(estado);
            }
            if (calificacion != null && calificacion >= 1 && calificacion <= 5) {
                coleccion.setCalificacion(calificacion);
            }
            
            Coleccion coleccionGuardada = coleccionRepository.save(coleccion);
            return ResponseEntity.ok(coleccionGuardada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al añadir a colección: " + e.getMessage());
        }
    }
    
    private String extractEmailFromToken(String auth) {
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            // Implementar extracción real del email desde el token JWT
            try {
                // Usar JwtUtil para extraer el email
                // return jwtUtil.extractEmail(token);
                return "test@example.com"; // Temporal hasta tener jwtUtil disponible
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
}