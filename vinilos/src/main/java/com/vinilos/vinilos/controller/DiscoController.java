package com.vinilos.vinilos.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vinilos.vinilos.model.Disco;
import com.vinilos.vinilos.service.DiscoService;
import com.vinilos.vinilos.service.DiscogsService;

@RestController
@RequestMapping("/api/discos")
public class DiscoController {
    
    private final DiscoService discoService;
    private final DiscogsService discogsService;
    
    public DiscoController(DiscoService discoService, DiscogsService discogsService) {
        this.discoService = discoService;
        this.discogsService = discogsService;
    }
    
    @GetMapping
    public List<Disco> listar() {
        return discoService.listarTodos();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Disco> obtener(@PathVariable Long id) {
        return discoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Disco> crear(@RequestBody Disco disco) {
        Disco nuevo = discoService.guardar(disco);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }
    
    @GetMapping("/buscar")
    public List<Disco> buscarEnDiscogs(@RequestParam String q) {
        return discogsService.buscarDiscos(q);
    }
}