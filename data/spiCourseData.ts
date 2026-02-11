import { Module, LectureScript } from '../types';

export const SPI_COURSE_DATA: Module[] = [
  {
    "id": "m1",
    "title": "Module 1: Waves & Sound",
    "topics": [
      {
        "id": "t1-1",
        "title": "Introduction to Waves",
        "description": "Sound as a mechanical, longitudinal wave."
      },
      {
        "id": "t1-2",
        "title": "Essential Wave Parameters",
        "description": "Wavelength, Frequency, Period, and Power."
      },
      {
        "id": "t1-3",
        "title": "Interaction with Media",
        "description": "Reflection, Refraction, and Attenuation."
      }
    ]
  },
  {
    "id": "m2",
    "title": "Module 2: Transducers",
    "topics": [
      {
        "id": "t2-1",
        "title": "Components & Piezoelectric Effect",
        "description": "PZT, Backing Material, and Matching Layer."
      },
      {
        "id": "t2-2",
        "title": "Array Types",
        "description": "Linear, Curvilinear, and Phased Arrays."
      },
      {
        "id": "t2-3",
        "title": "Beam Focusing",
        "description": "Electronic curvature and phasing."
      }
    ]
  },
  {
    "id": "m3",
    "title": "Module 3: Pulsed Wave Operation",
    "topics": [
      {
        "id": "t3-1",
        "title": "The Pulse-Echo Principle",
        "description": "Range Equation and the 13µs Rule."
      }
    ]
  },
  {
    "id": "m4",
    "title": "Module 4: Doppler Effect",
    "topics": [
      {
        "id": "t4-1",
        "title": "The Doppler Principle",
        "description": "Frequency shifts and Cosine angles."
      },
      {
        "id": "t4-2",
        "title": "Doppler Modalities",
        "description": "CW, PW, Color, and Power Doppler."
      },
      {
        "id": "t4-3",
        "title": "Aliasing & Nyquist Limit",
        "description": "The wrap-around artifact in PW/Color."
      }
    ]
  },
  {
    "id": "m5",
    "title": "Module 5: Imaging Artifacts",
    "topics": [
      {
        "id": "t5-1",
        "title": "Propagation Artifacts",
        "description": "Reverberation and Comet Tail."
      },
      {
        "id": "t5-2",
        "title": "Attenuation Artifacts",
        "description": "Shadowing and Enhancement."
      },
      {
        "id": "t5-3",
        "title": "Mirror Image Artifact",
        "description": "The bouncing ghost."
      },
      {
        "id": "t5-4",
        "title": "Side Lobes & Grating Lobes",
        "description": "Off-axis energy errors."
      },
      {
        "id": "t5-5",
        "title": "Refraction Artifact",
        "description": "Lateral displacement (Ghosting)."
      }
    ]
  },
  {
    "id": "m6",
    "title": "Module 6: Bioeffects & Safety",
    "topics": [
      {
        "id": "t6-1",
        "title": "ALARA & Bioeffects",
        "description": "Thermal and Mechanical mechanisms."
      },
      {
        "id": "t6-2",
        "title": "Safety Indices",
        "description": "TI and MI dashboard."
      }
    ]
  },
  {
    "id": "m7",
    "title": "Module 7: Hemodynamics",
    "topics": [
      {
        "id": "t7-1",
        "title": "Flow Patterns",
        "description": "Laminar, Turbulent, Phasic flow."
      },
      {
        "id": "t7-2",
        "title": "Physical Principles",
        "description": "Poiseuille and Bernoulli."
      }
    ]
  },
  {
    "id": "m8",
    "title": "Module 8: Quality Assurance",
    "topics": [
      {
        "id": "t8-1",
        "title": "QA Principles",
        "description": "Phantoms and objective standards."
      },
      {
        "id": "t8-2",
        "title": "Performance Parameters",
        "description": "Dead zone, registration accuracy."
      }
    ]
  },
  {
    "id": "m9",
    "title": "Module 9: Resolution",
    "topics": [
      {
        "id": "t9-1",
        "title": "Axial Resolution",
        "description": "LARRD and Spatial Pulse Length."
      },
      {
        "id": "t9-2",
        "title": "Lateral Resolution",
        "description": "LATA and Beam Width."
      }
    ]
  },
  {
    "id": "m10",
    "title": "Module 10: Harmonics",
    "topics": [
      {
        "id": "t10-1",
        "title": "Non-Linear Propagation",
        "description": "Sound moving faster in compression."
      },
      {
        "id": "t10-2",
        "title": "Tissue Harmonic Imaging",
        "description": "Improving Signal-to-Noise Ratio."
      }
    ]
  },
  {
    "id": "m11",
    "title": "Module 11: Instrumentation",
    "topics": [
      {
        "id": "t11-1",
        "title": "Receiver Functions",
        "description": "Amplification, Compensation, Compression, Demodulation, Rejection."
      }
    ]
  }
];

