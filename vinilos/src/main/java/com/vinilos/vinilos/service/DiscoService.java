package com.vinilos.vinilos.service;

import com.vinilos.vinilos.model.Coleccion;
import com.vinilos.vinilos.model.Disco;
import com.vinilos.vinilos.model.Usuario;
import com.vinilos.vinilos.repository.ColeccionRepository;
import com.vinilos.vinilos.repository.DiscoRepository;
import com.vinilos.vinilos.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

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
    
    // Listar todos los discos del catálogo general
    public List<Disco> listarCatalogo() {
        return discoRepository.findAll();
    }
    
    // Buscar disco por ID
    public Disco buscarDiscoPorId(Long id) {
        return discoRepository.findById(id).orElse(null);
    }
    
    // Importar disco desde Discogs al catálogo general
    public Disco importarAlCatalogo(String discogsId) {
        Disco existente = discoRepository.findByDiscogsId(discogsId).orElse(null);
        if (existente != null) {
            return existente;
        }
        
        // Intentar obtener el detalle del disco desde Discogs usando la búsqueda pública
        java.util.List<Disco> resultados = invokeBuscarDiscos(discogsId);
        if (resultados == null || resultados.isEmpty()) {
            throw new RuntimeException("No se pudo obtener el disco de Discogs");
        }
        Disco nuevoDisco = resultados.get(0);
        
        return discoRepository.save(nuevoDisco);
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
    
    // Listar la colección personal del usuario
    public List<Coleccion> listarColeccion(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return coleccionRepository.findByUsuario(usuario);
    }
    
    // Buscar en Discogs (público)
    public List<Disco> buscarEnDiscogs(String query) {
        return invokeBuscarDiscos(query);

    // Use reflection to call the appropriate search method on DiscogsService
    @SuppressWarnings("unchecked")
    private java.util.List<Disco> invokeBuscarDiscos(String query) {
        String[] candidates = {"buscarDiscos", "buscarDisco", "buscar", "searchDiscos", "search"};
        for (String name : candidates) {
            try {
                java.lang.reflect.Method m = discogsService.getClass().getMethod(name, String.class);
                Object res = m.invoke(discogsService, query);
                if (res instanceof java.util.List) return (java.util.List<Disco>) res;
            } catch (NoSuchMethodException e) {
                // try next
            } catch (Exception e) {
                throw new RuntimeException("Error invoking DiscogsService." , e);
            }
        }
        throw new RuntimeException("DiscogsService search method not found");
    }
    }
}