package com.vinilos.vinilos.controller;

import com.vinilos.vinilos.model.Disco;
import com.vinilos.vinilos.service.DiscoService;
import com.vinilos.vinilos.service.DiscogsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/discos")
public class DiscoController {
    
    private final DiscoService discoService;
    private final DiscogsService discogsService;
    
    public DiscoController(DiscoService discoService, DiscogsService discogsService) {
        this.discoService = discoService;
        this.discogsService = discogsService;
    }
    
    @GetMapping("/buscar")
    public List<Disco> buscarEnDiscogs(@RequestParam String q) {
        return discogsService.buscarDiscos(q);
    }
    
    @GetMapping("/detalle/{discogsId}")
    public ResponseEntity<Disco> obtenerDetalleDiscogs(@PathVariable String discogsId) {
        Disco disco = discogsService.obtenerDetalleDisco(discogsId);
        if (disco == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(disco);
    }
    
    @PostMapping("/importar/{discogsId}")
    public ResponseEntity<?> importarDisco(@PathVariable String discogsId) {
        try {
            Disco nuevo = discoService.importarDesdeDiscogs(discogsId);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    public List<Disco> listarDiscosBD() {
        return discoService.listarTodosBD();
    }
}