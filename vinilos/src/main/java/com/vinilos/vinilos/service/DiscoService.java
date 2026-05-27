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

    // Listar catálogo general
    public List<Disco> listarCatalogo() {
        return discoRepository.findAll();
    }

    // Buscar disco por ID
    public Disco buscarDiscoPorId(Long id) {
        return discoRepository.findById(id).orElse(null);
    }

    // Importar disco desde Discogs al catálogo general
    public Disco importarAlCatalogo(String query) {
        // Buscar en Discogs
        List<Disco> resultados = discogsService.buscarDiscos(query);

        if (resultados == null || resultados.isEmpty()) {
            throw new RuntimeException("No se encontró el disco en Discogs");
        }

        Disco disco = resultados.get(0);

        // Evitar duplicados
        Disco existente = discoRepository.findByDiscogsId(disco.getDiscogsId()).orElse(null);
        if (existente != null) {
            return existente;
        }

        return discoRepository.save(disco);
    }

    // Añadir disco a la colección personal del usuario
    public Coleccion agregarAColeccion(String email, Long discoId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Disco disco = discoRepository.findById(discoId)
                .orElseThrow(() -> new RuntimeException("Disco no encontrado"));

        if (coleccionRepository.existsByUsuarioAndDiscoId(usuario, discoId)) {
            throw new RuntimeException("El disco ya está en tu colección");
        }

        Coleccion coleccion = new Coleccion(usuario, disco);
        return coleccionRepository.save(coleccion);
    }

    // Listar colección personal
    public List<Coleccion> listarColeccion(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return coleccionRepository.findByUsuario(usuario);
    }

    // Buscar en Discogs
    public List<Disco> buscarEnDiscogs(String query) {
        return discogsService.buscarDiscos(query);
    }
}
