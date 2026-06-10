interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export const useSpeechToText = () => {
  const startListening = async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    return new Promise<string>((resolve, reject) => {
      let interimTranscript = "";

      recognition.onstart = () => {
        console.log("Listening...");
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            resolve(transcript);
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.onend = () => {
        console.log("Stopped listening");
      };

      recognition.start();
    });
  };

  return { startListening };
};

// Mock audio synthesis (replace with actual TTS service)
export const generateAudioResponse = async (_text: string): Promise<string> => {
  // This would integrate with a TTS service like Google Cloud TTS, Azure Speech, or similar
  // For now, returning a mock URL
  return new URL("data:audio/wav;base64,").toString();
};

// Simulate Prof. Ada's response
export const generateProfResponse = async (
  _message: string,
  contextMode: string,
) => {
  // This would call your backend API
  // For now, returning a mock response
  const responses: Record<string, string> = {
    "topic-discovery":
      "That's an interesting research direction! Let me guide you through the process of narrowing down your topic. Consider these key aspects...",
    "research-guidance":
      "For your research methodology, I recommend exploring these peer-reviewed sources and approaches that align with your project scope.",
    "chapter-review":
      "I've reviewed your chapter. Your argumentation is solid, but let's enhance clarity in a few sections. I've highlighted specific areas.",
    "slide-review":
      "Your slides have great visual flow! However, let's ensure each slide has a single, clear message. Let me suggest some refinements.",
  };

  return responses[contextMode] || "How can I help you today?";
};
