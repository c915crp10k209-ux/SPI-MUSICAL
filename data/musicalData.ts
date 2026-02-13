
import { Musical, MusicalID } from '../types';

export const MUSICALS: Record<MusicalID, Musical> = {
  [MusicalID.FUNDAMENTALS]: {
    title: "Musical 1: The Fundamentals",
    subtitle: "Visual Spectacular Edition",
    acts: [
      {
        title: "ACT I: THE FUNDAMENTALS",
        songs: [
          {
            id: "m1-s1",
            act: "ACT I",
            title: "Waves",
            style: "Pop ballad style, think Ed Sheeran meets physics",
            stageDesign: "Intimate coffee house setting transforms into cosmic wave display. Acoustic guitar on stool center stage. Background: Giant oscilloscope showing real-time waveforms.",
            lyrics: [
              "Twenty hertz to twenty thousand, that's the sound we hear",
              "But ultrasound goes higher, above what meets the ear",
              "Two million hertz and greater, that's where we begin",
              "Mechanical vibrations traveling within",
              "Chorus: It's compression, rarefaction, molecules that dance",
              "Longitudinal motion, not left to random chance",
              "Speed equals frequency times wavelength, that's the way",
              "Fifteen-forty meters per second in soft tissue every day!"
            ],
            visualCues: [
              "Frequency meter rises from 20 Hz to 20 kHz in lights",
              "Meter breaks through 20 kHz barrier, ceiling lights activate",
              "2 MHz blazes in golden letters",
              "Dancers emerge as molecules, gently swaying",
              "Dancers squeeze together, then spread apart in waves",
              "c = f × λ appears in lights",
              "Giant '1540 m/s' appears with tissue backdrop"
            ]
          },
          {
            id: "m1-s2",
            act: "ACT I",
            title: "Attenuation Situation",
            style: "Upbeat dance-pop, Bruno Mars energy",
            stageDesign: "Mirror ball that dims gradually. Light meter showing intensity decreasing. Dancers with LED suits that fade with depth.",
            lyrics: [
              "Every centimeter that we penetrate",
              "We lose our intensity at a predictable rate",
              "Point-five dB per centimeter megahertz they say",
              "That's the attenuation coefficient way!",
              "Chorus: Absorption, reflection, scattering too",
              "These are the ways we lose our amplitude, ooh",
              "Higher frequency means more attenuation pain",
              "But better resolution is what we gain!"
            ],
            visualCues: [
              "High-energy 'Penetration' choreography: Dancers enter in glowing cyan LED suits",
              "Dynamic Attenuation Cascade: As dancers march across the stage, their suits fade from blinding white to dim indigo (100% to 10% brightness) to simulate depth losses",
              "Floating Holographic Math: Neon '0.5 dB/cm/MHz' pulses in rhythm with the kick drum",
              "Cinematic Exponential Decay Graph: A floor-to-ceiling LED backdrop plotting Intensity vs. Depth in real-time as the dancers move deeper",
              "Trio of Mismatch: 'The Absorbers' (Flowing deep red), 'The Reflectors' (Mirror-ball silver), and 'The Scatterers' (Erratic white strobes)",
              "High-Frequency Soloist: A performer in violet LEDs who vanishes almost instantly after crossing the stage center to demonstrate depth-limitation",
              "Resolution Shift: Backdrop transforms from a pixelated blur into a 4K crisp ultrasound image as frequency rises, despite the fading light"
            ]
          }
        ]
      },
      {
        title: "ACT II: THE TRANSDUCER CHRONICLES",
        songs: [
          {
            id: "m1-s3",
            act: "ACT II",
            title: "Piezoelectric Dreams",
            style: "Indie-electronic, MGMT vibes",
            stageDesign: "Crystal formations that pulse with voltage. Tesla coils creating visible electricity. Dancers in crystalline costumes.",
            lyrics: [
              "Lead zirconate titanate, PZT for short",
              "Crystals that convert the energy, of every sort",
              "Voltage makes them vibrate, pressure makes them sing",
              "That's the piezoelectric thing!",
              "Chorus: Transmit receive, transmit receive",
              "Point-one percent duty cycle, would you believe?",
              "Listening ninety-nine percent of the time",
              "Building up our image, line by line!"
            ],
            visualCues: [
              "UV lights revealing crystal patterns",
              "Crystal prop vibrates and lights up",
              "Voltage applied, crystals dance",
              "Strobe effect synchronized with transmit/receive",
              "Pie chart shows 0.1% lit, 99.9% dark",
              "Massive ear prop appears listening",
              "Ultrasound image builds progressively"
            ]
          },
          {
            id: "m1-s4",
            act: "ACT II",
            title: "Focus on Me",
            style: "R&B slow jam style",
            stageDesign: "Single spotlight that narrows to focal point. Fog machine creating visible beam path. Contemporary dancers showing beam convergence.",
            lyrics: [
              "In the near field, Fresnel zone, intensity varies wild",
              "But at the focal point, baby, that's where beams get styled",
              "Natural focus distance equals D squared over 4λ",
              "Best lateral resolution lives at this location!",
              "Chorus: The beam is widest at the transducer face",
              "Narrows at the focus - that special place",
              "Then diverges in the far field, Fraunhofer zone",
              "Lateral resolution deteriorates as we've grown"
            ],
            visualCues: [
              "Sensual choreography with light beams",
              "All beams converge to single bright point",
              "Formula appears in cursive lights",
              "Dancers create beam shape with ribbons",
              "Wide formation at start, converges to point",
              "Spreads wide again in far field",
              "Dynamic focusing demonstration"
            ]
          }
        ]
      },
      {
        title: "ACT III: DOPPLER'S DANCE",
        songs: [
          {
            id: "m1-s5",
            act: "ACT III",
            title: "Shift Happens",
            style: "High-energy EDM/Pop fusion",
            stageDesign: "Ambulance with siren for Doppler demo. Red and blue laser effects. Motion-activated lighting.",
            lyrics: [
              "When sound bounces off a moving target, here's what we find",
              "The frequency shifts higher when it's coming toward our kind",
              "And lower when receding, that's the Doppler effect",
              "Two shifts for ultrasound - that's what we detect!",
              "Chorus: Doppler shift equals 2 × f-transmitted × velocity × cos θ",
              "All divided by propagation speed, don't forget-a!"
            ],
            visualCues: [
              "Train sound effect with visual",
              "Ball bouncing between moving platforms",
              "Pitch rises, blue shift in lights",
              "Pitch drops, red shift in lights",
              "Double shift visualization",
              "Formula builds piece by piece in lights",
              "Angle demonstration with laser"
            ]
          }
        ]
      },
      {
        title: "ACT IV: ARTIFACTS & OPTIMIZATION",
        songs: [
          {
            id: "m1-s6",
            act: "ACT IV",
            title: "Artifact Rap Battle",
            style: "Hip-hop battle style, Hamilton-inspired",
            stageDesign: "Four platforms for each artifact. Crowd sections with team colors. DJ booth with ultrasound console.",
            lyrics: [
              "Yo, I'm reverberation, bouncing back and forth",
              "Between parallel reflectors, messing up your course",
              "I'm acoustic shadowing, darkness is my game",
              "Behind bones and stones, attenuation's my claim to fame",
              "But I'm enhancement, the opposite effect",
              "Behind fluid structures, more intensity I project!",
              "Mirror image in the house, across strong interfaces",
              "Duplicating structures in all the wrong places"
            ],
            visualCues: [
              "Metallic costume for Reverberation",
              "Black costume for Shadowing",
              "Glowing costume for Enhancement",
              "Symmetrical twin costume for Mirror Image",
              "Comet tail projection",
              "Cyst prop with bright posterior",
              "Energy sprays off-axis for Side Lobes"
            ]
          }
        ]
      }
    ]
  },
  [MusicalID.ELECTRIC_BOOGALOO]: {
    title: "Musical 2: Electric Boogaloo",
    subtitle: "Advanced Wave Mechanics & Future Tech",
    acts: [
      {
        title: "ACT I: ADVANCED WAVE MECHANICS",
        songs: [
          {
            id: "m2-s1",
            act: "ACT I",
            title: "Interference Pattern",
            style: "Synth-wave, The Weeknd meets Daft Punk",
            stageDesign: "Neon grid floor like Tron. Laser arrays creating interference patterns. Dancers in LED strips showing wave addition.",
            lyrics: [
              "Constructive, destructive, waves colliding in space",
              "When phases align, amplitude doubles in place",
              "But when they're opposed, cancellation appears",
              "This is how we create our focused fields, my dear",
              "Chorus: In phase! (Addition!) Out of phase! (Subtraction!)",
              "Superposition principle in action!"
            ],
            visualCues: [
              "Pulsing synth bass, fog machines",
              "Two wave sets meet, creating patterns",
              "Waves combine, brightness doubles",
              "Waves cancel, darkness forms",
              "Focused beam forms from array",
              "Beam sweeps without moving (Electronic steering)"
            ]
          },
          {
            id: "m2-s2",
            act: "ACT I",
            title: "The Impedance Mismatch Tango",
            style: "Latin jazz fusion, sexy and sophisticated",
            stageDesign: "Dance floor with impedance values as tiles. Tango dancers representing different tissues. Mirror walls showing reflections.",
            lyrics: [
              "When acoustic impedance doesn't match, my love",
              "Reflection coefficient rises high above",
              "Z2 minus Z1, divided by their sum",
              "That's the formula making reflections come",
              "Chorus: At soft tissue-air interface - 99% reflects!",
              "At soft tissue-bone - 40% of effects!"
            ],
            visualCues: [
              "Sultry tango music begins",
              "Dancers in different colored costumes meet",
              "(Z₂-Z₁)/(Z₂+Z₁) appears elegantly",
              "Mathematical tango choreography",
              "Gel dancer enters between partners",
              "Impedance values: Air 0.0004, Gel 1.5!"
            ]
          }
        ]
      },
      {
        title: "ACT IV: FLOW DYNAMICS",
        songs: [
          {
            id: "m2-s8",
            act: "ACT IV",
            title: "Reynolds Number Rhapsody",
            style: "Progressive rock opera, Bohemian Rhapsody style",
            stageDesign: "Multi-level set with orchestra. Costume changes for each movement. Flow visualization tank on stage.",
            lyrics: [
              "Mama... just learned about flow",
              "Reynolds number tells us so",
              "Under 2000's laminar",
              "Over 4000's turbulent by far...",
              "Movement 2: Density! Velocity! Diameter!",
              "Divided by viscosity parameter!"
            ],
            visualCues: [
              "Piano ballad, single spot",
              "Smooth flow lines (Laminar)",
              "Chaotic swirls (Turbulent)",
              "Full choir for movement 2",
              "Spectral broadening visualization",
              "Stenosis sites with acceleration"
            ]
          }
        ]
      },
      {
        title: "ACT V: EMERGENCY PROTOCOLS",
        songs: [
          {
            id: "m2-s10",
            act: "ACT V",
            title: "Cavitation Situation",
            style: "Heavy metal, Metallica style",
            stageDesign: "Industrial scaffolding. Pyrotechnics and sparks. Bubble machines with strobes.",
            lyrics: [
              "Stable... transient... COLLAPSE!",
              "Microbubbles oscillating in the field",
              "Stable cavitation, they don't yield!",
              "But transient cavitation's the threat",
              "Violent collapse we won't forget!",
              "Chorus: MECHANICAL INDEX! Keep it controlled!"
            ],
            visualCues: [
              "Ominous guitar riff",
              "Bubbles vibrate (Stable)",
              "Violent collapse visual (Transient)",
              "Explosion effect",
              "MI meter shown",
              "Safe zone green (<0.3), Danger zone red (>1.9)"
            ]
          }
        ]
      }
    ]
  }
};
