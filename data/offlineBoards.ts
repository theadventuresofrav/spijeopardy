import { GameBoardData } from '../types';

export const OFFLINE_BOARDS: GameBoardData[] = [
  {
    categories: [
      {
        id: "cat-0",
        title: "SOUND BASICS",
        clues: [
          {
            id: "clue-0-0",
            value: 200,
            clueText: "This is defined as the number of cycles that occur in one second.",
            correctAnswer: "Frequency",
            isAnswered: false
          },
          {
            id: "clue-0-1",
            value: 400,
            clueText: "Sound waves require this type of medium to travel, unlike light waves.",
            correctAnswer: "Mechanical (or Medium)",
            isAnswered: false
          },
          {
            id: "clue-0-2",
            value: 600,
            clueText: "As frequency increases, this parameter decreases.",
            correctAnswer: "Period (or Wavelength)",
            isAnswered: false
          },
          {
            id: "clue-0-3",
            value: 800,
            clueText: "This is the only parameter determined by both the source and the medium.",
            correctAnswer: "Wavelength",
            isAnswered: false
          },
          {
            id: "clue-0-4",
            value: 1000,
            clueText: "Infrasound is defined as sound with a frequency less than this value.",
            correctAnswer: "20 Hz",
            isAnswered: false
          }
        ]
      },
      {
        id: "cat-1",
        title: "TRANSDUCERS",
        clues: [
          {
            id: "clue-1-0",
            value: 200,
            clueText: "This component protects the internal components of the transducer from damage.",
            correctAnswer: "Case",
            isAnswered: false
          },
          {
            id: "clue-1-1",
            value: 400,
            clueText: "The matching layer is designed to reduce this between the PZT and the skin.",
            correctAnswer: "Impedance Mismatch",
            isAnswered: false
          },
          {
            id: "clue-1-2",
            value: 600,
            clueText: "The thickness of the PZT crystal is equal to this fraction of the wavelength.",
            correctAnswer: "1/2",
            isAnswered: false
          },
          {
            id: "clue-1-3",
            value: 800,
            clueText: "This material is bonded to the back of the active element to reduce ringing.",
            correctAnswer: "Backing Material (or Damping Material)",
            isAnswered: false
          },
          {
            id: "clue-1-4",
            value: 1000,
            clueText: "The temperature at which PZT is polarized.",
            correctAnswer: "Curie Point",
            isAnswered: false
          }
        ]
      },
      {
        id: "cat-2",
        title: "DOPPLER",
        clues: [
          {
            id: "clue-2-0",
            value: 200,
            clueText: "The Doppler shift is the difference between received frequency and this.",
            correctAnswer: "Transmitted Frequency",
            isAnswered: false
          },
          {
            id: "clue-2-1",
            value: 400,
            clueText: "The optimal angle for Doppler interrogation is this many degrees.",
            correctAnswer: "0 (or 180)",
            isAnswered: false
          },
          {
            id: "clue-2-2",
            value: 600,
            clueText: "Aliasing occurs when the Doppler shift exceeds this limit.",
            correctAnswer: "Nyquist Limit",
            isAnswered: false
          },
          {
            id: "clue-2-3",
            value: 800,
            clueText: "This type of Doppler does not have a Nyquist limit.",
            correctAnswer: "Continuous Wave",
            isAnswered: false
          },
          {
            id: "clue-2-4",
            value: 1000,
            clueText: "This processing technique is used for Color Flow Doppler.",
            correctAnswer: "Autocorrelation",
            isAnswered: false
          }
        ]
      },
      {
        id: "cat-3",
        title: "ARTIFACTS",
        clues: [
          {
            id: "clue-3-0",
            value: 200,
            clueText: "This artifact appears as a hyperechoic region beneath tissues with abnormally low attenuation.",
            correctAnswer: "Enhancement",
            isAnswered: false
          },
          {
            id: "clue-3-1",
            value: 400,
            clueText: "Reverberation artifacts resemble this object.",
            correctAnswer: "Ladder (or Venetian Blind)",
            isAnswered: false
          },
          {
            id: "clue-3-2",
            value: 600,
            clueText: "Shadowing is caused by this wave interaction.",
            correctAnswer: "Attenuation (or Absorption/Reflection)",
            isAnswered: false
          },
          {
            id: "clue-3-3",
            value: 800,
            clueText: "Mirror image artifact is always located deeper than this.",
            correctAnswer: "True Reflector",
            isAnswered: false
          },
          {
            id: "clue-3-4",
            value: 1000,
            clueText: "This artifact is created when a sound pulse changes direction during transmission.",
            correctAnswer: "Refraction",
            isAnswered: false
          }
        ]
      },
      {
        id: "cat-4",
        title: "HEMODYNAMICS",
        clues: [
          {
            id: "clue-4-0",
            value: 200,
            clueText: "This type of flow is characterized by chaotic flow patterns in many different directions.",
            correctAnswer: "Turbulent Flow",
            isAnswered: false
          },
          {
            id: "clue-4-1",
            value: 400,
            clueText: "Reynolds number predicts this.",
            correctAnswer: "Turbulence",
            isAnswered: false
          },
          {
            id: "clue-4-2",
            value: 600,
            clueText: "According to Bernoulli's Principle, where velocity is highest, pressure is this.",
            correctAnswer: "Lowest",
            isAnswered: false
          },
          {
            id: "clue-4-3",
            value: 800,
            clueText: "Phasic flow is associated with this system.",
            correctAnswer: "Venous System",
            isAnswered: false
          },
          {
            id: "clue-4-4",
            value: 1000,
            clueText: "This law describes the relationship between flow, pressure, and resistance.",
            correctAnswer: "Poiseuille's Law",
            isAnswered: false
          }
        ]
      },
      {
        id: "cat-5",
        title: "RESOLUTION",
        clues: [
          {
            id: "clue-5-0",
            value: 200,
            clueText: "Axial resolution is determined by this parameter.",
            correctAnswer: "Spatial Pulse Length",
            isAnswered: false
          },
          {
            id: "clue-5-1",
            value: 400,
            clueText: "Lateral resolution is equal to this.",
            correctAnswer: "Beam Width",
            isAnswered: false
          },
          {
            id: "clue-5-2",
            value: 600,
            clueText: "This type of resolution measures the ability to distinguish two structures parallel to the sound beam.",
            correctAnswer: "Axial Resolution",
            isAnswered: false
          },
          {
            id: "clue-5-3",
            value: 800,
            clueText: "Focusing improves this type of resolution.",
            correctAnswer: "Lateral Resolution",
            isAnswered: false
          },
          {
            id: "clue-5-4",
            value: 1000,
            clueText: "This acronym describes the four synonyms for Axial Resolution.",
            correctAnswer: "LARRD",
            isAnswered: false
          }
        ]
      }
    ]
  }
];
