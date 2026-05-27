package com.vinilos.vinilos.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vinilos.vinilos.external.DiscogsClient;
import com.vinilos.vinilos.model.Disco;

@Service
public class DiscogsService {
    
    private final DiscogsClient discogsClient;
    private final ObjectMapper objectMapper;
    
    // Caché global de discos ya obtenidos
    private final List<Disco> cacheGlobal = new ArrayList<>();
    private final Set<String> idsEnCache = new HashSet<>();
    
    public DiscogsService(DiscogsClient discogsClient) {
        this.discogsClient = discogsClient;
        this.objectMapper = new ObjectMapper();
    }
    
    public List<Disco> buscarDiscos(String query) {
        List<Disco> discos = new ArrayList<>();
        
        try {
            System.out.println("=========================================");
            System.out.println("🔍 BUSCANDO: " + query);
            
            String respuesta = discogsClient.buscarDiscos(query);
            
            if (respuesta == null || respuesta.isEmpty()) {
                System.out.println("❌ Respuesta vacía");
                return completarConCache(discos);
            }
            
            System.out.println("✅ Respuesta recibida, longitud: " + respuesta.length());
            
            JsonNode root = objectMapper.readTree(respuesta);
            JsonNode results = root.get("results");
            
            if (results == null || !results.isArray()) {
                System.out.println("❌ No se encontraron resultados");
                return completarConCache(discos);
            }
            
            System.out.println("📊 Resultados totales de Discogs: " + results.size());
            
            int intentos = 0;
            int maxIntentos = 100;
            
            for (JsonNode item : results) {
                if (intentos >= maxIntentos) break;
                intentos++;
                
                // Validar vinilo
                if (!esViniloValido(item)) {
                    continue;
                }
                
                // Extraer imagen
                String imagen = extraerImagen(item);
                if (imagen == null || imagen.isEmpty()) {
                    continue;
                }
                
                // Extraer datos
                String titulo = extraerTituloLimpio(item);
                String artista = extraerArtista(item);
                Integer anio = extraerAnio(item);
                String genero = extraerGenero(item);
                
                // Verificar duplicado
                String idUnico = artista + "|" + titulo;
                boolean yaExiste = discos.stream().anyMatch(d -> 
                    (d.getArtista() + "|" + d.getTitulo()).equals(idUnico));
                if (yaExiste) {
                    continue;
                }
                
                Disco disco = new Disco();
                disco.setTitulo(titulo);
                disco.setArtista(artista);
                disco.setAnio(anio);
                disco.setGenero(genero);
                disco.setImagenUrl(imagen);
                
                discos.add(disco);
                
                if (discos.size() >= 15) {
                    break;
                }
            }
            
            System.out.println("📀 Vinilos nuevos encontrados: " + discos.size());
            
            // Guardar en caché global
            guardarEnCacheGlobal(discos);
            
            // Si no alcanzamos 15, completar con caché
            if (discos.size() < 15) {
                discos = completarConCache(discos);
            }
            
            System.out.println("📀 Vinilos totales devueltos: " + discos.size());
            System.out.println("=========================================");
            
            return discos;
            
        } catch (JsonProcessingException e) {
            System.err.println("❌ Error al procesar JSON: " + e.getMessage());
            e.printStackTrace();
            return completarConCache(discos);
        } catch (Exception e) {
            System.err.println("❌ Error inesperado: " + e.getMessage());
            e.printStackTrace();
            return completarConCache(discos);
        }
    }
    
    private synchronized void guardarEnCacheGlobal(List<Disco> discos) {
        for (Disco disco : discos) {
            String id = disco.getArtista() + "|" + disco.getTitulo();
            if (!idsEnCache.contains(id)) {
                idsEnCache.add(id);
                cacheGlobal.add(disco);
            }
        }
        System.out.println("💾 Caché global actualizado. Total en caché: " + cacheGlobal.size());
    }
    
