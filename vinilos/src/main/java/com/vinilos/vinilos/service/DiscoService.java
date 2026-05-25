package com.vinilos.vinilos.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vinilos.vinilos.model.Coleccion;
import com.vinilos.vinilos.model.Disco;
import com.vinilos.vinilos.model.Usuario;
import com.vinilos.vinilos.repository.ColeccionRepository;
import com.vinilos.vinilos.repository.DiscoRepository;
import com.vinilos.vinilos.repository.UsuarioRepository;

@Service
public class DiscoService {
    
    private final DiscoRepository discoRepository;
    private final ColeccionRepository coleccionRepository;
    private final UsuarioRepository usuarioRepository;
    private final DiscogsService discogsService;
    
    public DiscoService(DiscoRepository discoRepository, 
                        ColeccionRepository coleccionRepository,
                        UsuarioRepository usuarioRepository,
                        DiscogsService discogsService) {
        this.discoRepository = discoRepository;
        this.coleccionRepository = coleccionRepository;
        this.usuarioRepository = usuarioRepository;
        this.discogsService = discogsService;
    }
    
    public List<Disco> listarCatalogo() {
        return discoRepository.findAll();
    }
    
    public Disco buscarDiscoPorId(Long id) {
        return discoRepository.findById(id).orElse(null);
    }
    
    public Disco importarAlCatalogo(String discogsId) {
        Disco existente = discoRepository.findByDiscogsId(discogsId).orElse(null);
        if (existente != null) {
            return existente;
        }
        
        Disco nuevoDisco = discogsService.obtenerDetalleDiscoEntity(discogsId);
        if (nuevoDisco == null) {
            throw new RuntimeException("No se pudo obtener el disco de Discogs");
        }
        
        return discoRepository.save(nuevoDisco);
    }
    
    public Coleccion agregarAColeccion(String email, Long discoId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Disco disco = discoRepository.findById(discoId)
            .orElseThrow(() -> new RuntimeException("Disco no encontrado"));
        
        if (coleccionRepository.existsByUsuarioAndDisco_Id(usuario, discoId)) {
            throw new RuntimeException("El disco ya está en tu colección");
        }
        
        Coleccion coleccion = new Coleccion(usuario, disco);
        return coleccionRepository.save(coleccion);
    }
    
    public List<Coleccion> listarColeccion(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return coleccionRepository.findByUsuario(usuario);
    }
    
    public List<Disco> buscarEnDiscogs(String query) {
        return discogsService.buscarDiscos(query);
    }
}
