package com.vinilos.vinilos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vinilos.vinilos.model.Disco;
import com.vinilos.vinilos.service.DiscoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/discos")
public class DiscoController {

    @Autowired
    private DiscoService discoService;

    @GetMapping("/catalogo")
    public List<Disco> listarCatalogo() {
        return discoService.listarCatalogo();
    }

    @GetMapping("/{id}")
    public Disco obtenerDisco(@PathVariable Long id) {
        return discoService.buscarDiscoPorId(id);
    }

    @GetMapping("/buscar")
    public List<Disco> buscarEnDiscogs(@RequestParam String q) {
        return discoService.buscarEnDiscogs(q);
    }

    @PostMapping("/importar/{discogsId}")
    public Disco importar(@PathVariable String discogsId) {
        return discoService.importarAlCatalogo(discogsId);
    }
}
