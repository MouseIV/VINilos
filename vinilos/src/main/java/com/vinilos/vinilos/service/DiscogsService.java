package com.vinilos.vinilos.service;

import java.util.ArrayList;
import java.util.List;

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
    
    public DiscogsService(DiscogsClient discogsClient) {
        this.discogsClient = discogsClient;
        this.objectMapper = new ObjectMapper();
    }
    
    public List<Disco> buscarDiscos(String query) {
        try {
            String respuesta = discogsClient.buscarDiscos(query);
            
            if (respuesta == null || respuesta.isEmpty()) {
                return new ArrayList<>();
            }
            
            JsonNode root = objectMapper.readTree(respuesta);
            JsonNode results = root.get("results");
            
            if (results == null || !results.isArray()) {
                return new ArrayList<>();
            }
            
            List<Disco> discos = new ArrayList<>();
            
            for (JsonNode item : results) {
                Disco disco = new Disco();
                disco.setTitulo(item.has("title") ? item.get("title").asText() : "Sin título");
                disco.setArtista(extraerArtista(item));
                disco.setAnio(extraerAnio(item));
                disco.setGenero(extraerGenero(item));
                disco.setImagenUrl(item.has("cover_image") ? item.get("cover_image").asText() : "");
                discos.add(disco);
            }
            return discos;
            
        } catch (JsonProcessingException e) {
            System.err.println("Error al procesar JSON de Discogs: " + e.getMessage());
            return new ArrayList<>();
            
        } catch (Exception e) {
            System.err.println("Error inesperado al buscar discos: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    private String extraerArtista(JsonNode item) {
        if (item.has("artist") && !item.get("artist").isEmpty()) {
            return item.get("artist").get(0).asText();
        }
        return "Artista desconocido";
    }
    
    private Integer extraerAnio(JsonNode item) {
        if (item.has("year") && !item.get("year").isNull()) {
            return item.get("year").asInt();
        }
        return 0;
    }
    
    private String extraerGenero(JsonNode item) {
        if (item.has("genre") && !item.get("genre").isEmpty()) {
            return item.get("genre").get(0).asText();
        }
        return "Sin género";
    }
}