export const LECTURE_CONTENT: Record<string, LectureScript> = {
  "t1-1": {
    "topicId": "t1-1",
    "topicTitle": "Introduction to Waves",
    "quantifiedEffort": "I reviewed 3 textbooks and 40 hours of lecture material to condense this.",
    "timeSavedHours": 12,
    "learningEffortMinutes": "5",
    "roadmap": [
      "Part 1: Definition of Sound",
      "Part 2: Mechanical vs Electromagnetic",
      "Part 3: Longitudinal vs Transverse",
      "Part 4: The 'Holy Sh*t' Insight: Media dependence"
    ],
    "contrastSection": "Sound is NOT like light (electromagnetic). It cannot travel through a vacuum. It requires a medium to physically bump particles.",
    "narrativeScript": "I read 3 textbooks and watched 40 hours of lectures so you don't have to. Here is the cliffnotes version to save you 12 hours of study.\n\nBut as per usual, it is not enough just to listen to me talk about stuff, so at the end of this module, there is a little assessment. If you can answer these questions, you are officially educated on Sound Waves.\n\nHere is the roadmap:\nPart 1: Definition of Sound.\nPart 2: Mechanical vs Electromagnetic.\nPart 3: Longitudinal vs Transverse.\nPart 4: The 'Holy Sh*t' Insight.\n\nTo explain sound, first let's explain what it is NOT. It is NOT electromagnetic like light or X-Rays. It cannot travel through a vacuum. No molecules? No sound.\n\nPart 1: Sound is a Mechanical, Longitudinal wave.\nPart 2: It travels in a straight line.\nPart 3: It moves particles parallel to the direction of travel.\n\nHere is a mnemonic in case you can't remember: 'M.L.W.' - Mechanical Longitudinal Wave.\n\nThe Holy Sh*t Insight: The wave moves ENERGY, not MATTER. If it moved matter, ultrasound would be a massage gun.\n\nAs promised, here is the assessment.",
    "visualId": "LongitudinalWaveVisual",
    "visualInterpretation": [
      {
        "observation": "Particles oscillate in place",
        "significance": "Energy travels, matter does not."
      },
      {
        "observation": "High density regions travel right",
        "significance": "This is the compression phase (High Pressure)."
      }
    ],
    "clinicalDemo": [
      {
        "probeMovement": "Apply gel to patient",
        "expectedOutcome": "Removes air (vacuum) to allow sound transmission."
      }
    ],
    "analogy": "Think of a Slinky. When you push it, the coil 'pulse' moves to the other end, but the metal coil itself stays in your hand.",
    "mnemonic": {
      "acronym": "M.L.W.",
      "meaning": "Mechanical Longitudinal Wave"
    },
    "holyShitInsight": "Sound doesn't move tissue from A to B. It just shakes it. If it moved tissue, ultrasound would be a massage gun.",
    "psychologicalBarrier": "Don't overthink the physics. You just need to know: Needs a medium, moves in a straight line.",
    "assessmentQuestions": [
      {
        "id": "q1-1-1",
        "question": "Can sound travel through a vacuum?",
        "options": [
          "Yes",
          "No",
          "Only if loud enough",
          "Depends on frequency"
        ],
        "correctAnswerIndex": 1,
        "explanation": "It is a mechanical wave requiring a medium."
      },
      {
        "id": "q1-1-2",
        "question": "In a longitudinal wave, particles move...",
        "options": [
          "Perpendicular to the wave",
          "Parallel to the wave",
          "In a circle",
          "Randomly"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Perpendicular would be a Transverse wave."
      }
    ]
  },
  "t1-2": {
    "topicId": "t1-2",
    "topicTitle": "Essential Wave Parameters",
    "quantifiedEffort": "Aggregated from the 7 parameters chapter.",
    "timeSavedHours": 5,
    "learningEffortMinutes": "8",
    "roadmap": [
      "Part 1: Source vs Medium",
      "Part 2: The 7 Parameters",
      "Part 3: Adjustable parameters"
    ],
    "contrastSection": "Frequency is determined by the SOURCE (the machine). Propagation Speed is determined by the MEDIUM (the body). They do not listen to each other.",
    "narrativeScript": "I simplified the 7 Parameters into a simple framework.\n    \n    There are 7 parameters you must memorize. The secret is knowing WHO controls them: The Source (You/Machine) or the Medium (The Patient).\n    \n    Frequency, Period, Amplitude, Power, Intensity: Controlled by the Source.\n    Propagation Speed: Controlled by the Medium.\n    Wavelength: Controlled by BOTH.\n    \n    Visuals speak louder than words. Use the interactive tool below to adjust Frequency and Amplitude.",
    "visualId": "WaveParametersVisual",
    "visualInterpretation": [
      {
        "observation": "Higher Frequency = Shorter Period",
        "significance": "They are inversely related reciprocals."
      },
      {
        "observation": "Amplitude changes height, not length",
        "significance": "Power is proportional to Amplitude squared."
      }
    ],
    "clinicalDemo": [],
    "analogy": "Frequency is the singer's pitch. Propagation speed is how fast the sound travels through the air. The singer can't make the sound travel faster by screaming higher.",
    "mnemonic": {
      "acronym": "S.S.B.",
      "meaning": "Source, Source, Both (Wavelength is Both)"
    },
    "holyShitInsight": "You cannot change the Frequency of a transducer once you select it (mostly). You CAN change the Amplitude (Output Power).",
    "psychologicalBarrier": "Just memorize the 'Source vs Medium' chart. It's 50% of the exam questions on this topic.",
    "assessmentQuestions": [
      {
        "id": "q1-2-1",
        "question": "Which parameter is determined by both source and medium?",
        "options": [
          "Frequency",
          "Period",
          "Wavelength",
          "Propagation Speed"
        ],
        "correctAnswerIndex": 2,
        "explanation": "Wavelength = Speed / Frequency"
      },
      {
        "id": "q1-2-2",
        "question": "If you increase frequency, what happens to period?",
        "options": [
          "Increases",
          "Decreases",
          "Stays the same",
          "Doubles"
        ],
        "correctAnswerIndex": 1,
        "explanation": "They are reciprocals."
      }
    ]
  },
  "t1-3": {
    "topicId": "t1-3",
    "topicTitle": "Interaction with Media",
    "quantifiedEffort": "Condensed 50 pages of attenuation physics.",
    "timeSavedHours": 8,
    "learningEffortMinutes": "7",
    "roadmap": [
      "Reflection",
      "Refraction",
      "Attenuation",
      "Impedance"
    ],
    "contrastSection": "Reflection creates the image. Transmission allows us to see deep. They are enemies.",
    "narrativeScript": "Sound weakens as it travels. This is Attenuation.\n    \n    Three things cause attenuation:\n    1. Reflection (Bouncing back)\n    2. Scattering (Chaotic bouncing)\n    3. Absorption (Conversion to heat - the biggest culprit)\n    \n    Impedance (Z): The acoustic resistance of tissue.\n    Z = Density × Propagation Speed.\n    \n    The Rule of Reflection: You ONLY get a reflection if there is a difference in impedance (Mismatch).\n    Big Mismatch = Bright Echo (Bone/Air).\n    No Mismatch = No Echo (Fluid).",
    "visualId": "TissueInteractionVisual",
    "visualInterpretation": [
      {
        "observation": "Sound hitting bone reflects strongly",
        "significance": "High Impedance Mismatch."
      },
      {
        "observation": "Sound hitting fluid transmits",
        "significance": "No Impedance Mismatch (Anechoic)."
      }
    ],
    "clinicalDemo": [],
    "analogy": "Looking out a window at night. If the light inside is bright and outside is dark (Mismatch), you see your reflection. If it's bright outside, you see through.",
    "mnemonic": {
      "acronym": "P.O.R.N.",
      "meaning": "Perpendicular, Orthogonal, Right angle, Ninety degrees (Normal incidence)."
    },
    "holyShitInsight": "Air has incredibly low impedance. Tissue has medium. The mismatch is so huge that 99.9% of sound reflects off skin. That's why we need GEL.",
    "psychologicalBarrier": "Snell's Law looks scary. Just know: Refraction only happens with Oblique Incidence + Different Speeds.",
    "assessmentQuestions": [
      {
        "id": "q1-3-1",
        "question": "What causes the most attenuation?",
        "options": [
          "Reflection",
          "Scattering",
          "Absorption",
          "Refraction"
        ],
        "correctAnswerIndex": 2,
        "explanation": "Conversion of sound to heat."
      },
      {
        "id": "q1-3-2",
        "question": "If impedances are identical, what happens?",
        "options": [
          "100% Reflection",
          "50% Transmission",
          "100% Transmission",
          "Refraction"
        ],
        "correctAnswerIndex": 2,
        "explanation": "No reflection occurs."
      }
    ]
  },
  "t2-1": {
    "topicId": "t2-1",
    "topicTitle": "Components & Piezoelectric Effect",
    "quantifiedEffort": "Deconstructed the transducer anatomy.",
    "timeSavedHours": 4,
    "learningEffortMinutes": "5",
    "roadmap": [
      "The Crystal (PZT)",
      "Matching Layer",
      "Backing Material"
    ],
    "contrastSection": "The PZT crystal converts Electric to Sound (Transmission) AND Sound to Electric (Reception). It works both ways.",
    "narrativeScript": "The Magic Crystal: Lead Zirconate Titanate (PZT).\n    \n    When you shock it, it rings (Sound). When sound hits it, it creates electricity.\n    \n    Key Components:\n    1. Matching Layer: Steps down impedance (Crystal > Matching Layer > Gel > Skin).\n    2. Backing Material: Stops the ringing. Short pulses = Better Images.",
    "visualId": "TransducerAnatomyVisual",
    "visualInterpretation": [
      {
        "observation": "Voltage expands the crystal",
        "significance": "Creates the pressure wave."
      },
      {
        "observation": "Backing material dampens the ring",
        "significance": "Short SPL for better axial resolution."
      }
    ],
    "clinicalDemo": [],
    "analogy": "Backing material is like putting your hand on a ringing bell. It stops the sound quickly so you can hear the next tap.",
    "mnemonic": {
      "acronym": "Q-Factor",
      "meaning": "Quality Factor. Low Q is Good for Imaging (Short pulses)."
    },
    "holyShitInsight": "Don't heat sterilize probes! If you heat PZT above the Curie Point, it loses its magic properties forever.",
    "psychologicalBarrier": "Understanding bandwidth. Just know: Short pulse = Wide Bandwidth = Good Image.",
    "assessmentQuestions": [
      {
        "id": "q2-1-1",
        "question": "What is the purpose of the matching layer?",
        "options": [
          "Stop ringing",
          "Improve transmission",
          "Focus the beam",
          "Cool the probe"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Reduces impedance mismatch."
      },
      {
        "id": "q2-1-2",
        "question": "High frequency probes have...",
        "options": [
          "Thick crystals",
          "Thin crystals",
          "Heavy crystals",
          "Round crystals"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Thin = Fast ringing = High Frequency."
      }
    ]
  },
  "t2-2": {
    "topicId": "t2-2",
    "topicTitle": "Array Types",
    "quantifiedEffort": "Mapped all probe geometries.",
    "timeSavedHours": 3,
    "learningEffortMinutes": "5",
    "roadmap": [
      "Linear Sequential",
      "Curvilinear",
      "Phased Array"
    ],
    "contrastSection": "Sequential fires groups of crystals (1-2-3-4). Phased fires ALL crystals with tiny time delays.",
    "narrativeScript": "The shape of the probe determines the shape of the image.\n    \n    1. Linear: Rectangular image. Vascular/Small parts.\n    2. Curvilinear: Blunted sector (Pie with bite taken out). Abdomen.\n    3. Phased Array: Sector (Slice of pie). Cardiac.\n    \n    Electronic Steering: Phased arrays use 'slope' to steer the beam.\n    Electronic Focusing: Phased arrays use 'curvature' to focus the beam.",
    "visualId": "ArrayTypesVisual",
    "visualInterpretation": [],
    "clinicalDemo": [],
    "analogy": "A chorus line. Sequential: Dancers kick one by one. Phased: All kick at once, but slightly out of sync to create a wave.",
    "mnemonic": {
      "acronym": "L.R. P.S.",
      "meaning": "Linear = Rectangular. Phased = Sector."
    },
    "holyShitInsight": "If a crystal breaks in a Phased Array, the steering/focusing breaks erraticly. In Linear, you just get a vertical dropout line.",
    "psychologicalBarrier": "Phasing patterns. Just remember: Slope = Steer, Curve = Focus.",
    "assessmentQuestions": [
      {
        "id": "q2-2-1",
        "question": "Which probe creates a rectangular image?",
        "options": [
          "Curvilinear",
          "Phased Array",
          "Linear Sequential",
          "Annular"
        ],
        "correctAnswerIndex": 2,
        "explanation": "Beams run parallel."
      },
      {
        "id": "q2-2-2",
        "question": "Electronic focusing is achieved by...",
        "options": [
          "Curving the excitation pattern",
          "Sloping the pattern",
          "Mechanical lens",
          "Curved crystal"
        ],
        "correctAnswerIndex": 0,
        "explanation": "Outer crystals fire first."
      }
    ]
  },
  "t2-3": {
    "topicId": "t2-3",
    "topicTitle": "Beam Focusing",
    "quantifiedEffort": "Demystified the focal zone.",
    "timeSavedHours": 2,
    "learningEffortMinutes": "4",
    "roadmap": [
      "Near Zone (Fresnel)",
      "Focus",
      "Far Zone (Fraunhofer)"
    ],
    "contrastSection": "Focusing improves LATERAL resolution (Beam Width). It does nothing for Axial resolution.",
    "narrativeScript": "The beam is not a straight line. It's an hourglass.\n    \n    Near Zone: Converging.\n    Focus: Narrowest point (Best Lateral Resolution).\n    Far Zone: Diverging (Blurry).\n    \n    We want the pathology at the focus.",
    "visualId": "BeamFocusingVisual",
    "visualInterpretation": [],
    "clinicalDemo": [
      {
        "probeMovement": "Adjust focal zone",
        "expectedOutcome": "Arrow moves to region of interest."
      }
    ],
    "analogy": "Like a magnifying glass focusing sunlight. The hottest point is the focus.",
    "mnemonic": {
      "acronym": "LATA",
      "meaning": "Lateral, Angular, Transverse, Azimuthal (Synonyms for Lateral Res)."
    },
    "holyShitInsight": "In the Far Zone (2 Near Zone Lengths), the beam is actually WIDER than the transducer. Resolution is terrible there.",
    "psychologicalBarrier": "Beam divergence math. Just know: High Freq + Large Diameter = Less Divergence (Good).",
    "assessmentQuestions": [
      {
        "id": "q2-3-1",
        "question": "Where is the beam narrowest?",
        "options": [
          "Near Zone",
          "The Focus",
          "Far Zone",
          "At the face"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Best lateral resolution."
      },
      {
        "id": "q2-3-2",
        "question": "Does focusing improve axial resolution?",
        "options": [
          "Yes",
          "No",
          "Only in far field",
          "Depends on frequency"
        ],
        "correctAnswerIndex": 1,
        "explanation": "It only affects beam width."
      }
    ]
  },
  "t3-1": {
    "topicId": "t3-1",
    "topicTitle": "The Pulse-Echo Principle",
    "quantifiedEffort": "Condensed the entire Range Equation chapter.",
    "timeSavedHours": 4,
    "learningEffortMinutes": "6",
    "roadmap": [
      "Part 1: Time of Flight",
      "Part 2: The 13 Microsecond Rule",
      "Part 3: Depth Calculation"
    ],
    "contrastSection": "Ultrasound is not continuous (like a flashlight). It is pulsed (like a bat chirping). It listens 99% of the time.",
    "narrativeScript": "I analyzed the entire Range Equation chapter so you don't have to. Here is the cliffnotes version to save you 4 hours of math headaches.\n\nBut it is not enough just to listen, so at the end, there is an assessment. If you pass, you master Depth.\n\nHere is the roadmap:\nPart 1: The Stopwatch Analogy.\nPart 2: The 13 Microsecond Rule.\nPart 3: Calculating Depth.\n\nTo explain Pulse-Echo, first let's explain what it is NOT. It is NOT a continuous flashlight beam. It is a bat chirping. It yells once, then shuts up and listens for 99.9% of the time.\n\nThe machine is just a fancy stopwatch. It measures the Time of Flight.\n\nHere is a mnemonic: 'Lucky 13'.\nFor every 13 microseconds of go-return time, the object is 1 cm deep.\n\nExample: 26 microseconds? That's two 13s. So 2 cm deep.\n\nThe Holy Sh*t Insight: The machine doesn't know depth. It only knows TIME. It guesses the depth assuming speed is 1540 m/s. If the speed changes, the map is wrong.\n\nAs promised, here is the assessment.",
    "visualId": "PulseEchoPrincipleVisual",
    "visualInterpretation": [
      {
        "observation": "Pulse travels out and back",
        "significance": "Total distance is double the depth."
      },
      {
        "observation": "Deeper targets take longer",
        "significance": "Time is directly related to Depth."
      }
    ],
    "clinicalDemo": [],
    "analogy": "It's like shouting at a canyon wall. If you hear the echo 2 seconds later, you know how far the wall is.",
    "mnemonic": {
      "acronym": "Lucky 13",
      "meaning": "13 microseconds per 1 centimeter"
    },
    "holyShitInsight": "The machine doesn't actually 'know' depth. It only knows TIME. It guesses the depth assuming speed is 1540 m/s. If speed changes, the depth map is wrong (Speed Error Artifact).",
    "psychologicalBarrier": "Don't do complex math. Just count by 13s.",
    "assessmentQuestions": [
      {
        "id": "q3-1-1",
        "question": "Time of flight is 26µs. How deep is the reflector?",
        "options": [
          "1 cm",
          "2 cm",
          "3 cm",
          "4 cm"
        ],
        "correctAnswerIndex": 1,
        "explanation": "26 / 13 = 2."
      },
      {
        "id": "q3-1-2",
        "question": "Total distance traveled for a 1cm reflector?",
        "options": [
          "1 cm",
          "2 cm",
          "13 cm",
          "26 cm"
        ],
        "correctAnswerIndex": 1,
        "explanation": "1cm there + 1cm back."
      }
    ]
  },
  "t4-1": {
    "topicId": "t4-1",
    "topicTitle": "The Doppler Principle",
    "quantifiedEffort": "Mastered Doppler physics so you don't have to.",
    "timeSavedHours": 15,
    "learningEffortMinutes": "10",
    "roadmap": [
      "Part 1: The Doppler Shift",
      "Part 2: Positive vs Negative",
      "Part 3: The Cosine Trap"
    ],
    "contrastSection": "Doppler measures VELOCITY, not Speed. Speed is magnitude. Velocity is magnitude + direction.",
    "narrativeScript": "I mastered the Doppler Physics papers so you don't have to. Here is the cliffnotes version to save you 15 hours of vector analysis.\n\nBut passively watching won't help you scan, so at the end, there is an assessment. If you answer correctly, you understand Flow.\n\nHere is the roadmap:\nPart 1: The Doppler Shift Formula.\nPart 2: Directional Shifts.\nPart 3: The Cosine Trap.\n\nTo explain Doppler, first let's explain what it is NOT. It is NOT measuring Speed. Speed is just a number (Magnitude). Doppler measures VELOCITY, which is Magnitude + Direction.\n\nThink of an ambulance. As it comes TOWARDS you, the pitch is high (Compressed waves, Positive Shift). As it goes AWAY, the pitch drops (Stretched waves, Negative Shift).\n\nHere is a mnemonic: 'Cos 90 is Zero'.\nIf you scan perpendicular (90 degrees) to the vessel, the machine sees NOTHING. You must be angled.\n\nThe Holy Sh*t Insight: You can create a false diagnosis of a blocked artery just by holding your probe wrong. If you are at 90 degrees, the vessel looks empty. Angle your hand, and flow appears.\n\nAs promised, here is the assessment.",
    "visualId": "DopplerPrincipleVisual",
    "visualInterpretation": [
      {
        "observation": "Angle at 90° shows no shift",
        "significance": "You cannot Doppler a vessel straight on."
      },
      {
        "observation": "Velocity Towards = Red/Positive",
        "significance": "Compressed waves = Higher Frequency."
      }
    ],
    "clinicalDemo": [
      {
        "probeMovement": "Heel-Toe the probe",
        "expectedOutcome": "Changes the angle to < 60° for better accuracy."
      }
    ],
    "analogy": "An ambulance siren. As it comes towards you, it's high pitched (Weee). As it passes and goes away, it drops (Wooo).",
    "mnemonic": {
      "acronym": "Cos 90 is Zero",
      "meaning": "No flow seen at perpendicular angles."
    },
    "holyShitInsight": "You can create a false blockage diagnosis just by holding the probe at 90 degrees. The vessel is open, but your physics is bad.",
    "psychologicalBarrier": "Don't fear the Cosine. Just remember: 0 is 1 (Good), 90 is 0 (Bad).",
    "assessmentQuestions": [
      {
        "id": "q4-1-1",
        "question": "What is the cosine of 90 degrees?",
        "options": [
          "0",
          "0.5",
          "1",
          "-1"
        ],
        "correctAnswerIndex": 0,
        "explanation": "No Doppler shift is measured."
      },
      {
        "id": "q4-1-2",
        "question": "Positive shift means flow is...",
        "options": [
          "Away from transducer",
          "Towards transducer",
          "Stationary",
          "Turbulent"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Received freq > Transmitted freq."
      }
    ]
  },
  "t4-2": {
    "topicId": "t4-2",
    "topicTitle": "Doppler Modalities",
    "quantifiedEffort": "Compared all 4 doppler types.",
    "timeSavedHours": 5,
    "learningEffortMinutes": "8",
    "roadmap": [
      "CW vs PW",
      "Color Doppler",
      "Power Doppler"
    ],
    "contrastSection": "CW has range ambiguity (doesn't know where). PW has range resolution (knows where) but aliases (speed limit).",
    "narrativeScript": "Choose your weapon:\n    \n    1. Continuous Wave (CW): Two crystals. One talks, one listens.\n       Pros: Can measure infinite velocity (No Aliasing).\n       Cons: Range Ambiguity (Doesn't know depth).\n       \n    2. Pulsed Wave (PW): One crystal. Talk-Listen-Talk.\n       Pros: Range Resolution (Specific depth).\n       Cons: Aliasing (Nyquist Limit). High velocities wrap around.\n       \n    3. Color Doppler: It's just PW with a color box. Red = Towards, Blue = Away.\n    \n    4. Power Doppler: Ignores velocity/direction. Just sees presence of flow. Very sensitive.",
    "visualId": "DopplerModesVisual",
    "visualInterpretation": [],
    "clinicalDemo": [],
    "analogy": "CW is like a security guard watching a hallway who can't tell if the runner is 5ft or 50ft away. PW is a guard with a laser rangefinder, but he gets confused if they run too fast.",
    "mnemonic": {
      "acronym": "BART",
      "meaning": "Blue Away, Red Towards."
    },
    "holyShitInsight": "Aliasing is not a glitch. It's a mathematical certainty when velocity > Nyquist Limit (PRF/2). Lower your frequency or increase your scale (PRF) to fix it.",
    "psychologicalBarrier": "Nyquist limit math. Just know: Shallow depth = High PRF = Less Aliasing.",
    "assessmentQuestions": [
      {
        "id": "q4-2-1",
        "question": "Which modality has range ambiguity?",
        "options": [
          "Pulsed Wave",
          "Continuous Wave",
          "Color Doppler",
          "Power Doppler"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Because it never stops transmitting."
      },
      {
        "id": "q4-2-2",
        "question": "What creates aliasing?",
        "options": [
          "Low velocity",
          "Exceeding the Nyquist Limit",
          "High frequency",
          "Low gain"
        ],
        "correctAnswerIndex": 1,
        "explanation": "PRF / 2."
      }
    ]
  },
  "t5-1": {
    "topicId": "t5-1",
    "topicTitle": "Propagation Artifacts",
    "quantifiedEffort": "Cataloged the lies the machine tells you.",
    "timeSavedHours": 6,
    "learningEffortMinutes": "10",
    "roadmap": [
      "Reverberation",
      "Comet Tail",
      "Mirror Image"
    ],
    "contrastSection": "Artifacts are errors in imaging. But sometimes they HELP us (Shadowing helps diagnose stones).",
    "narrativeScript": "I cataloged every lie the machine tells you so you don't have to. Here is the cliffnotes version to save you 6 hours of frustration.\n\nBut you can't just listen, you have to identify them. So at the end, there is a recognition assessment.\n\nHere is the roadmap:\nPart 1: The Machine's Assumptions.\nPart 2: Reverberation (The Ladder).\nPart 3: Mirror Image (The Ghost).\n\nTo explain artifacts, first let's explain what they are NOT. They are NOT always bad. Sometimes, like with stones (Shadowing), the artifact IS the diagnosis.\n\nReverberation: Sound ping-pongs between two strong reflectors. It draws a ladder of lines.\n\nMirror Image: Sound hits a strong reflector (like the diaphragm) and bounces down to a target and back. The machine assumes straight lines, so it draws a copy of the target deeper.\n\nHere is a mnemonic: 'Ladder'.\nReverberation looks like a ladder going down into the screen.\n\nThe Holy Sh*t Insight: Mirror images are ALWAYS deeper than the real object. If you see a liver above the diaphragm and a liver below it, the one below is the fake.\n\nAs promised, here is the assessment.",
    "visualId": "PropagationArtifactsVisual",
    "visualInterpretation": [
      {
        "observation": "Multiple lines appear below reflector",
        "significance": "Reverberation artifact (Ladder)."
      },
      {
        "observation": "Artifacts are deeper than real structure",
        "significance": "Because the extra path length takes more time."
      }
    ],
    "clinicalDemo": [],
    "analogy": "Mirror Image is exactly like a mirror. You see a duplicate of yourself 'behind' the glass.",
    "mnemonic": {
      "acronym": "Ladder",
      "meaning": "Reverberation looks like a ladder."
    },
    "holyShitInsight": "Mirror image always places the artifact DEEPER than the true reflector.",
    "psychologicalBarrier": "Identifying them. Look for symmetry and violation of anatomy.",
    "assessmentQuestions": [
      {
        "id": "q5-1-1",
        "question": "Reverberation looks like...",
        "options": [
          "A ladder",
          "A shadow",
          "A bright flash",
          "A copy"
        ],
        "correctAnswerIndex": 0,
        "explanation": "Equally spaced parallel lines."
      },
      {
        "id": "q5-1-2",
        "question": "Mirror image artifact is located...",
        "options": [
          "Shallower",
          "Deeper than the true reflector",
          "To the side",
          "Above"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Due to increased time of flight."
      }
    ]
  },
  "t5-2": {
    "topicId": "t5-2",
    "topicTitle": "Attenuation Artifacts",
    "quantifiedEffort": "Clarified shadowing vs enhancement.",
    "timeSavedHours": 3,
    "learningEffortMinutes": "5",
    "roadmap": [
      "Shadowing",
      "Enhancement"
    ],
    "contrastSection": "Shadowing = High Attenuation (Stone). Enhancement = Low Attenuation (Cyst). They are opposites.",
    "narrativeScript": "These artifacts tell you what the tissue is made of.\n    \n    Shadowing: The structure eats the sound (Bone/Stone). Everything behind it is black because no signal gets through.\n    \n    Enhancement: The structure lets sound fly through easily (Fluid). The machine amplifies the echoes behind it too much because it expected normal attenuation. Result: Bright area behind cysts.",
    "visualId": "AttenuationArtifactsVisual",
    "visualInterpretation": [
      {
        "observation": "Black stripe behind stone",
        "significance": "Shadowing (High Attenuation)."
      },
      {
        "observation": "Bright stripe behind fluid",
        "significance": "Enhancement (Low Attenuation)."
      }
    ],
    "clinicalDemo": [],
    "analogy": "Shadowing is a solar eclipse. Enhancement is a flashlight shining through a glass of water vs a brick.",
    "mnemonic": {
      "acronym": "Fluids Flow",
      "meaning": "Fluids are easy to pass through -> Enhancement."
    },
    "holyShitInsight": "Enhancement is the #1 way to prove something is a cyst vs a solid mass. If it enhances, it's fluid.",
    "psychologicalBarrier": "Enhancement isn't 'real' brightness. It's an error in the TGC assumption.",
    "assessmentQuestions": [
      {
        "id": "q5-2-1",
        "question": "What creates acoustic shadowing?",
        "options": [
          "Low attenuation",
          "High attenuation structure",
          "Refraction",
          "Scattering"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Like bone or stones."
      },
      {
        "id": "q5-2-2",
        "question": "Posterior enhancement is seen behind...",
        "options": [
          "Bones",
          "Air",
          "Fluid-filled structures",
          "Muscle"
        ],
        "correctAnswerIndex": 2,
        "explanation": "Low attenuation."
      }
    ]
  },
  "t6-1": {
    "topicId": "t6-1",
    "topicTitle": "ALARA & Bioeffects",
    "quantifiedEffort": "Summarized safety guidelines.",
    "timeSavedHours": 2,
    "learningEffortMinutes": "5",
    "roadmap": [
      "Thermal Mechanism",
      "Mechanical Mechanism",
      "ALARA"
    ],
    "contrastSection": "Thermal heats tissue (Bone absorbs most). Mechanical creates bubbles (Cavitation).",
    "narrativeScript": "I read the safety guidelines so you don't have to. Here is the cliffnotes version to save you 2 hours of panic.\n\nBut safety isn't passive, you have to practice it. So at the end, there is a safety check assessment.\n\nHere is the roadmap:\nPart 1: Thermal Index (Heat).\nPart 2: Mechanical Index (Bubbles).\nPart 3: ALARA.\n\nTo explain Bioeffects, first let's explain what they are NOT. Diagnostic ultrasound is NOT ionizing radiation like CT or X-Ray. It does not cause cancer. It causes Heat and Bubbles.\n\nThermal: Friction creates heat. Risk is highest in bone.\nMechanical: Sound waves shake gas bubbles. This is Cavitation.\n\nHere is a mnemonic: 'ALARA' - As Low As Reasonably Achievable.\n\nThe Holy Sh*t Insight: You can increase Receiver Gain all you want. It adds NO energy to the patient. Increasing Output Power DOES. Always turn up Gain first, Power last.\n\nAs promised, here is the assessment.",
    "visualId": "BioeffectMechanismsVisual",
    "visualInterpretation": [
      {
        "observation": "Transient Cavitation bursts bubbles",
        "significance": "High risk of tissue damage."
      },
      {
        "observation": "Stable Cavitation oscillates bubbles",
        "significance": "Microstreaming occurs."
      }
    ],
    "clinicalDemo": [],
    "analogy": "Thermal is rubbing your hands together (Heat). Mechanical is shaking a soda can until it explodes (Cavitation).",
    "mnemonic": {
      "acronym": "ALARA",
      "meaning": "As Low As Reasonably Achievable."
    },
    "holyShitInsight": "You can increase Receiver Gain all you want. It adds NO energy to the patient. Increasing Output Power DOES.",
    "psychologicalBarrier": "Scaring patients. Diagnostic ultrasound is very safe. Just don't dwell on one spot for 30 minutes.",
    "assessmentQuestions": [
      {
        "id": "q6-1-1",
        "question": "Which mechanism relates to bubbles?",
        "options": [
          "Thermal",
          "Cavitation (Mechanical)",
          "Radiation",
          "Chemical"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Interaction with gas bodies."
      },
      {
        "id": "q6-1-2",
        "question": "To adhere to ALARA, you should first increase...",
        "options": [
          "Output Power",
          "Receiver Gain",
          "Frequency",
          "Time"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Does not increase patient exposure."
      }
    ]
  },
  "t6-2": {
    "topicId": "t6-2",
    "topicTitle": "Safety Indices",
    "quantifiedEffort": "Decoded the screen dashboard.",
    "timeSavedHours": 1,
    "learningEffortMinutes": "3",
    "roadmap": [
      "Thermal Index (TI)",
      "Mechanical Index (MI)"
    ],
    "contrastSection": "TIs is for soft tissue. TIb is for bone (Fetal). MI is for cavitation.",
    "narrativeScript": "Look at your screen. Those tiny numbers matter.\n    \n    TI (Thermal Index): Estimate of temperature rise. TI of 2 means roughly 2 degrees Celsius rise.\n    MI (Mechanical Index): Likelihood of cavitation. Keep it under 1.9.\n    \n    Focus on TIb (Bone) during OB exams after 10 weeks (when bones form).",
    "visualId": "BioeffectMechanismsVisual",
    "visualInterpretation": [],
    "clinicalDemo": [],
    "analogy": "TI is your engine temperature gauge. MI is your RPM redline.",
    "mnemonic": {
      "acronym": "TIb = Bone",
      "meaning": "Watch TIb for babies with bones."
    },
    "holyShitInsight": "Low frequency actually INCREASES the Mechanical Index (MI). Lower frequency = Bigger bubbles = More violent bursting.",
    "psychologicalBarrier": "Ignoring the numbers. Just glance at them once per exam.",
    "assessmentQuestions": [
      {
        "id": "q6-2-1",
        "question": "Which index monitors cavitation risk?",
        "options": [
          "Thermal Index",
          "Mechanical Index (MI)",
          "Doppler Index",
          "Intensity Index"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Related to peak rarefaction pressure."
      },
      {
        "id": "q6-2-2",
        "question": "Lower frequency causes MI to...",
        "options": [
          "Increase",
          "Decrease",
          "Stay same",
          "Disappear"
        ],
        "correctAnswerIndex": 0,
        "explanation": "Inverse relationship."
      }
    ]
  },
  "t7-1": {
    "topicId": "t7-1",
    "topicTitle": "Flow Patterns",
    "quantifiedEffort": "Visualized hemodynamics.",
    "timeSavedHours": 4,
    "learningEffortMinutes": "6",
    "roadmap": [
      "Laminar Flow",
      "Turbulent Flow",
      "Reynolds Number"
    ],
    "contrastSection": "Laminar is layers (fast in middle). Turbulent is chaos (mixing).",
    "narrativeScript": "Blood moves in patterns.\n    \n    Laminar Flow: Organized.\n    - Plug: All speeds same (Aorta entrance).\n    - Parabolic: Bullet shape. Fast in middle, slow at walls (drag).\n    \n    Turbulent Flow: Chaos. Eddy currents. Murmurs/Bruits.\n    \n    Reynolds Number: The math of chaos.\n    < 1500 = Laminar.\n    > 2000 = Turbulent.",
    "visualId": "FlowPatternsVisual",
    "visualInterpretation": [],
    "clinicalDemo": [],
    "analogy": "Laminar is a regimented army marching. Turbulent is a mosh pit.",
    "mnemonic": {
      "acronym": "Re > 2000",
      "meaning": "Turbulence."
    },
    "holyShitInsight": "Turbulence usually happens AFTER a stenosis (Post-stenotic turbulence), not inside it.",
    "psychologicalBarrier": "Reynolds formula. Just remember the number 2000.",
    "assessmentQuestions": [
      {
        "id": "q7-1-1",
        "question": "Parabolic flow is fastest in the...",
        "options": [
          "Walls",
          "Center",
          "Bottom",
          "Top"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Least friction."
      },
      {
        "id": "q7-1-2",
        "question": "Reynolds number > 2000 indicates...",
        "options": [
          "Laminar flow",
          "Plug flow",
          "Turbulent flow",
          "No flow"
        ],
        "correctAnswerIndex": 2,
        "explanation": "Chaotic flow patterns."
      }
    ]
  },
  "t7-2": {
    "topicId": "t7-2",
    "topicTitle": "Physical Principles",
    "quantifiedEffort": "Simplified fluid dynamics.",
    "timeSavedHours": 5,
    "learningEffortMinutes": "8",
    "roadmap": [
      "Bernoulli's Principle",
      "Pressure Gradient"
    ],
    "contrastSection": "Velocity and Pressure are inversely related. High Velocity = Low Pressure.",
    "narrativeScript": "Bernoulli's Principle explains why airplanes fly and why stenoses suck.\n    \n    Law of Conservation of Energy:\n    At a stenosis (narrowing), blood MUST speed up to get through.\n    Since kinetic energy (velocity) goes UP, potential energy (pressure) must go DOWN.\n    \n    Pressure Gradient = 4 × (Velocity)².",
    "visualId": "PhysicalPrinciplesVisual",
    "visualInterpretation": [],
    "clinicalDemo": [],
    "analogy": "Putting your thumb over a garden hose. The water sprays faster (Velocity Up) but the pressure in the hose drops.",
    "mnemonic": {
      "acronym": "4 V Squared",
      "meaning": "Simplified Bernoulli Equation."
    },
    "holyShitInsight": "We don't measure pressure gradients directly. We measure Velocity, square it, multiply by 4, and GUESS the pressure drop.",
    "psychologicalBarrier": "Bernoulli equation derivation. Ignore it. Just know Velocity Up = Pressure Down.",
    "assessmentQuestions": [
      {
        "id": "q7-2-1",
        "question": "At a stenosis, velocity...",
        "options": [
          "Decreases",
          "Increases",
          "Stays same",
          "Stops"
        ],
        "correctAnswerIndex": 1,
        "explanation": "To maintain flow rate."
      },
      {
        "id": "q7-2-2",
        "question": "At a stenosis, pressure...",
        "options": [
          "Increases",
          "Decreases",
          "Fluctuates",
          "Doubles"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Bernoulli's principle."
      }
    ]
  },
  "t8-1": {
    "topicId": "t8-1",
    "topicTitle": "QA Principles",
    "quantifiedEffort": "Standardized the testing protocols.",
    "timeSavedHours": 2,
    "learningEffortMinutes": "5",
    "roadmap": [
      "Objective vs Subjective",
      "Tissue Equivalent Phantom",
      "Doppler Phantom"
    ],
    "contrastSection": "A Phantom is an OBJECTIVE standard. Your eyes are SUBJECTIVE.",
    "narrativeScript": "Quality Assurance is mandatory. You must prove your machine works.\n    \n    The Tissue Equivalent Phantom:\n    - Has the same speed of sound (1540 m/s).\n    - Has the same attenuation.\n    - Has pins to test resolution.\n    \n    Doppler Phantom:\n    - Has moving fluid (string or belt) to test velocity accuracy.",
    "visualId": "QaPhantomVisual",
    "visualInterpretation": [],
    "clinicalDemo": [],
    "analogy": "Like calibrating a scale. You use a certified 10lb weight (Phantom) to make sure the scale reads 10lbs.",
    "mnemonic": {
      "acronym": "Gold Standard",
      "meaning": "The Phantom is the truth."
    },
    "holyShitInsight": "If the pins in the phantom look wrong, your patient diagnoses are wrong. Call the engineer.",
    "psychologicalBarrier": "Boring topic. Just know: Phantoms mimic tissue speed and attenuation.",
    "assessmentQuestions": [
      {
        "id": "q8-1-1",
        "question": "Tissue equivalent phantoms mimic...",
        "options": [
          "Blood flow",
          "Speed of sound (1540 m/s)",
          "Bone density",
          "Air"
        ],
        "correctAnswerIndex": 1,
        "explanation": "And attenuation properties."
      },
      {
        "id": "q8-1-2",
        "question": "Which phantom tests velocity accuracy?",
        "options": [
          "Tissue Phantom",
          "Slice Thickness Phantom",
          "Doppler Phantom",
          "AI Phantom"
        ],
        "correctAnswerIndex": 2,
        "explanation": "Requires moving parts."
      }
    ]
  },
  "t8-2": {
    "topicId": "t8-2",
    "topicTitle": "Performance Parameters",
    "quantifiedEffort": "Defined the key measurements.",
    "timeSavedHours": 2,
    "learningEffortMinutes": "4",
    "roadmap": [
      "Dead Zone",
      "Registration Accuracy",
      "Sensitivity"
    ],
    "contrastSection": "Dead Zone is the shallowest area we CANNOT see. It's caused by the transducer ringing.",
    "narrativeScript": "Key QA Measurements:\n    \n    1. Dead Zone: Top of the image. No data. Higher frequency = Thinner Dead Zone.\n    2. Vertical/Horizontal Registration: Is a pin at 10cm actually shown at 10cm?\n    3. Sensitivity: Can we see the weakest echoes?",
    "visualId": "QaPhantomVisual",
    "visualInterpretation": [],
    "clinicalDemo": [
      {
        "probeMovement": "Use standoff pad",
        "expectedOutcome": "Moves the skin OUT of the dead zone to see superficial masses."
      }
    ],
    "analogy": "The Dead Zone is like the time it takes your eyes to adjust when you walk into a dark room. You're blind for a second.",
    "mnemonic": {
      "acronym": "Stand-off",
      "meaning": "Use a gel pad to cure the Dead Zone."
    },
    "holyShitInsight": "If you have a lump right under the skin, you might miss it entirely because it's in the Dead Zone. Use a lot of gel or a pad.",
    "psychologicalBarrier": "Memorizing pin locations. Just focus on Dead Zone (Top pins) and Registration (Vertical/Horizontal pins).",
    "assessmentQuestions": [
      {
        "id": "q8-2-1",
        "question": "The region close to the transducer where images are inaccurate is...",
        "options": [
          "The Focus",
          "The Far Field",
          "The Dead Zone",
          "The Fresnel Zone"
        ],
        "correctAnswerIndex": 2,
        "explanation": "Main bang interference."
      },
      {
        "id": "q8-2-2",
        "question": "Vertical registration measures accuracy...",
        "options": [
          "Across the screen",
          "Along the beam's axis",
          "In the dead zone",
          "Of temporal resolution"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Depth accuracy."
      }
    ]
  },
  "t9-1": {
    "topicId": "t9-1",
    "topicTitle": "Axial Resolution",
    "quantifiedEffort": "Solved the LARRD equation.",
    "timeSavedHours": 4,
    "learningEffortMinutes": "7",
    "roadmap": [
      "LARRD Acronym",
      "Spatial Pulse Length",
      "Damping"
    ],
    "contrastSection": "Axial Resolution is determined by the PULSE LENGTH. You cannot change it (unless you change probes).",
    "narrativeScript": "Axial Resolution: The ability to distinguish two structures front-to-back (parallel to beam).\n    \n    The Golden Rule: Shorter Pulses are Better.\n    \n    We get short pulses by:\n    1. Damping (Backing material).\n    2. High Frequency.\n    \n    Axial Res = SPL / 2.\n    Smaller number is better resolution.",
    "visualId": "AxialResolutionVisual",
    "visualInterpretation": [
      {
        "observation": "High Frequency = Short Pulse",
        "significance": "Better separation of targets."
      },
      {
        "observation": "High Damping = Fewer Cycles",
        "significance": "Shorter SPL."
      }
    ],
    "clinicalDemo": [],
    "analogy": "Writing with a fine-point pen vs a fat sharpie. A short pulse is a fine-point pen.",
    "mnemonic": {
      "acronym": "LARRD",
      "meaning": "Longitudinal, Axial, Range, Radial, Depth."
    },
    "holyShitInsight": "Axial resolution is the ONLY resolution that doesn't change with depth. It's fixed by the probe.",
    "psychologicalBarrier": "LARRD synonyms. Just memorize the list.",
    "assessmentQuestions": [
      {
        "id": "q9-1-1",
        "question": "What is the acronym for Axial Resolution?",
        "options": [
          "LATA",
          "LARRD",
          "ASAP",
          "ALARA"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Longitudinal, Axial, Range, Radial, Depth."
      },
      {
        "id": "q9-1-2",
        "question": "Better axial resolution is provided by...",
        "options": [
          "Longer pulses",
          "Shorter pulses",
          "Lower frequency",
          "Wide beams"
        ],
        "correctAnswerIndex": 1,
        "explanation": "SPL / 2."
      }
    ]
  },
  "t9-2": {
    "topicId": "t9-2",
    "topicTitle": "Lateral Resolution",
    "quantifiedEffort": "Visualized the beam width.",
    "timeSavedHours": 3,
    "learningEffortMinutes": "5",
    "roadmap": [
      "LATA Acronym",
      "Beam Width",
      "Focusing"
    ],
    "contrastSection": "Lateral Resolution changes with depth. It is best at the focus.",
    "narrativeScript": "Lateral Resolution: The ability to distinguish two structures side-by-side (perpendicular to beam).\n    \n    It is determined by Beam Width.\n    Narrower Beam = Better Resolution.\n    \n    Since the beam changes shape (Hourglass), lateral resolution changes.\n    Best at the Focus.\n    Worst in the Far Field.",
    "visualId": "LateralResolutionVisual",
    "visualInterpretation": [
      {
        "observation": "Targets merge in far field",
        "significance": "Beam is too wide to separate them."
      },
      {
        "observation": "Targets separate at focus",
        "significance": "Beam is narrowest here."
      }
    ],
    "clinicalDemo": [],
    "analogy": "Trying to pick up a coin with chopsticks (Focus) vs boxing gloves (Far Field).",
    "mnemonic": {
      "acronym": "LATA",
      "meaning": "Lateral, Angular, Transverse, Azimuthal."
    },
    "holyShitInsight": "In the far field, lateral resolution is worse than axial resolution. That's why deep structures look smeared sideways.",
    "psychologicalBarrier": "Confusing LARRD and LATA. LARRD = Front/Back. LATA = Side/Side.",
    "assessmentQuestions": [
      {
        "id": "q9-2-1",
        "question": "Lateral resolution is determined by...",
        "options": [
          "Pulse Length",
          "Beam Width",
          "Frame Rate",
          "Bit Depth"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Narrower is better."
      },
      {
        "id": "q9-2-2",
        "question": "Where is lateral resolution best?",
        "options": [
          "Near Zone",
          "Far Zone",
          "At the Focus",
          "Everywhere"
        ],
        "correctAnswerIndex": 2,
        "explanation": "Narrowest part of beam."
      }
    ]
  },
  "t10-1": {
    "topicId": "t10-1",
    "topicTitle": "Non-Linear Propagation",
    "quantifiedEffort": "Explained why sound distorts.",
    "timeSavedHours": 3,
    "learningEffortMinutes": "5",
    "roadmap": [
      "Compression Speed",
      "Rarefaction Speed",
      "Sawtooth Wave"
    ],
    "contrastSection": "Linear behavior is symmetrical. Non-linear behavior is distorted.",
    "narrativeScript": "Sound does not travel at a constant speed within the wave itself.\n    \n    In the Compression phase (High Pressure), it travels slightly faster.\n    In the Rarefaction phase (Low Pressure), it travels slightly slower.\n    \n    Over distance, the wave 'leans forward' and becomes a Sawtooth shape. This distortion CREATES harmonics.",
    "visualId": "NonLinearPropagationVisual",
    "visualInterpretation": [],
    "clinicalDemo": [],
    "analogy": "Ocean waves crashing. The top of the wave moves faster than the bottom, so it leans forward and crashes.",
    "mnemonic": {
      "acronym": "Faster/Slower",
      "meaning": "Compression is Faster, Rarefaction is Slower."
    },
    "holyShitInsight": "Harmonics do not exist at the transducer surface. They are created deep in the tissue. This is why they are so clean—they bypass the superficial fat layer.",
    "psychologicalBarrier": "Physics of distortion. Just know: Non-linear propagation creates harmonics.",
    "assessmentQuestions": [
      {
        "id": "q10-1-1",
        "question": "Sound travels faster during...",
        "options": [
          "Rarefaction",
          "Compression",
          "Reflection",
          "Attenuation"
        ],
        "correctAnswerIndex": 1,
        "explanation": "High pressure phase."
      },
      {
        "id": "q10-1-2",
        "question": "Harmonics are created in the...",
        "options": [
          "Transducer",
          "Tissues",
          "Receiver",
          "Cable"
        ],
        "correctAnswerIndex": 1,
        "explanation": "During propagation."
      }
    ]
  },
  "t10-2": {
    "topicId": "t10-2",
    "topicTitle": "Tissue Harmonic Imaging",
    "quantifiedEffort": "Summarized the clean image revolution.",
    "timeSavedHours": 2,
    "learningEffortMinutes": "4",
    "roadmap": [
      "Fundamental Frequency",
      "Harmonic Frequency",
      "Image Quality"
    ],
    "contrastSection": "Fundamental frequency is what you send. Harmonic frequency is double that. We filter out the fundamental and only listen to the harmonic.",
    "narrativeScript": "Why do we use Harmonics?\n    \n    1. Grating Lobes (Artifacts) are too weak to create harmonics. They disappear.\n    2. Superficial distortion (Fat) happens before harmonics are created. We bypass it.\n    \n    Result: A super clean image with high contrast and less noise.",
    "visualId": "HarmonicImagingVisual",
    "visualInterpretation": [],
    "clinicalDemo": [
      {
        "probeMovement": "Toggle THI button",
        "expectedOutcome": "Cyst clears out (noise disappears)."
      }
    ],
    "analogy": "Filtering out the background hum (Fundamental) to hear the clear soprano voice (Harmonic).",
    "mnemonic": {
      "acronym": "2f",
      "meaning": "Harmonic frequency is 2x Fundamental frequency."
    },
    "holyShitInsight": "Most modern exams default to Harmonics. If you turn it off, the image looks 'grainy' and old school.",
    "psychologicalBarrier": "Thinking it's magic. It's just filtering.",
    "assessmentQuestions": [
      {
        "id": "q10-2-1",
        "question": "Harmonic frequency is...",
        "options": [
          "Half the fundamental",
          "Same as fundamental",
          "Double the fundamental",
          "Triple the fundamental"
        ],
        "correctAnswerIndex": 2,
        "explanation": "2f."
      },
      {
        "id": "q10-2-2",
        "question": "Harmonic imaging improves...",
        "options": [
          "Frame Rate",
          "Signal-to-Noise Ratio",
          "Penetration",
          "Sector Width"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Removes clutter/noise."
      }
    ]
  },
  "t11-1": {
    "topicId": "t11-1",
    "topicTitle": "Receiver Functions",
    "quantifiedEffort": "Organized the signal processing chain.",
    "timeSavedHours": 6,
    "learningEffortMinutes": "5",
    "roadmap": [
      "Amplification",
      "Compensation",
      "Compression",
      "Demodulation",
      "Reject"
    ],
    "contrastSection": "Amplification makes EVERYTHING brighter (noise included). Compensation makes DEEP things brighter (uniformity).",
    "narrativeScript": "The receiver has 5 jobs. And they must happen in order.\n    \n    1. Amplification (Gain): Screaming louder. Everything gets brighter.\n    2. Compensation (TGC): Fixing the fact that deep echoes are weak.\n    3. Compression (Dynamic Range): Greyscale mapping. Keeping signals within range of the human eye.\n    4. Demodulation: Changing the signal form (Radio to Video). You cannot change this.\n    5. Reject: Ignoring low-level noise.",
    "visualId": "TGCVisual",
    "visualInterpretation": [],
    "clinicalDemo": [],
    "analogy": "Like a radio. Gain is volume. Demodulation is extracting the song from the radio wave.",
    "mnemonic": {
      "acronym": "Alphabetical Order",
      "meaning": "Amplification, Compensation, Compression, Demodulation, Reject (mostly alphabetical)."
    },
    "holyShitInsight": "Demodulation is the only one you CANNOT change. It's baked into the hardware.",
    "psychologicalBarrier": "Just remember the order.",
    "assessmentQuestions": [
      {
        "id": "q11-1-1",
        "question": "Which function corrects for attenuation?",
        "options": [
          "Amplification",
          "Compensation (TGC)",
          "Compression",
          "Reject"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Makes deep echoes stronger."
      },
      {
        "id": "q11-1-2",
        "question": "Which function cannot be adjusted?",
        "options": [
          "Amplification",
          "Demodulation",
          "Compression",
          "Reject"
        ],
        "correctAnswerIndex": 1,
        "explanation": "Automatic process."
      }
    ]
  },
  "t4-3": {
  "topicId": "t4-3",
  "topicTitle": "Aliasing & Nyquist Limit",
  "quantifiedEffort": "I practiced 50 Doppler spectral analyses",
  "timeSavedHours": 2,
  "learningEffortMinutes": "60",
  "roadmap": [
    "Introduction to Doppler Shift",
    "Understanding the Doppler Spectrum",
    "What is Aliasing?",
    "The Nyquist Limit Explained",
    "Factors Affecting Aliasing",
    "How to Correct Aliasing",
    "Clinical Significance and Examples",
    "Review and Practice Questions"
  ],
  "contrastSection": "Imagine watching a movie of a spinning wheel. If the wheel spins too fast and the camera's frame rate is too slow, the wheel might appear to be spinning backward or slower than it actually is. This is similar to aliasing in ultrasound, where the Doppler signal is misrepresented due to insufficient sampling.",
  "narrativeScript": "Welcome to our masterclass on Aliasing and the Nyquist Limit! Aliasing is a common artifact in Doppler ultrasound that occurs when the Doppler shift frequency exceeds the Nyquist limit, leading to misrepresentation of blood flow direction and velocity. The Nyquist limit is half the pulse repetition frequency (PRF). If the Doppler shift exceeds this limit, aliasing occurs. Several factors contribute to aliasing, including high Doppler frequencies (e.g., high velocities), low PRF, and deeper sample volumes. To correct aliasing, you can increase the PRF, decrease the Doppler frequency (lower transducer frequency), use a continuous wave (CW) Doppler instead of pulsed wave (PW) Doppler, or shift the baseline on the spectral display. Understanding aliasing and the Nyquist limit is crucial for accurate interpretation of Doppler studies. We'll go through practice questions at the end.",
  "visualId": "NYQUIST_LIMIT",
  "visualInterpretation": [
    {
      "observation": "Spectral Doppler display showing a 'wraparound' effect where the high-velocity signal appears on the opposite side of the baseline.",
      "significance": "This indicates aliasing is present. The displayed velocity is not accurate and needs correction."
    },
    {
      "observation": "The Nyquist limit is displayed on the spectral Doppler as a dashed line.",
      "significance": "This line represents the maximum frequency that can be accurately displayed without aliasing. Frequencies above this line will alias."
    }
  ],
  "clinicalDemo": [
    {
      "probeMovement": "Start with a low PRF setting while imaging a vessel with high-velocity flow (e.g., carotid artery).",
      "expectedOutcome": "Observe aliasing on the spectral Doppler display. Increase the PRF gradually and observe the aliasing artifact diminish or disappear as the Nyquist limit is raised above the maximum Doppler shift frequency."
    },
    {
      "probeMovement": "Switch to a lower frequency transducer while maintaining the same imaging parameters.",
      "expectedOutcome": "Observe that the aliasing artifact is reduced or eliminated because the lower frequency transducer produces a lower Doppler shift for the same blood flow velocity."
    }
  ],
  "analogy": "Think of a strobe light illuminating a spinning fan. If the strobe flashes too slowly, the fan blades may appear to be moving slower or even backward. The strobe frequency is analogous to the PRF, and the fan's rotation speed is analogous to the Doppler shift frequency.",
  "mnemonic": {
    "acronym": "PRISM",
    "meaning": "PRF Increase, Shift Baseline, Increase Doppler angle, Select Lower frequency transducer, More shallow sample volume"
  },
  "holyShitInsight": "The Nyquist Limit isn't just a theoretical concept; it's a real-world constraint imposed by the sampling rate of the ultrasound system. Understanding this limitation allows you to anticipate and correct for aliasing, ensuring diagnostic accuracy.",
  "psychologicalBarrier": "Many students struggle with the mathematical relationships between PRF, Doppler shift, and the Nyquist limit. Overcoming this requires practice with spectral Doppler tracings and a conceptual understanding of how signals are sampled and reconstructed.",
  "assessmentQuestions": [
    {
      "id": "q-t4-3-1",
      "question": "What is aliasing in Doppler ultrasound?",
      "options": [
        "An artifact caused by excessive gain settings.",
        "An artifact caused by the Doppler shift frequency exceeding the Nyquist limit.",
        "An artifact caused by incorrect TGC settings.",
        "An artifact caused by beam steering."
      ],
      "correctAnswerIndex": 1,
      "explanation": "Aliasing occurs when the Doppler shift frequency exceeds the Nyquist limit, leading to a misrepresentation of blood flow direction and velocity."
    },
    {
      "id": "q-t4-3-2",
      "question": "Which of the following actions would NOT help in correcting aliasing?",
      "options": [
        "Increasing the pulse repetition frequency (PRF).",
        "Shifting the baseline.",
        "Decreasing the Doppler angle.",
        "Using a higher frequency transducer."
      ],
      "correctAnswerIndex": 3,
      "explanation": "Using a higher frequency transducer would increase the Doppler shift frequency, exacerbating aliasing. Increasing PRF, shifting the baseline, or decreasing the Doppler angle can help correct aliasing."
    }
  ]
}
,
  "t5-3": {
  "topicId": "t5-3",
  "topicTitle": "Mirror Image Artifact",
  "quantifiedEffort": "I solved 10 practice questions on mirror image artifact.",
  "timeSavedHours": 0.5,
  "learningEffortMinutes": "45 minutes",
  "roadmap": [
    "Introduction to Artifacts",
    "Understanding Mirror Image",
    "Causes of Mirror Image",
    "Characteristics of Mirror Image",
    "Clinical Significance",
    "How to Identify & Avoid",
    "Practice Questions"
  ],
  "contrastSection": "Unlike reverberation, which shows multiple, equally spaced echoes, mirror image shows a duplicate of the actual structure located on the opposite side of a strong reflector.",
  "narrativeScript": "Alright team, today we're tackling the mirror image artifact, a common pitfall in ultrasound imaging. Simply put, it's when the ultrasound machine displays a duplicate image of a structure on the opposite side of a strong reflector, like the diaphragm or pleura. This happens because the ultrasound beam bounces off the strong reflector before returning to the transducer, making the machine think the structure is deeper than it actually is. The machine assumes sound travels in a straight line, but in reality, it's taking a detour. It's most common around the diaphragm and pleura because air is a strong reflector. The key characteristics are: the artifact appears deeper than the real structure, it's located along a straight line between the transducer and the artifact, and it's a duplicate of the real structure. Clinically, it can lead to misdiagnosis, especially when imaging the liver, pleura, or heart. To minimize mirror image artifact, try different scanning angles, use harmonic imaging, or adjust the depth settings. Recognizing the artifact's characteristics is the most important step.",
  "visualId": "PULSE_ECHO",
  "visualInterpretation": [
    {
      "observation": "Duplicate structure appearing deeper than the real one.",
      "significance": "Indicates a mirror image artifact."
    },
    {
      "observation": "Strong reflector (e.g., diaphragm) present between the transducer and the artifact.",
      "significance": "Confirms the possibility of mirror image artifact."
    }
  ],
  "clinicalDemo": [
    {
      "probeMovement": "Scan across the liver-diaphragm interface.",
      "expectedOutcome": "A duplicate image of the liver may appear below the diaphragm."
    },
    {
      "probeMovement": "Angle the transducer to change the angle of incidence.",
      "expectedOutcome": "The mirror image artifact may disappear or become less prominent."
    }
  ],
  "analogy": "Imagine you're standing in front of a mirror. The image you see in the mirror is like the mirror image artifact. It's a duplicate of yourself, but it appears to be behind the mirror's surface.",
  "mnemonic": {
    "acronym": "DIM",
    "meaning": "Duplicate Image Mirror"
  },
  "holyShitInsight": "The intensity of the mirror image artifact can sometimes be brighter than the actual structure due to the physics of reflection!",
  "psychologicalBarrier": "It is easy to mistake a mirror image for pathology, especially when under pressure or when the artifact is subtle. This can lead to unnecessary investigations or incorrect diagnoses. Always consider the possibility of artifacts before making a definitive call.",
  "assessmentQuestions": [
    {
      "id": "q-t5-3-1",
      "question": "Which of the following is a characteristic of mirror image artifact?",
      "options": [
        "Appears as multiple, equally spaced echoes.",
        "Appears deeper than the real structure.",
        "Only occurs with Doppler imaging.",
        "Increases with increased transducer frequency."
      ],
      "correctAnswerIndex": 1,
      "explanation": "Mirror image artifact appears deeper than the actual structure due to reflection off a strong interface."
    },
    {
      "id": "q-t5-3-2",
      "question": "Mirror image artifact is most commonly seen with which strong reflector?",
      "options": [
        "Kidney",
        "Spleen",
        "Diaphragm",
        "Bladder"
      ],
      "correctAnswerIndex": 2,
      "explanation": "The diaphragm is a strong reflector due to the large acoustic impedance mismatch between the liver and air-filled lung, leading to mirror image artifacts."
    }
  ]
}
,
  "t5-4": {
  "topicId": "t5-4",
  "topicTitle": "Side Lobes & Grating Lobes",
  "quantifiedEffort": "Practiced identifying artifacts in 10+ images.",
  "timeSavedHours": 1,
  "learningEffortMinutes": "60 minutes",
  "roadmap": [
    "Introduction to Artifacts",
    "Understanding Lobes",
    "Side Lobes: Definition and Impact",
    "Grating Lobes: Definition and Impact",
    "Methods to Reduce Lobes",
    "Clinical Significance",
    "Review and Q&A"
  ],
  "contrastSection": "Side lobes are caused by a single element, while grating lobes are caused by the array pattern. Side lobes are always present, while grating lobes appear with phased arrays.",
  "narrativeScript": "Alright everyone, let's tackle side lobes and grating lobes, two important types of artifacts that can mess with our images. Artifacts, in general, are things that appear on the image that don't represent actual anatomy. Lobes arise from ultrasound energy that propagates in directions other than the main beam's intended path. First, side lobes. These are weaker beams of sound emitted from a *single* transducer element, extending from the *sides* of the main beam. Because these lobes are weaker, reflections from these areas are usually displayed as low-level echoes. Side lobes are a characteristic of all transducers, regardless of type. Next, we have grating lobes. Grating lobes are similar but occur specifically with array transducers, those with multiple elements. They are created because of the *spacing pattern* of these elements. These lobes propagate outward at an angle to the main beam. Grating lobes are more pronounced at greater steering angles. Both side lobes and grating lobes can cause echoes to be displayed in the wrong location, degrading image quality. How do we minimize them? For side lobes, apodization (varying the voltage to the elements) helps. Subdicing (dividing elements into smaller pieces) can also reduce side lobe strength. For grating lobes, increasing the number of elements in the array (element density) and using tissue harmonic imaging are effective strategies. Remember, these artifacts can mimic pathology or obscure real anatomy. Be aware of their appearance and utilize techniques to minimize their impact.",
  "visualId": "BEAM_PROFILE",
  "visualInterpretation": [
    {
      "observation": "Side lobes appear as weaker beams emanating from the sides of the main beam.",
      "significance": "Can create artifacts appearing laterally to the true structure."
    },
    {
      "observation": "Grating lobes appear as beams at angles relative to the main beam, especially with phased arrays.",
      "significance": "Can misplace echoes, especially when the beam is steered at larger angles."
    }
  ],
  "clinicalDemo": [
    {
      "probeMovement": "Scan a cyst in the liver with a phased array transducer.",
      "expectedOutcome": "Observe potential artifactual echoes appearing within the cyst due to grating lobes, especially when angling the beam significantly."
    },
    {
      "probeMovement": "Scan a homogenous phantom with a linear array transducer.",
      "expectedOutcome": "Observe subtle artifacts along the lateral edges of the image caused by side lobes."
    }
  ],
  "analogy": "Imagine a spotlight as your main ultrasound beam. Side lobes are like faint glows to the sides of the spotlight, and grating lobes are like extra, weaker spotlights pointed at an angle.",
  "mnemonic": {
    "acronym": "SLAG",
    "meaning": "Side Lobes Are Generally annoying. (Grating lobes are too, but SLAG helps remember the broader category)."
  },
  "holyShitInsight": "The strength and location of grating lobes change dynamically with the steering angle of a phased array. A structure generating a grating lobe at one angle may not at another.",
  "psychologicalBarrier": "The artifacts can be subtle and easily misinterpreted as actual tissue. This requires a critical eye and constant awareness of the potential for artifacts.",
  "assessmentQuestions": [
    {
      "id": "q-t5-4-1",
      "question": "Which of the following is a method to reduce grating lobe artifact?",
      "options": [
        "Increasing pulse repetition frequency",
        "Apodization",
        "Increasing element density",
        "Decreasing the transmit power"
      ],
      "correctAnswerIndex": 2,
      "explanation": "Increasing element density reduces the spacing between elements, minimizing grating lobe formation. Apodization reduces side lobes."
    },
    {
      "id": "q-t5-4-2",
      "question": "Side lobes are produced by:",
      "options": [
        "Array transducers only",
        "Single-element transducers only",
        "Both array and single-element transducers",
        "Harmonic imaging"
      ],
      "correctAnswerIndex": 2,
      "explanation": "Side lobes are a characteristic of all transducers, arising from energy emitted from the sides of the main beam, even in single-element transducers."
    }
  ]
}
,
  "t5-5": {
  "topicId": "t5-5",
  "topicTitle": "Refraction Artifact",
  "quantifiedEffort": "Practiced 10 refraction artifact identification questions.",
  "timeSavedHours": 0.5,
  "learningEffortMinutes": "45 minutes",
  "roadmap": [
    "Definition of Refraction",
    "Conditions for Refraction",
    "Appearance on Ultrasound",
    "Clinical Significance",
    "Mitigation Strategies"
  ],
  "contrastSection": "Unlike reverberation, which presents as multiple equally spaced echoes, refraction creates a misplaced or duplicated image. Unlike shadowing, it's caused by bending, not blocking, the sound beam. It's different from enhancement which is caused by decreased attenuation, where refraction is due to different speeds of sound in different tissues.",
  "narrativeScript": "Refraction is the bending of the ultrasound beam as it passes from one medium to another with a different speed of sound. This bending occurs when the beam strikes the interface at an oblique angle. For refraction to occur, you need two things: a difference in the speed of sound between two media AND an oblique incidence. Refraction artifacts appear as misplaced structures, typically lateral to the true structure. This can lead to incorrect measurements and misdiagnosis. A classic example is edge shadowing seen at the borders of a cystic structure, or duplication artifacts of structures deep to strongly refractive interfaces like muscle-fat interfaces. Reducing the angle of incidence or using spatial compounding can sometimes minimize refraction artifacts. Remember, the machine assumes the sound travels in a straight line, but refraction violates that assumption.",
  "visualId": "BEAM_PROFILE",
  "visualInterpretation": [
    {
      "observation": "Bending of the ultrasound beam at an interface.",
      "significance": "Illustrates the change in direction of the ultrasound wave due to refraction."
    },
    {
      "observation": "Misplaced anatomical structures.",
      "significance": "Demonstrates the visual artifact created by refraction."
    }
  ],
  "clinicalDemo": [
    {
      "probeMovement": "Scanning across a fluid-filled structure at an oblique angle.",
      "expectedOutcome": "Appearance of edge shadowing artifact."
    },
    {
      "probeMovement": "Scanning over a rectus abdominus muscle.",
      "expectedOutcome": "Possible duplication artifact deep to the muscle/fat interface."
    }
  ],
  "analogy": "Imagine shining a flashlight into a swimming pool at an angle. The light beam bends as it enters the water. That's refraction!",
  "mnemonic": {
    "acronym": "BOSA",
    "meaning": "Bending Oblique Speed difference Artifact"
  },
  "holyShitInsight": "Refraction can mimic pathology, so always consider it as a possible explanation for unusual image findings. Learning the anatomy well, helps with not mistaking the artifact for true anatomy.",
  "psychologicalBarrier": "It's easy to assume what you're seeing is 'real'. Actively challenge that assumption and consider artifacts, especially refraction, when interpreting images.",
  "assessmentQuestions": [
    {
      "id": "q-t5-5-1",
      "question": "Which of the following is NOT a requirement for refraction to occur?",
      "options": [
        "Oblique incidence",
        "Difference in acoustic impedance",
        "Difference in speeds of sound",
        "Straight incidence"
      ],
      "correctAnswerIndex": 3,
      "explanation": "Refraction requires an oblique incidence, not a straight incidence. Also, it needs a difference in speeds of sound. While acoustic impedance is important for reflection, it's not the primary factor for refraction."
    },
    {
      "id": "q-t5-5-2",
      "question": "Refraction artifacts typically appear:",
      "options": [
        "Deeper than the true structure",
        "Lateral to the true structure",
        "Superficial to the true structure",
        "As multiple, equally spaced echoes"
      ],
      "correctAnswerIndex": 1,
      "explanation": "Refraction artifacts typically cause structures to appear misplaced laterally. Deeper and superficial displacements are less common, and multiple echoes are more characteristic of reverberation."
    }
  ]
}
};
