package com.vinilos.vinilos.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vinilos.vinilos.model.Coleccion;
import com.vinilos.vinilos.model.Usuario;
import com.vinilos.vinilos.model.Vinilo;
import com.vinilos.vinilos.repository.ColeccionRepository;
import com.vinilos.vinilos.repository.UsuarioRepository;
import com.vinilos.vinilos.repository.ViniloRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@SuppressWarnings("null")
public class ViniloService {

    private static final Logger log = LoggerFactory.getLogger(ViniloService.class);

    @Autowired
    private ViniloRepository viniloRepository;
    
    @Autowired
    private ColeccionRepository coleccionRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private DiscogsService discogsService;

    public List<Vinilo> listarCatalogo() {
        return viniloRepository.findAll();
    }

    public Vinilo buscarViniloPorId(Long id) {
        return viniloRepository.findById(id).orElse(null);
    }

    public Vinilo importarAlCatalogo(String query) {
        log.info("Buscando en Discogs: {}", query);
        
        List<Vinilo> resultados = discogsService.buscarDiscos(query);
        
        log.info("Resultados encontrados: {}", resultados != null ? resultados.size() : 0);
        
        if (resultados == null || resultados.isEmpty()) {
            throw new RuntimeException("No se encontró el vinilo en Discogs");
        }
        
        Vinilo vinilo = resultados.get(0);
        
        log.info("Importando primer resultado: {} - {}", vinilo.getTitulo(), vinilo.getArtista());
        
        if (vinilo.getDiscogsId() != null && !vinilo.getDiscogsId().isEmpty()) {
            Optional<Vinilo> existente = viniloRepository.findByDiscogsId(vinilo.getDiscogsId());
            if (existente.isPresent()) {
                log.info("El vinilo ya existe en la base de datos, ID: {}", existente.get().getIdVinilo());
                return existente.get();
            }
        }
        
        List<Vinilo> todos = viniloRepository.findAll();
        for (Vinilo v : todos) {
            if (v.getTitulo().equalsIgnoreCase(vinilo.getTitulo()) && 
                v.getArtista().equalsIgnoreCase(vinilo.getArtista())) {
                log.info("El vinilo ya existe en la base de datos (por título/artista), ID: {}", v.getIdVinilo());
                return v;
            }
        }
        
        Vinilo viniloGuardado = viniloRepository.save(vinilo);
        log.info("Vinilo guardado con ID: {}", viniloGuardado.getIdVinilo());
        
        return viniloGuardado;
    }

    public Coleccion agregarAColeccion(String email, Long viniloId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Vinilo vinilo = viniloRepository.findById(viniloId)
                .orElseThrow(() -> new RuntimeException("Vinilo no encontrado"));
        
        if (coleccionRepository.existsByUsuarioAndViniloId(usuario, viniloId)) {
            throw new RuntimeException("El vinilo ya está en tu colección");
        }
        
        Coleccion coleccion = new Coleccion(usuario, vinilo);
        return coleccionRepository.save(coleccion);
    }

    public List<Coleccion> listarColeccion(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return coleccionRepository.findByUsuario(usuario);
    }

    public List<Vinilo> buscarEnDiscogs(String query) {
        return discogsService.buscarDiscos(query);
    }
}