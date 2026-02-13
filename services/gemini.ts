
import { GoogleGenAI, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateConceptDescription = async (songTitle: string, stageDesign: string, visualCues: string[]) => {
  const ai = getAI();
  const prompt = `
    I am Harvey, the AI Creative Director for a Broadway musical about Ultrasound Physics.
    The song is titled "${songTitle}".
    Stage Design: ${stageDesign}
    Visual Cues: ${visualCues.join(', ')}

    Describe a high-fidelity, stunning visual storyboard frame for this scene. 
    Focus on lighting, textures, and how the physics concepts (like waves, reflection, or cavitation) are being artistically represented on stage.
    
    CRITICAL: At the end of your note, include a specialized study MNEMONIC or a catchy PHYSICS SCRIPT tip that helps students remember the core concept of this song.
    
    Keep it theatrical and awe-inspiring. Start with "Director's Note:".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });
    return response.text || "Directorial vision currently unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The director is currently busy backstage. Please try again.";
  }
};

export const generateConceptImage = async (songTitle: string, stageDesign: string) => {
  const ai = getAI();
  const prompt = `A breathtaking Broadway stage production concept for a musical about ultrasound physics. 
  Song: ${songTitle}. 
  Description: ${stageDesign}. 
  Dramatic theatrical lighting, neon physics formulas floating in air, high-tech aesthetic, epic scale, cinematic photography.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image Generation Error:", error);
  }
  return null;
};

export const generateDailyInsight = async () => {
  const ai = getAI();
  const prompt = "As Harvey, the AI Lead for SPI Physics Musical, give me a single, fascinating, and high-energy physics insight or 'Production Tip' about ultrasound (e.g. impedance, attenuation, or bioeffects) that would inspire a theater crew. Keep it to 2 sentences max.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Remember: Frequency is the heart of the show.";
  } catch (error) {
    return "The show must go on—physics never sleeps!";
  }
};

export const generateNarrativeAudio = async (text: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Perform this script with a sophisticated Broadway narrator's tone: ${text}` }] }],
      config: {
        responseModalalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Charon' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const analyzeAudioContent = async (base64Audio: string, mimeType: string, songTitle: string) => {
  const ai = getAI();
  const prompt = `
    I am providing a master track recording for the song "${songTitle}" from the SPI Physics Musical.
    As Harvey, the AI Creative Director, listen to this track and provide a brief, high-energy "Directorial Critique".
    Comment on the energy, how it fits the ultrasound physics theme, and give one specific piece of advice for the performers.
    Keep it theatrical and encouraging.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Audio, mimeType } },
          { text: prompt }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Audio Analysis Error:", error);
    return "The audio console is glitching. I couldn't hear the track clearly, but keep up the energy!";
  }
};
