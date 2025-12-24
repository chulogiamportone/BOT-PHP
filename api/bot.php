<?php

class Chatbot {
    private $intents;

    public function __construct($jsonPath) {
        if (!file_exists($jsonPath)) {
            throw new Exception("Archivo de datos no encontrado.");
        }
        $jsonContent = file_get_contents($jsonPath);
        $data = json_decode($jsonContent, true);
        $this->intents = $data['intents'];
    }

    public function getResponse($userMessage) {
        $userMessage = strtolower(trim($userMessage));
        
        foreach ($this->intents as $intent) {
            // Ignoramos el fallback en el bucle principal
            if ($intent['tag'] === 'fallback') continue;

            foreach ($intent['patterns'] as $pattern) {
                // Búsqueda simple (puede mejorarse con levenshtein o regex)
                if (strpos($userMessage, strtolower($pattern)) !== false) {
                    return $this->getRandomResponse($intent['responses']);
                }
            }
        }

        // Si no hay coincidencia, retornamos fallback
        return $this->getFallbackResponse();
    }

    private function getFallbackResponse() {
        foreach ($this->intents as $intent) {
            if ($intent['tag'] === 'fallback') {
                return $this->getRandomResponse($intent['responses']);
            }
        }
        return "Lo siento, hubo un error.";
    }

    private function getRandomResponse($responses) {
        return $responses[array_rand($responses)];
    }
}
?>