package com.vinilos.vinilos.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vinilos.vinilos.external.DiscogsClient;
import com.vinilos.vinilos.model.Vinilo;

@Service
public class DiscogsService {
    
    private static final Logger log = LoggerFactory.getLogger(DiscogsService.class);
    
    private final DiscogsClient discogsClient;
    private final ObjectMapper objectMapper;
    
    private final List<Vinilo> cacheGlobal = new ArrayList<>();
    private final Set<String> idsEnCache = new HashSet<>();
    
    public DiscogsService(DiscogsClient discogsClient) {
        this.discogsClient = discogsClient;
        this.objectMapper = new ObjectMapper();
    }
    
    public List<Vinilo> buscarDiscos(String query) {
        List<Vinilo> vinilos = new ArrayList<>();
        
        try {
            log.info("=========================================");
            log.info("🔍 BUSCANDO: {}", query);
            
            String respuesta = discogsClient.buscarDiscos(query);
            
            if (respuesta == null || respuesta.isEmpty()) {
                log.warn("❌ Respuesta vacía");
                return completarConCache(vinilos);
            }
            
            log.info("✅ Respuesta recibida, longitud: {}", respuesta.length());
            
            JsonNode root = objectMapper.readTree(respuesta);
            JsonNode results = root.get("results");
            
            if (results == null || !results.isArray()) {
                log.warn("❌ No se encontraron resultados");
                return completarConCache(vinilos);
            }
            
            log.info("📊 Resultados totales de Discogs: {}", results.size());
            
            int intentos = 0;
            int maxIntentos = 100;
            
            for (JsonNode item : results) {
                if (intentos >= maxIntentos) break;
                intentos++;
                
                if (!esViniloValido(item)) {
                    continue;
                }
                
                String imagen = extraerImagen(item);
                if (imagen == null || imagen.isEmpty()) {
                    continue;
                }
                
                String titulo = extraerTituloLimpio(item);
                String artista = extraerArtista(item);
                Integer anio = extraerAnio(item);
                String genero = extraerGenero(item);
                
                String idUnico = artista + "|" + titulo;
                boolean yaExiste = vinilos.stream().anyMatch(v -> 
                    (v.getArtista() + "|" + v.getTitulo()).equals(idUnico));
                if (yaExiste) {
                    continue;
                }
                
                Vinilo vinilo = new Vinilo();
                vinilo.setTitulo(titulo);
                vinilo.setArtista(artista);
                vinilo.setAnio(anio);
                vinilo.setGenero(genero);
                vinilo.setImagenUrl(imagen);
                
                vinilos.add(vinilo);
                
                if (vinilos.size() >= 15) {
                    break;
                }
            }
            
            log.info("📀 Vinilos nuevos encontrados: {}", vinilos.size());
            
            guardarEnCacheGlobal(vinilos);
            
            if (vinilos.size() < 15) {
                vinilos = completarConCache(vinilos);
            }
            
            log.info("📀 Vinilos totales devueltos: {}", vinilos.size());
            log.info("=========================================");
            
            return vinilos;
            
        } catch (JsonProcessingException e) {
            log.error("❌ Error al procesar JSON: {}", e.getMessage());
            return completarConCache(vinilos);
        } catch (Exception e) {
            log.error("❌ Error inesperado: {}", e.getMessage());
            return completarConCache(vinilos);
        }
    }
    
    private synchronized void guardarEnCacheGlobal(List<Vinilo> vinilos) {
        for (Vinilo vinilo : vinilos) {
            String id = vinilo.getArtista() + "|" + vinilo.getTitulo();
            if (!idsEnCache.contains(id)) {
                idsEnCache.add(id);
                cacheGlobal.add(vinilo);
            }
        }
        log.info("💾 Caché global actualizado. Total en caché: {}", cacheGlobal.size());
    }
    
    private List<Vinilo> completarConCache(List<Vinilo> vinilosActuales) {
        List<Vinilo> resultado = new ArrayList<>(vinilosActuales);
        Set<String> idsActuales = new HashSet<>();
        
        for (Vinilo v : vinilosActuales) {
            idsActuales.add(v.getArtista() + "|" + v.getTitulo());
        }
        
        for (Vinilo viniloCache : cacheGlobal) {
            String id = viniloCache.getArtista() + "|" + viniloCache.getTitulo();
            if (!idsActuales.contains(id)) {
                resultado.add(viniloCache);
                idsActuales.add(id);
                if (resultado.size() >= 15) {
                    break;
                }
            }
        }
        
        if (resultado.size() < 15) {
            List<Vinilo> ejemplos = obtenerVinilosEjemplo();
            for (Vinilo ejemplo : ejemplos) {
                String id = ejemplo.getArtista() + "|" + ejemplo.getTitulo();
                if (!idsActuales.contains(id)) {
                    resultado.add(ejemplo);
                    idsActuales.add(id);
                    if (resultado.size() >= 15) {
                        break;
                    }
                }
            }
        }
        
        log.info("📦 Completado con caché. Total: {}", resultado.size());
        return resultado;
    }
    
