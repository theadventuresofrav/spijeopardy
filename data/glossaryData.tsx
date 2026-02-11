import React from 'react';
import { 
  LongitudinalWaveVisual, WaveParametersVisual, PulseEchoPrincipleVisual, 
  DopplerPrincipleVisual, TransducerAnatomyVisual, AxialResolutionVisual, 
  LateralResolutionVisual, BioeffectMechanismsVisual, PropagationArtifactsVisual,
  AttenuationArtifactsVisual, TissueInteractionVisual, ArrayTypesVisual,
  BeamFocusingVisual, DopplerModesVisual, DynamicRangeVisual, BModeVisual, DecibelVisual,
  TGCVisual, MModeVisual, PiezoVisual, WaveParametersVisual as WPVisual, PulseEchoPrincipleVisual as PEPVisual
} from '../components/CourseVisuals';

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'Physics' | 'Clinical' | 'Artifacts' | 'Instrumentation';
  visual?: React.ReactNode;
}

export const GLOSSARY_DATA: GlossaryTerm[] = [
  {
    term: "Acoustic Impedance",
    definition: "The resistance to the propagation of sound through a medium. It is the product of density and propagation speed (Z = ρc).",
    category: "Physics",
    visual: <TissueInteractionVisual />
  },
  {
    term: "Aliasing",
    definition: "An artifact occurring in Doppler ultrasound when the frequency shift exceeds the Nyquist limit (1/2 PRF), causing the spectral display to wrap around.",
    category: "Artifacts",
    visual: <DopplerPrincipleVisual />
  },
  {
    term: "Attenuation",
    definition: "The weakening of sound as it propagates through a medium, caused by absorption, reflection, and scattering.",
    category: "Physics",
    visual: <AttenuationArtifactsVisual />
  },
  {
    term: "Axial Resolution",
    definition: "The ability to distinguish two structures that are close to each other front-to-back (parallel to the beam). Determined by Spatial Pulse Length (SPL/2).",
    category: "Physics",
    visual: <AxialResolutionVisual />
  },
  {
    term: "B-Mode (Brightness Mode)",
    definition: "A display mode where the strength of the returned echo is represented by the brightness of a dot on the screen.",
    category: "Instrumentation",
    visual: <BModeVisual />
  },
  {
    term: "Beam Width Artifact",
    definition: "Occurs when a reflector is located outside the main beam but is displayed as if it were within it, often due to side lobes or grating lobes.",
    category: "Artifacts",
    visual: <LateralResolutionVisual />
  },
  {
    term: "Bioeffects",
    definition: "Biological effects on tissue caused by ultrasound exposure, primarily thermal (heating) and mechanical (cavitation) mechanisms.",
    category: "Physics",
    visual: <BioeffectMechanismsVisual />
  },
  {
    term: "Cavitation",
    definition: "The formation and behavior of gas bubbles in a fluid, which can be a bioeffect of high-intensity ultrasound.",
    category: "Physics",
    visual: <BioeffectMechanismsVisual />
  },
  {
    term: "Color Doppler",
    definition: "A technique that estimates the average velocity of flow within a region of interest and displays it in color superimposed on a grayscale image.",
    category: "Instrumentation",
    visual: <DopplerPrincipleVisual />
  },
  {
    term: "Comet Tail Artifact",
    definition: "A form of reverberation artifact where closely spaced echoes create a solid hyperechoic line directed downward.",
    category: "Artifacts",
    visual: <PropagationArtifactsVisual />
  },
  {
    term: "Decibel (dB)",
    definition: "A logarithmic unit used to express the ratio of two values of a physical quantity, often power or intensity.",
    category: "Physics",
    visual: <DecibelVisual />
  },
  {
    term: "Doppler Effect",
    definition: "The change in frequency of a wave in relation to an observer who is moving relative to the wave source.",
    category: "Physics",
    visual: <DopplerPrincipleVisual />
  },
  {
    term: "Duty Factor",
    definition: "The percentage or fraction of time that the system is transmitting a pulse.",
    category: "Physics",
    visual: <PulseEchoPrincipleVisual />
  },
  {
    term: "Dynamic Range",
    definition: "The ratio of the largest to the smallest signal strength that each component of an ultrasound system can handle.",
    category: "Instrumentation",
    visual: <DynamicRangeVisual />
  },
  {
    term: "Enhancement",
    definition: "An artifact where echoes appear brighter behind a weakly attenuating structure (like a cyst).",
    category: "Artifacts",
    visual: <AttenuationArtifactsVisual />
  },
  {
    term: "Frequency",
    definition: "The number of cycles that occur in one second. In ultrasound, typically 2 MHz to 15 MHz.",
    category: "Physics",
    visual: <WPVisual />
  },
  {
    term: "Gain",
    definition: "The amplification of the return signal. Receiver gain does not affect the output power or patient exposure.",
    category: "Instrumentation",
    visual: <BModeVisual />
  },
  {
    term: "Hertz (Hz)",
    definition: "The unit of frequency, equal to one cycle per second.",
    category: "Physics",
    visual: <WaveParametersVisual />
  },
  {
    term: "Hydrophone",
    definition: "A small transducer element used to measure the characteristics of a sound beam, such as pressure, intensity, and period.",
    category: "Instrumentation"
  },
  {
    term: "Lateral Resolution",
    definition: "The ability to distinguish two structures that are side-by-side (perpendicular to the beam). Determined by beam width.",
    category: "Physics",
    visual: <LateralResolutionVisual />
  },
  {
    term: "M-Mode (Motion Mode)",
    definition: "A display mode that shows the changing position of reflectors with respect to time.",
    category: "Instrumentation",
    visual: <MModeVisual />
  },
  {
    term: "Mirror Image Artifact",
    definition: "An artifact created when sound reflects off a strong reflector (like the diaphragm) and is redirected toward a second structure.",
    category: "Artifacts",
    visual: <PropagationArtifactsVisual />
  },
  {
    term: "Nyquist Limit",
    definition: "The highest Doppler frequency or velocity that can be measured without the appearance of aliasing (equal to 1/2 PRF).",
    category: "Physics",
    visual: <DopplerPrincipleVisual />
  },
  {
    term: "Period",
    definition: "The time it takes to complete one single cycle.",
    category: "Physics",
    visual: <WaveParametersVisual />
  },
  {
    term: "Phased Array",
    definition: "A transducer that uses electronic time delays to steer and focus the beam.",
    category: "Instrumentation",
    visual: <ArrayTypesVisual />
  },
  {
    term: "Piezoelectric Effect",
    definition: "The property of certain materials to create a voltage when they are mechanically deformed or to deform when a voltage is applied.",
    category: "Physics",
    visual: <PiezoVisual />
  },
  {
    term: "Power Doppler",
    definition: "A Doppler mode that displays the strength (amplitude) of the Doppler signal rather than the velocity, making it more sensitive to slow flow.",
    category: "Instrumentation",
    visual: <DopplerPrincipleVisual />
  },
  {
    term: "Pulse Duration",
    definition: "The actual time from the start of a pulse to the end of that pulse. Determined by sound source only.",
    category: "Physics",
    visual: <PEPVisual />
  },
  {
    term: "Pulse Repetition Frequency (PRF)",
    definition: "The number of pulses that an ultrasound system transmits into the body each second.",
    category: "Physics",
    visual: <PulseEchoPrincipleVisual />
  },
  {
    term: "Refraction",
    definition: "The change in direction of a wave propagation when traveling from one medium to another. Requires oblique incidence and different propagation speeds.",
    category: "Physics",
    visual: <TissueInteractionVisual />
  },
  {
    term: "Reverberation",
    definition: "An artifact caused by sound bouncing back and forth between two strong reflectors, appearing as equally spaced parallel lines.",
    category: "Artifacts",
    visual: <PropagationArtifactsVisual />
  },
  {
    term: "Shadowing",
    definition: "An artifact where echoes are weaker or absent behind a strongly attenuating structure (like a gallstone or bone).",
    category: "Artifacts",
    visual: <AttenuationArtifactsVisual />
  },
  {
    term: "Spatial Pulse Length (SPL)",
    definition: "The distance that a pulse occupies in space from the start to the end of a pulse.",
    category: "Physics",
    visual: <AxialResolutionVisual />
  },
  {
    term: "Speckle",
    definition: "Granular appearance of images and spectral displays that is caused by the interference of echoes from the distribution of scatterers in tissue.",
    category: "Artifacts",
    visual: <TissueInteractionVisual />
  },
  {
    term: "String Test Phantom",
    definition: "A device using a moving string to test the velocity measurement accuracy of Doppler systems.",
    category: "Instrumentation"
  },
  {
    term: "Temporal Resolution",
    definition: "The ability to precisely position moving structures from instant to instant. Determined by frame rate.",
    category: "Physics",
    visual: <MModeVisual />
  },
  {
    term: "Time Gain Compensation (TGC)",
    definition: "A function of the receiver that equalizes the differences in received echo amplitudes caused by different depths of reflectors.",
    category: "Instrumentation",
    visual: <TGCVisual />
  },
  {
    term: "Transducer",
    definition: "Any device that converts one form of energy into another.",
    category: "Instrumentation",
    visual: <TransducerAnatomyVisual />
  },
  {
    term: "Wavelength",
    definition: "The distance or length of one complete cycle.",
    category: "Physics",
    visual: <WaveParametersVisual />
  },
  {
    term: "Backing Material",
    definition: "Material attached to the rear of the piezoelectric crystal to reduce ringing, shorten pulse length, and improve axial resolution.",
    category: "Instrumentation",
    visual: <TransducerAnatomyVisual />
  },
  {
    term: "Bandwidth",
    definition: "The range of frequencies contained in a pulse. Imaging transducers have a wide bandwidth.",
    category: "Physics",
    visual: <WPVisual />
  },
  {
    term: "Contrast Agents",
    definition: "Microbubbles (gas encapsulated in a shell) injected into the circulation to increase the reflectivity of blood.",
    category: "Instrumentation"
  },
  {
    term: "Dead Zone",
    definition: "The region close to the transducer where imaging is inaccurate due to the time it takes for the system to switch from transmit to receive mode.",
    category: "Instrumentation"
  },
  {
    term: "Elastography",
    definition: "A dynamic technique that produces images based on the stiffness or elasticity of tissues.",
    category: "Instrumentation"
  },
  {
    term: "Focal Zone",
    definition: "The region around the focus where the beam is relatively narrow and image quality is best.",
    category: "Physics",
    visual: <BeamFocusingVisual />
  },
  {
    term: "Fraunhofer Zone (Far Field)",
    definition: "The region of the sound beam that starts at the focus and extends deeper, where the beam diverges.",
    category: "Physics",
    visual: <BeamFocusingVisual />
  },
  {
    term: "Fresnel Zone (Near Field)",
    definition: "The region of the sound beam between the transducer and the focus.",
    category: "Physics",
    visual: <BeamFocusingVisual />
  },
  {
    term: "Grating Lobes",
    definition: "Additional weak beams traveling in different directions than the main beam, created by array transducers.",
    category: "Artifacts",
    visual: <LateralResolutionVisual />
  },
  {
    term: "Harmonics",
    definition: "Frequencies that are multiples of the fundamental frequency (e.g., 2nd harmonic is twice the fundamental). Created in the tissues.",
    category: "Physics",
    visual: <TissueInteractionVisual />
  },
  {
    term: "Matching Layer",
    definition: "A layer of material in front of the PZT crystal with an impedance between that of the PZT and skin to maximize transmission.",
    category: "Instrumentation",
    visual: <TransducerAnatomyVisual />
  },
  {
    term: "Mechanical Index (MI)",
    definition: "A value that estimates the likelihood of non-thermal bioeffects, such as cavitation.",
    category: "Physics",
    visual: <BioeffectMechanismsVisual />
  },
  {
    term: "Q Factor (Quality Factor)",
    definition: "A unitless number that represents the purity of the vibration. Imaging transducers have a low Q factor.",
    category: "Physics"
  },
  {
    term: "Rayleigh Scattering",
    definition: "Occurs when the structure's dimensions are much smaller than the beam's wavelength (e.g., Red Blood Cells), scattering sound equally in all directions.",
    category: "Physics",
    visual: <TissueInteractionVisual />
  },
  {
    term: "Side Lobes",
    definition: "Off-axis sound beams created by single-element transducers that degrade lateral resolution.",
    category: "Artifacts",
    visual: <LateralResolutionVisual />
  },
  {
    term: "Snell's Law",
    definition: "A physics principle that describes the physics of refraction (bending) of sound at an interface with oblique incidence and different propagation speeds.",
    category: "Physics",
    visual: <TissueInteractionVisual />
  },
  {
    term: "Specular Reflection",
    definition: "Reflection from a large, smooth boundary where the sound is reflected in only one direction (like a mirror).",
    category: "Physics",
    visual: <TissueInteractionVisual />
  },
  {
    term: "Thermal Index (TI)",
    definition: "A calculated value that predicts the maximum temperature rise in tissues exposed to ultrasound.",
    category: "Physics",
    visual: <BioeffectMechanismsVisual />
  }
];
