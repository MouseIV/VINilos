package com.vinilos.vinilos.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vinilos.vinilos.config.JwtUtil;
import com.vinilos.vinilos.model.Coleccion;
import com.vinilos.vinilos.model.Vinilo;
import com.vinilos.vinilos.repository.ColeccionRepository;
import com.vinilos.vinilos.service.ViniloService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/discos")
@SuppressWarnings("null")
public class ViniloController {

    private static final Logger log = LoggerFactory.getLogger(ViniloController.class);

    @Autowired
    private ViniloService viniloService;
    
    @Autowired
    private ColeccionRepository coleccionRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/buscar")
    public ResponseEntity<List<Vinilo>> buscarDiscos(@RequestParam String q) {
        return ResponseEntity.ok(viniloService.buscarEnDiscogs(q));
    }

    @GetMapping("/mi-coleccion")
    public ResponseEntity<?> obtenerMiColeccion(@RequestHeader("Authorization") String auth) {
        String email = extractEmailFromToken(auth);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido");
        }
        return ResponseEntity.ok(viniloService.listarColeccion(email));
    }

    @PostMapping
    public ResponseEntity<?> importarDisco(@RequestBody Vinilo vinilo, @RequestHeader("Authorization") String auth) {
        String email = extractEmailFromToken(auth);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido");
        }
        
        Vinilo viniloGuardado = viniloService.importarAlCatalogo(vinilo.getTitulo());
        Coleccion coleccion = viniloService.agregarAColeccion(email, viniloGuardado.getIdVinilo());
        return ResponseEntity.ok(coleccion);
    }
    
    @PostMapping("/agregar")
    public ResponseEntity<?> agregarADiscos(@RequestBody Map<String, Object> body, @RequestHeader("Authorization") String auth) {
        String email = extractEmailFromToken(auth);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido");
        }
        
        try {
            Long viniloId = ((Number) body.get("discoId")).longValue();
            String estado = (String) body.get("estado");
            Integer calificacion = (Integer) body.get("calificacion");
            
            Coleccion coleccion = viniloService.agregarAColeccion(email, viniloId);
            
            if (estado != null && !estado.isEmpty()) {
                coleccion.setEstado(estado);
            }
            if (calificacion != null && calificacion >= 1 && calificacion <= 5) {
                coleccion.setCalificacion(calificacion);
            }
            
            Coleccion coleccionGuardada = coleccionRepository.save(coleccion);
            return ResponseEntity.ok(coleccionGuardada);
        } catch (Exception e) {
            log.error("Error al añadir a colección: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error al añadir a colección: " + e.getMessage());
        }
    }
    
    private String extractEmailFromToken(String auth) {
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            try {
                return jwtUtil.extractEmail(token);
            } catch (Exception e) {
                log.error("Error extrayendo email del token: {}", e.getMessage());
                return null;
            }
        }
        return null;
    }
}