    private List<Vinilo> obtenerVinilosEjemplo() {
        List<Vinilo> ejemplos = new ArrayList<>();
        
        String[][] datos = {
            {"Dark Side of the Moon", "Pink Floyd", "1973", "Rock", "https://picsum.photos/id/104/100/100"},
            {"Thriller", "Michael Jackson", "1982", "Pop", "https://picsum.photos/id/101/100/100"},
            {"Abbey Road", "The Beatles", "1969", "Rock", "https://picsum.photos/id/100/100/100"},
            {"Back in Black", "AC/DC", "1980", "Rock", "https://picsum.photos/id/103/100/100"},
            {"Rumours", "Fleetwood Mac", "1977", "Rock", "https://picsum.photos/id/107/100/100"},
            {"The Wall", "Pink Floyd", "1979", "Rock", "https://picsum.photos/id/105/100/100"},
            {"Nevermind", "Nirvana", "1991", "Grunge", "https://picsum.photos/id/106/100/100"},
            {"Hotel California", "Eagles", "1976", "Rock", "https://picsum.photos/id/108/100/100"},
            {"Born to Run", "Bruce Springsteen", "1975", "Rock", "https://picsum.photos/id/109/100/100"},
            {"Let It Be", "The Beatles", "1970", "Rock", "https://picsum.photos/id/110/100/100"},
            {"Purple Rain", "Prince", "1984", "Pop", "https://picsum.photos/id/111/100/100"},
            {"A Kind of Blue", "Miles Davis", "1959", "Jazz", "https://picsum.photos/id/112/100/100"},
            {"Legend", "Bob Marley", "1984", "Reggae", "https://picsum.photos/id/113/100/100"},
            {"The Joshua Tree", "U2", "1987", "Rock", "https://picsum.photos/id/114/100/100"},
            {"OK Computer", "Radiohead", "1997", "Alternative", "https://picsum.photos/id/115/100/100"}
        };
        
        for (String[] d : datos) {
            Vinilo vinilo = new Vinilo();
            vinilo.setTitulo(d[0]);
            vinilo.setArtista(d[1]);
            vinilo.setAnio(Integer.parseInt(d[2]));
            vinilo.setGenero(d[3]);
            vinilo.setImagenUrl(d[4]);
            ejemplos.add(vinilo);
        }
        
        return ejemplos;
    }
    
    private boolean esViniloValido(JsonNode item) {
        String tituloCompleto = item.has("title") ? item.get("title").asText().toLowerCase() : "";
        
        String tituloLimpio = tituloCompleto;
        if (tituloCompleto.contains(" - ")) {
            String[] partes = tituloCompleto.split(" - ", 2);
            if (partes.length > 1) {
                tituloLimpio = partes[1];
            }
        }
        
        String artista = extraerArtista(item).toLowerCase();
        
        if (tituloLimpio.contains("various") || artista.contains("various")) {
            return false;
        }
        
        return !(tituloLimpio.isEmpty() || artista.isEmpty() || artista.equals("artista desconocido"));
    }
    
    private String extraerArtista(JsonNode item) {
        if (item.has("title") && !item.get("title").isNull()) {
            String title = item.get("title").asText();
            if (title.contains(" - ")) {
                int firstDashIndex = title.indexOf(" - ");
                if (firstDashIndex > 0) {
                    String artista = title.substring(0, firstDashIndex);
                    artista = artista.trim();
                    if (!artista.isEmpty()) {
                        return artista;
                    }
                }
            }
        }
        
        if (item.has("artist") && item.get("artist").isArray() && item.get("artist").size() > 0) {
            JsonNode primerArtista = item.get("artist").get(0);
            if (primerArtista.isTextual()) {
                return primerArtista.asText();
            } else if (primerArtista.has("name")) {
                return primerArtista.get("name").asText();
            }
        }
        
        if (item.has("artists") && item.get("artists").isArray() && item.get("artists").size() > 0) {
            JsonNode primerArtista = item.get("artists").get(0);
            if (primerArtista.has("name")) {
                return primerArtista.get("name").asText();
            }
        }
        
        return "Artista desconocido";
    }
    
    private String extraerTituloLimpio(JsonNode item) {
        if (item.has("title") && !item.get("title").isNull()) {
            String title = item.get("title").asText();
            
            if (title.contains(" - ")) {
                int lastDashIndex = title.lastIndexOf(" - ");
                if (lastDashIndex > 0) {
                    String tituloLimpio = title.substring(lastDashIndex + 3);
                    tituloLimpio = tituloLimpio.trim();
                    if (!tituloLimpio.isEmpty()) {
                        return tituloLimpio;
                    }
                }
            }
            return title;
        }
        return "Sin título";
    }
    
    private Integer extraerAnio(JsonNode item) {
        if (item.has("year") && !item.get("year").isNull()) {
            String yearStr = item.get("year").asText();
            try {
                return Integer.parseInt(yearStr);
            } catch (NumberFormatException e) {
                return 0;
            }
        }
        return 0;
    }
    
