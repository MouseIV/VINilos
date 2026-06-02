package com.vinilos.vinilos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vinilos.vinilos.model.Coleccion;
import com.vinilos.vinilos.model.Usuario;
import com.vinilos.vinilos.model.Vinilo;
import com.vinilos.vinilos.repository.ColeccionRepository;
import com.vinilos.vinilos.repository.UsuarioRepository;
import com.vinilos.vinilos.repository.ViniloRepository;

@Service
@SuppressWarnings("null")
public class ViniloService {

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
        List<Vinilo> resultados = discogsService.buscarDiscos(query);
        if (resultados == null || resultados.isEmpty()) {
            throw new RuntimeException("No se encontró el vinilo en Discogs");
        }
        Vinilo vinilo = resultados.get(0);
        Vinilo existente = viniloRepository.findByDiscogsId(vinilo.getDiscogsId()).orElse(null);
        if (existente != null) {
            return existente;
        }
        return viniloRepository.save(vinilo);
    }

    public Coleccion agregarAColeccion(String email, Long viniloId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Vinilo vinilo = viniloRepository.findById(viniloId)
                .orElseThrow(() -> new RuntimeException("Vinilo no encontrado"));
        if (coleccionRepository.existsByUsuarioAndViniloIdVinilo(usuario, viniloId)) {
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