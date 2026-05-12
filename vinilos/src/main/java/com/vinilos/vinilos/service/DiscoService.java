package com.vinilos.vinilos.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.vinilos.vinilos.model.Disco;
import com.vinilos.vinilos.repository.DiscoRepository;

@Service
public class DiscoService {
    
    private final DiscoRepository discoRepository;
    private final DiscogsService discogsService;
    
    public DiscoService(DiscoRepository discoRepository, DiscogsService discogsService) {
        this.discoRepository = discoRepository;
        this.discogsService = discogsService;
    }
    
    public Disco importarDesdeDiscogs(String discogsId) {
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
    
    public Optional<Disco> buscarPorIdBD(Long id) {
        return discoRepository.findById(id);
    }
}