    private String extraerGenero(JsonNode item) {
        if (item.has("genre") && item.get("genre").isArray() && item.get("genre").size() > 0) {
            return item.get("genre").get(0).asText();
        }
        if (item.has("style") && item.get("style").isArray() && item.get("style").size() > 0) {
            return item.get("style").get(0).asText();
        }
        return "Sin género";
    }
    
    private String extraerImagen(JsonNode item) {
        if (item.has("cover_image") && !item.get("cover_image").isNull()) {
            String img = item.get("cover_image").asText();
            if (img != null && !img.isEmpty() && !img.equals("https://img.discogs.com/") && !img.equals("https://st.discogs.com/images/blank.png")) {
                return img;
            }
        }
        
        if (item.has("thumb") && !item.get("thumb").isNull()) {
            String img = item.get("thumb").asText();
            if (img != null && !img.isEmpty() && !img.equals("https://st.discogs.com/images/blank.png")) {
                return img;
            }
        }
        
        if (item.has("images") && item.get("images").isArray() && item.get("images").size() > 0) {
            for (JsonNode imgNode : item.get("images")) {
                if (imgNode.has("uri") && !imgNode.get("uri").isNull()) {
                    String img = imgNode.get("uri").asText();
                    if (img != null && !img.isEmpty()) {
                        return img;
                    }
                }
            }
        }
        
        if (item.has("master_id") && !item.get("master_id").isNull()) {
            String masterId = item.get("master_id").asText();
            if (masterId != null && !masterId.isEmpty() && !masterId.equals("0")) {
                try {
                    String masterResponse = discogsClient.obtenerMaster(masterId);
                    JsonNode masterRoot = objectMapper.readTree(masterResponse);
                    if (masterRoot.has("images") && masterRoot.get("images").isArray() && masterRoot.get("images").size() > 0) {
                        String img = masterRoot.get("images").get(0).get("uri").asText();
                        if (img != null && !img.isEmpty()) {
                            return img;
                        }
                    }
                } catch (Exception e) {
                    log.warn("Error obteniendo imagen del master: {}", e.getMessage());
                }
            }
        }
        
        return "";
    }

    public Vinilo obtenerDetalleDisco(String discogsId) {
        try {
            String respuesta = discogsClient.obtenerDetalleDisco(discogsId);
            JsonNode root = objectMapper.readTree(respuesta);
            
            Vinilo vinilo = new Vinilo();
            vinilo.setTitulo(root.has("title") ? root.get("title").asText() : "Sin título");
            vinilo.setArtista(extraerArtistasDetalle(root));
            vinilo.setAnio(root.has("year") ? root.get("year").asInt() : 0);
            vinilo.setGenero(extraerGenerosDetalle(root));
            vinilo.setImagenUrl(extraerImagenDetalle(root));
            
            return vinilo;
        } catch (Exception e) {
            log.error("Error al obtener detalle: {}", e.getMessage());
            return null;
        }
    }
    
    private String extraerArtistasDetalle(JsonNode root) {
        if (root.has("artists") && root.get("artists").isArray() && root.get("artists").size() > 0) {
            return root.get("artists").get(0).get("name").asText();
        }
        if (root.has("title") && !root.get("title").isNull()) {
            String title = root.get("title").asText();
            if (title.contains(" - ")) {
                return title.split(" - ")[0];
            }
        }
        return "Artista desconocido";
    }
    
    private String extraerGenerosDetalle(JsonNode root) {
        if (root.has("genres") && root.get("genres").isArray() && root.get("genres").size() > 0) {
            List<String> generos = new ArrayList<>();
            for (JsonNode g : root.get("genres")) {
                generos.add(g.asText());
            }
            return String.join(", ", generos);
        }
        return "Sin género";
    }
    
    private String extraerImagenDetalle(JsonNode root) {
        if (root.has("images") && root.get("images").isArray() && root.get("images").size() > 0) {
            return root.get("images").get(0).get("uri").asText();
        }
        if (root.has("cover_image") && !root.get("cover_image").isNull()) {
            String img = root.get("cover_image").asText();
            if (img != null && !img.isEmpty()) {
                return img;
            }
        }
        return "";
    }

    public Vinilo convertirAVinilo(JsonNode root, String discogsId) {
        Vinilo vinilo = new Vinilo();
        vinilo.setTitulo(root.has("title") ? root.get("title").asText() : "Sin título");
        vinilo.setArtista(extraerArtistasDetalle(root));
        vinilo.setAnio(root.has("year") ? root.get("year").asInt() : 0);
        vinilo.setGenero(extraerGenerosDetalle(root));
        vinilo.setImagenUrl(extraerImagenDetalle(root));
        vinilo.setDiscogsId(discogsId);
        return vinilo;
    }
    
    public Vinilo obtenerDetalleDiscoEntity(String discogsId) {
        try {
            String respuesta = discogsClient.obtenerDetalleDisco(discogsId);
            JsonNode root = objectMapper.readTree(respuesta);
            return convertirAVinilo(root, discogsId);
        } catch (Exception e) {
            log.error("Error obteniendo detalle del disco: {}", e.getMessage());
            return null;
        }
    }
}