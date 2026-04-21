package com.vinilos.vinilos.external;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class DiscogsClient {
    
    private final WebClient webClient;
    
    public DiscogsClient() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.discogs.com")
                .defaultHeader("User-Agent", "VinilosApp/1.0")
                .build();
    }
    
    public String buscarDiscos(String query) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/database/search")
                .queryParam("q", query)
                .queryParam("type", "release")
                .build())
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }
}