    private List<Disco> completarConCache(List<Disco> discosActuales) {
        List<Disco> resultado = new ArrayList<>(discosActuales);
        Set<String> idsActuales = new HashSet<>();
        
        for (Disco d : discosActuales) {
            idsActuales.add(d.getArtista() + "|" + d.getTitulo());
        }
        
        // Añadir discos del caché que no estén ya
        for (Disco discoCache : cacheGlobal) {
            String id = discoCache.getArtista() + "|" + discoCache.getTitulo();
            if (!idsActuales.contains(id)) {
                resultado.add(discoCache);
                idsActuales.add(id);
                if (resultado.size() >= 15) {
                    break;
                }
            }
        }
        
        // Si aún faltan, añadir discos de ejemplo
        if (resultado.size() < 15) {
            List<Disco> ejemplos = obtenerDiscosEjemplo();
            for (Disco ejemplo : ejemplos) {
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
        
        System.out.println("📦 Completado con caché. Total: " + resultado.size());
        return resultado;
    }
    
    private List<Disco> obtenerDiscosEjemplo() {
        List<Disco> ejemplos = new ArrayList<>();
        
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
            Disco disco = new Disco();
            disco.setTitulo(d[0]);
            disco.setArtista(d[1]);
            disco.setAnio(Integer.parseInt(d[2]));
            disco.setGenero(d[3]);
            disco.setImagenUrl(d[4]);
            ejemplos.add(disco);
        }
        
        return ejemplos;
    }
    
    public void limpiarCache() {
        cacheGlobal.clear();
        idsEnCache.clear();
        System.out.println("🗑️ Caché global limpiada");
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
        
        if (tituloLimpio.isEmpty() || artista.isEmpty() || artista.equals("artista desconocido")) {
            return false;
        }
        
        return true;
    }
    
    private String extraerArtista(JsonNode item) {
        // Método 1: Extraer del título (formato "Artista - Título")
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
        
        // Método 2: Array 'artist'
        if (item.has("artist") && item.get("artist").isArray() && item.get("artist").size() > 0) {
            JsonNode primerArtista = item.get("artist").get(0);
            if (primerArtista.isTextual()) {
                return primerArtista.asText();
            } else if (primerArtista.has("name")) {
                return primerArtista.get("name").asText();
            }
        }
        
        // Método 3: Array 'artists'
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
        // 1. cover_image
        if (item.has("cover_image") && !item.get("cover_image").isNull()) {
            String img = item.get("cover_image").asText();
            if (img != null && !img.isEmpty() && !img.equals("https://img.discogs.com/") && !img.equals("https://st.discogs.com/images/blank.png")) {
                return img;
            }
        }
        
        // 2. thumb
        if (item.has("thumb") && !item.get("thumb").isNull()) {
            String img = item.get("thumb").asText();
            if (img != null && !img.isEmpty() && !img.equals("https://st.discogs.com/images/blank.png")) {
                return img;
            }
        }
        
        // 3. images array
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
        
        // 4. master images
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
                    // Silencioso
                }
            }
        }
        
        return "";
    }

    public Disco obtenerDetalleDisco(String discogsId) {
        try {
            String respuesta = discogsClient.obtenerDetalleDisco(discogsId);
            JsonNode root = objectMapper.readTree(respuesta);
            
            Disco disco = new Disco();
            disco.setTitulo(root.has("title") ? root.get("title").asText() : "Sin título");
            disco.setArtista(extraerArtistasDetalle(root));
            disco.setAnio(root.has("year") ? root.get("year").asInt() : 0);
            disco.setGenero(extraerGenerosDetalle(root));
            disco.setImagenUrl(extraerImagenDetalle(root));
            
            return disco;
        } catch (Exception e) {
            System.err.println("Error al obtener detalle: " + e.getMessage());
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

    public Disco convertirADisco(JsonNode root, String discogsId) {
        Disco disco = new Disco();
        disco.setTitulo(root.has("title") ? root.get("title").asText() : "Sin título");
        disco.setArtista(extraerArtistasDetalle(root));
        disco.setAnio(root.has("year") ? root.get("year").asInt() : 0);
        disco.setGenero(extraerGenerosDetalle(root));
        disco.setImagenUrl(extraerImagenDetalle(root));
        disco.setDiscogsId(discogsId);
        return disco;
    }
    
    public Disco obtenerDetalleDiscoEntity(String discogsId) {
        try {
            String respuesta = discogsClient.obtenerDetalleDisco(discogsId);
            JsonNode root = objectMapper.readTree(respuesta);
            return convertirADisco(root, discogsId);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            return null;
        }
    }
}