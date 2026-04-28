package com.vinilos.vinilos.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.vinilos.vinilos.model.Disco;

@Service
public class DiscoService {
    
    private final List<Disco> discos = new ArrayList<>();
    private Long contadorId = 1L;
    
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