package com.vinilos.vinilos.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import com.vinilos.vinilos.model.Coleccion;
import com.vinilos.vinilos.repository.ColeccionRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/coleccion")
public class ColeccionController {

    @Autowired
    private ColeccionRepository coleccionRepository;

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarColeccion(@PathVariable @NonNull Long id, @RequestBody Map<String, Object> body) {
        Optional<Coleccion> coleccionOpt = coleccionRepository.findById(id);
        if (coleccionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Coleccion coleccion = coleccionOpt.get();
        
        String estado = (String) body.get("estado");
        Integer calificacion = (Integer) body.get("calificacion");
        
        if (estado != null && !estado.isEmpty()) {
            coleccion.setEstado(estado);
        }
        if (calificacion != null && calificacion >= 1 && calificacion <= 5) {
            coleccion.setCalificacion(calificacion);
        }
        
        Coleccion coleccionGuardada = coleccionRepository.save(coleccion);
        return ResponseEntity.ok(coleccionGuardada);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarDeColeccion(@PathVariable @NonNull Long id) {
        Optional<Coleccion> coleccionOpt = coleccionRepository.findById(id);
        if (coleccionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        coleccionRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Vinilo eliminado correctamente"));
    }
}