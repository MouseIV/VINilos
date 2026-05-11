package com.vinilos.vinilos.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.vinilos.vinilos.model.Disco;
import com.vinilos.vinilos.repository.DiscoRepository;

@Service
public class DiscoService {
    
    private final List<Disco> discos = new ArrayList<>();
    private Long contadorId = 1L;
    private final DiscogsService discogsService;
    private final DiscoRepository discoRepository;
    
    // Modifica el constructor
    public DiscoService(DiscoRepository discoRepository, DiscogsService discogsService) {
        this.discoRepository = discoRepository;
        this.discogsService = discogsService;
        this.discos = new ArrayList<>();
        this.contadorId = 1L;
        // Datos iniciales...
    }
    
    // Nuevo método: importar disco desde Discogs
    public Disco importarDesdeDiscogs(String discogsId) {
        // Verificar si ya existe
        Optional<Disco> existente = discoRepository.findByDiscogsId(discogsId);
        if (existente.isPresent()) {
            throw new RuntimeException("El disco ya existe en la base de datos");
        }
        
        Disco disco = discogsService.obtenerDetalleDiscoEntity(discogsId);
        if (disco == null) {
            throw new RuntimeException("No se pudo obtener el disco de Discogs");
        }
        
        return discoRepository.save(disco);
    }
    
    public List<Disco> listarTodosBD() {
        return discoRepository.findAll();
    }
    
    public DiscoService() {
        discos.add(new Disco(contadorId++, "Dark Side of the Moon", "Pink Floyd", 1973, "Rock", "https://picsum.photos/200/300"));
        discos.add(new Disco(contadorId++, "Thriller", "Michael Jackson", 1982, "Pop", "https://picsum.photos/200/300"));
        discos.add(new Disco(contadorId++, "Back in Black", "AC/DC", 1980, "Rock", "https://picsum.photos/200/300"));
    }
    
    public List<Disco> listarTodos() {
        return discos;
    }
    
    public Optional<Disco> buscarPorId(Long id) {
        return discos.stream().filter(d -> d.getId().equals(id)).findFirst();
    }
    
    public Disco guardar(Disco disco) {
        disco.setId(contadorId++);
        discos.add(disco);
        return disco;
    }
}