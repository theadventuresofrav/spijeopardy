import { ExamQuestion } from '../types';

export const MOCK_EXAM_QUESTIONS: ExamQuestion[] = [
  // 1. Basic Physics (Waves, Sound, Media)
  {
    id: 'q1',
    question: 'Which of the following parameters is determined by the sound source only?',
    options: ['Propagation Speed', 'Frequency', 'Wavelength', 'Intensity (Initial)'],
    correctAnswerIndex: 1,
    explanation: 'Frequency is determined by the sound source (the transducer) and does not change as it propagates through the medium.'
  },
  {
    id: 'q2',
    question: 'As the frequency of a wave increases, what happens to the wavelength?',
    options: ['Increases', 'Decreases', 'Remains the same', 'Doubles'],
    correctAnswerIndex: 1,
    explanation: 'Frequency and wavelength are inversely related. As frequency increases, wavelength decreases.'
  },
  {
    id: 'q3',
    question: 'What is the average speed of sound in soft tissue?',
    options: ['1540 m/s', '1.54 mm/µs', '154,000 cm/s', 'All of the above'],
    correctAnswerIndex: 3,
    explanation: 'All the options represent the same speed: 1540 m/s = 1.54 mm/µs = 154,000 cm/s.'
  },
  {
    id: 'q4',
    question: 'What determines the propagation speed of sound?',
    options: ['Frequency', 'Wavelength', 'Medium properties (Density & Stiffness)', 'Power'],
    correctAnswerIndex: 2,
    explanation: 'Propagation speed is determined solely by the medium properties: density and stiffness.'
  },
  {
    id: 'q5',
    question: 'Which medium has the lowest propagation speed?',
    options: ['Bone', 'Muscle', 'Fat', 'Air'],
    correctAnswerIndex: 3,
    explanation: 'Sound travels slowest in gases (Air ~330 m/s) compared to liquids and solids. Bone is fastest (~3500 m/s).'
  },
  {
    id: 'q6',
    question: 'What is the period of a 5 MHz transducer?',
    options: ['0.2 µs', '0.02 µs', '2 µs', '0.5 µs'],
    correctAnswerIndex: 0,
    explanation: 'Period = 1 / Frequency. 1 / 5 MHz = 0.2 µs.'
  },
  {
    id: 'q7',
    question: 'If the stiffness of a medium increases, the propagation speed:',
    options: ['Increases', 'Decreases', 'Remains the same', 'Becomes zero'],
    correctAnswerIndex: 0,
    explanation: 'Stiffness (Bulk Modulus) is directly related to speed. Stiffer media have faster sound speeds.'
  },
  {
    id: 'q8',
    question: 'If the density of a medium increases, the propagation speed:',
    options: ['Increases', 'Decreases', 'Remains the same', 'Doubles'],
    correctAnswerIndex: 1,
    explanation: 'Density is inversely related to speed. Denser materials (like lead) have slower sound speeds if stiffness is constant.'
  },
  {
    id: 'q9',
    question: 'The time it takes for one cycle to occur is called:',
    options: ['Frequency', 'Period', 'Pulse Duration', 'Duty Factor'],
    correctAnswerIndex: 1,
    explanation: 'Period is the time required for one complete cycle.'
  },
  {
    id: 'q10',
    question: 'Which of the following is an acoustic variable?',
    options: ['Pressure', 'Density', 'Particle Motion', 'All of the above'],
    correctAnswerIndex: 3,
    explanation: 'Pressure, Density, and Distance (Particle Motion) are the three acoustic variables that identify a sound wave.'
  },

  // 2. Attenuation & Intensity
  {
    id: 'q11',
    question: 'Which intensity is most relevant for bioeffects?',
    options: ['SATA', 'SPTA', 'SPTP', 'SATP'],
    correctAnswerIndex: 1,
    explanation: 'SPTA (Spatial Peak, Temporal Average) is the intensity most relevant to tissue heating and bioeffects.'
  },
  {
    id: 'q12',
    question: 'If the power of a beam is doubled and the cross-sectional area remains the same, the intensity:',
    options: ['Doubles', 'Halves', 'Quadruples', 'Remains the same'],
    correctAnswerIndex: 0,
    explanation: 'Intensity = Power / Area. If Power doubles, Intensity doubles.'
  },
  {
    id: 'q13',
    question: 'Attenuation increases with:',
    options: ['Decreasing frequency', 'Decreasing path length', 'Increasing frequency', 'None of the above'],
    correctAnswerIndex: 2,
    explanation: 'Attenuation is directly related to frequency. Higher frequency sound attenuates more.'
  },
  {
    id: 'q14',
    question: 'The attenuation coefficient in soft tissue is approximately:',
    options: ['0.5 dB/cm/MHz', '1.0 dB/cm/MHz', '2.0 dB/cm/MHz', '0.25 dB/cm/MHz'],
    correctAnswerIndex: 0,
    explanation: 'In soft tissue, sound attenuates at roughly 0.5 dB per centimeter for every megahertz of frequency.'
  },
  {
    id: 'q15',
    question: 'Half-value layer thickness depends on:',
    options: ['Medium only', 'Sound source only', 'Medium and Frequency', 'Path length'],
    correctAnswerIndex: 2,
    explanation: 'Half-value layer thickness depends on the medium (attenuation rate) and the frequency of sound.'
  },
  {
    id: 'q16',
    question: 'What is the unit for Impedance?',
    options: ['Rayls', 'Watts', 'Joules', 'Decibels'],
    correctAnswerIndex: 0,
    explanation: 'Acoustic Impedance is measured in Rayls (Z).'
  },
  {
    id: 'q17',
    question: 'Reflection occurs only if there is:',
    options: ['Normal incidence and different impedances', 'Oblique incidence and different speeds', 'Different densities', 'Same impedances'],
    correctAnswerIndex: 0,
    explanation: 'For reflection to occur at normal incidence, there must be a difference in acoustic impedance between the two media.'
  },
  {
    id: 'q18',
    question: 'Refraction only occurs with:',
    options: ['Normal incidence and different impedances', 'Oblique incidence and different propagation speeds', 'Normal incidence and different speeds', 'Oblique incidence and same speeds'],
    correctAnswerIndex: 1,
    explanation: 'Refraction (Snell\'s Law) requires oblique incidence and a difference in propagation speeds between the two media.'
  },
  {
    id: 'q19',
    question: 'If the incident angle is 30 degrees and the transmission angle is 50 degrees, what can be said about the media?',
    options: ['Speed 2 > Speed 1', 'Speed 2 < Speed 1', 'Density 2 > Density 1', 'Impedance 1 = Impedance 2'],
    correctAnswerIndex: 0,
    explanation: 'If the transmission angle is greater than the incident angle, the speed in medium 2 is greater than the speed in medium 1.'
  },
  {
    id: 'q20',
    question: 'Which component of attenuation is dominant in soft tissue?',
    options: ['Reflection', 'Scattering', 'Absorption', 'Refraction'],
    correctAnswerIndex: 2,
    explanation: 'Absorption (conversion to heat) is the primary component of attenuation in soft tissue.'
  },

  // 3. Transducers
  {
    id: 'q21',
    question: 'Which of the following creates the best axial resolution?',
    options: ['Low Frequency, Many Cycles', 'High Frequency, Few Cycles', 'Low Frequency, Few Cycles', 'High Frequency, Many Cycles'],
    correctAnswerIndex: 1,
    explanation: 'Axial resolution = SPL / 2. SPL decreases with higher frequency (shorter wavelength) and fewer cycles (damping).'
  },
  {
    id: 'q22',
    question: 'Lateral resolution is determined by:',
    options: ['Spatial Pulse Length', 'Beam Width', 'Frame Rate', 'Pulse Duration'],
    correctAnswerIndex: 1,
    explanation: 'Lateral resolution is equal to the beam width. Narrower beams provide better lateral resolution.'
  },
  {
    id: 'q23',
    question: 'The Fresnel zone is also known as the:',
    options: ['Far Zone', 'Near Zone', 'Focal Zone', 'Fraunhofer Zone'],
    correctAnswerIndex: 1,
    explanation: 'The Fresnel zone is the Near Zone. The Fraunhofer zone is the Far Zone.'
  },
  {
    id: 'q24',
    question: 'Which transducer array uses time delays to steer and focus the beam electronically?',
    options: ['Mechanical', 'Annular', 'Phased Array', 'Linear Sequential (old style)'],
    correctAnswerIndex: 2,
    explanation: 'Phased Array transducers use electronic phasing (time delays) to steer and focus the beam.'
  },
  {
    id: 'q25',
    question: 'What is the main advantage of a 1.5D array transducer?',
    options: ['Better Axial Resolution', 'Slice Thickness (Elevational) Focusing', 'Faster Frame Rate', 'Wider Field of View'],
    correctAnswerIndex: 1,
    explanation: '1.5D arrays allow for focusing in the elevational plane, reducing slice thickness artifact.'
  },
  {
    id: 'q26',
    question: 'Which resolution is superior in clinical ultrasound?',
    options: ['Axial', 'Lateral', 'Elevational', 'Temporal'],
    correctAnswerIndex: 0,
    explanation: 'Axial resolution (LARRD) is typically the best (smallest numerical value) because pulses are very short.'
  },
  {
    id: 'q27',
    question: 'Increasing the transducer diameter improves:',
    options: ['Axial Resolution', 'Near Zone Length and Lateral Resolution in Far Field', 'Frame Rate', 'Temporal Resolution'],
    correctAnswerIndex: 1,
    explanation: 'A larger diameter crystal creates a longer near zone and less divergence in the far field, improving lateral resolution at depth.'
  },
  {
    id: 'q28',
    question: 'The matching layer is designed to:',
    options: ['Increase Reflection', 'Reduce Impedance Mismatch', 'Increase Pulse Length', 'Decrease Frequency'],
    correctAnswerIndex: 1,
    explanation: 'The matching layer has an impedance between the active element and skin to maximize transmission.'
  },
  {
    id: 'q29',
    question: 'The thickness of the matching layer is:',
    options: ['1/4 Wavelength', '1/2 Wavelength', '1 Wavelength', '2 Wavelengths'],
    correctAnswerIndex: 0,
    explanation: 'The matching layer is 1/4 wavelength thick.'
  },
  {
    id: 'q30',
    question: 'The thickness of the active element is:',
    options: ['1/4 Wavelength', '1/2 Wavelength', '1 Wavelength', '2 Wavelengths'],
    correctAnswerIndex: 1,
    explanation: 'The active element (PZT) is 1/2 wavelength thick.'
  },

  // 4. Doppler & Hemodynamics
  {
    id: 'q31',
    question: 'Nyquist limit is equal to:',
    options: ['PRF', 'PRF / 2', 'Frequency / 2', 'Frame Rate x 2'],
    correctAnswerIndex: 1,
    explanation: 'The Nyquist limit is PRF / 2. Exceeding this shift causes aliasing.'
  },
  {
    id: 'q32',
    question: 'How can you eliminate aliasing?',
    options: ['Increase Frequency', 'Decrease PRF', 'Shift Baseline Down', 'Use Continuous Wave Doppler'],
    correctAnswerIndex: 3,
    explanation: 'CW Doppler cannot alias. Increasing PRF (scale) or lowering frequency also helps, but CW eliminates it entirely.'
  },
  {
    id: 'q33',
    question: 'Turbulent flow is predicted by a Reynolds number greater than:',
    options: ['1500', '2000', '2500', '500'],
    correctAnswerIndex: 1,
    explanation: 'A Reynolds number > 2000 typically indicates turbulent flow.'
  },
  {
    id: 'q34',
    question: 'According to Bernoulli\'s principle, where velocity is highest, pressure is:',
    options: ['Highest', 'Lowest', 'Unchanged', 'Zero'],
    correctAnswerIndex: 1,
    explanation: 'Bernoulli\'s principle states that as velocity increases, pressure decreases (conservation of energy).'
  },
  {
    id: 'q35',
    question: 'Which Doppler angle yields the most accurate velocity measurement?',
    options: ['0 degrees', '60 degrees', '90 degrees', '45 degrees'],
    correctAnswerIndex: 0,
    explanation: 'Cosine of 0 is 1, providing the full true velocity. 90 degrees (cosine 0) provides no Doppler shift.'
  },
  {
    id: 'q36',
    question: 'Color Doppler reports:',
    options: ['Peak velocities', 'Mean velocities', 'Mode velocities', 'Maximum velocities'],
    correctAnswerIndex: 1,
    explanation: 'Color Doppler uses autocorrelation to report mean (average) velocities.'
  },
  {
    id: 'q37',
    question: 'Spectral Broadening is a sign of:',
    options: ['Laminar Flow', 'Turbulent Flow', 'Plug Flow', 'No Flow'],
    correctAnswerIndex: 1,
    explanation: 'Spectral broadening (filling of the window) indicates a wide range of velocities, characteristic of turbulence.'
  },
  {
    id: 'q38',
    question: 'The wall filter is used to eliminate:',
    options: ['High frequency noise', 'Low frequency, high amplitude signals', 'Aliasing', 'Shadowing'],
    correctAnswerIndex: 1,
    explanation: 'Wall filters (high pass filters) remove low frequency Doppler shifts caused by tissue motion (clutter).'
  },
  {
    id: 'q39',
    question: 'Packet size refers to:',
    options: ['Number of pulses per scan line in Color Doppler', 'Frame rate', 'Sector width', 'Gain'],
    correctAnswerIndex: 0,
    explanation: 'Packet size (ensemble length) is the number of pulses used to interrogate a single color line.'
  },
  {
    id: 'q40',
    question: 'Which flow profile is seen in normal femoral arteries?',
    options: ['Low resistance, monophasic', 'High resistance, triphasic', 'Continuous', 'Turbulent'],
    correctAnswerIndex: 1,
    explanation: 'Peripheral arteries like the femoral artery normally exhibit high resistance, triphasic flow.'
  },

  // 5. Artifacts
  {
    id: 'q41',
    question: 'Which artifact appears as a series of equally spaced echoes?',
    options: ['Shadowing', 'Enhancement', 'Reverberation', 'Mirror Image'],
    correctAnswerIndex: 2,
    explanation: 'Reverberation artifact appears as multiple, equally spaced echoes ("ladder").'
  },
  {
    id: 'q42',
    question: 'Shadowing is caused by:',
    options: ['High attenuation structure', 'Low attenuation structure', 'Refraction', 'Speed error'],
    correctAnswerIndex: 0,
    explanation: 'Shadowing occurs behind a highly attenuating structure (stone, bone) that blocks sound.'
  },
  {
    id: 'q43',
    question: 'Enhancement occurs behind:',
    options: ['High attenuation structure', 'Low attenuation structure', 'Refraction', 'Speed error'],
    correctAnswerIndex: 1,
    explanation: 'Enhancement occurs behind a weakly attenuating structure (cyst), causing distal echoes to appear brighter.'
  },
  {
    id: 'q44',
    question: 'Mirror image artifact is always located:',
    options: ['Shallower than the true reflector', 'Deeper than the true reflector', 'Side-by-side', 'In the near field'],
    correctAnswerIndex: 1,
    explanation: 'The artifact is always deeper than the true reflector.'
  },
  {
    id: 'q45',
    question: 'Which artifact is related to the "broken needle" appearance?',
    options: ['Speed Error', 'Refraction', 'Slice Thickness', 'Multipath'],
    correctAnswerIndex: 0,
    explanation: 'Speed error artifact can displace echoes axially. If sound travels slower than 1540m/s, echoes are placed deeper.'
  },

  // 6. Instrumentation & QA
  {
    id: 'q46',
    question: 'Which control affects the total amount of ultrasound energy entering the patient?',
    options: ['Receiver Gain', 'Output Power', 'TGC', 'Compression'],
    correctAnswerIndex: 1,
    explanation: 'Output Power controls the strength of the transmitted pulse and affects patient exposure.'
  },
  {
    id: 'q47',
    question: 'Which receiver function cannot be adjusted by the sonographer?',
    options: ['Amplification', 'Compensation', 'Demodulation', 'Rejection'],
    correctAnswerIndex: 2,
    explanation: 'Demodulation (rectification and smoothing) is an automatic internal process.'
  },
  {
    id: 'q48',
    question: 'ALARA stands for:',
    options: ['As Low As Reasonably Achievable', 'As Long As Reasonably Allowed', 'Always Lower Area Resolution Averages', 'None of the above'],
    correctAnswerIndex: 0,
    explanation: 'ALARA principle: As Low As Reasonably Achievable, minimizing exposure.'
  },
  {
    id: 'q49',
    question: 'A tissue phantom is used to evaluate:',
    options: ['Gray scale', 'Doppler velocity', 'Beam profile', 'Output power'],
    correctAnswerIndex: 0,
    explanation: 'Tissue equivalent phantoms mimic soft tissue attenuation and speed, used for gray scale and resolution testing.'
  },
  {
    id: 'q50',
    question: 'The dead zone is best evaluated with:',
    options: ['Deepest pins', 'Shallowest pins', 'Vertical pins', 'Horizontal pins'],
    correctAnswerIndex: 1,
    explanation: 'The dead zone is the region close to the transducer where imaging is inaccurate, evaluated with the shallowest pins.'
  },
  
  // 7. Advanced Hemodynamics & Doppler
  {
    id: 'q51',
    question: 'Which of the following increases the Reynolds number?',
    options: ['Increased viscosity', 'Decreased velocity', 'Increased vessel diameter', 'Decreased density'],
    correctAnswerIndex: 2,
    explanation: 'Reynolds number = (Density × Velocity × Diameter) / Viscosity. Increasing diameter increases the Reynolds number.'
  },
  {
    id: 'q52',
    question: 'The hydrostatic pressure at the ankle of a standing patient is approximately:',
    options: ['0 mmHg', '100 mmHg', '-50 mmHg', '200 mmHg'],
    correctAnswerIndex: 1,
    explanation: 'In a standing patient, hydrostatic pressure adds ~100 mmHg at the ankle due to the column of blood.'
  },
  {
    id: 'q53',
    question: 'During inspiration, abdominal pressure:',
    options: ['Increases', 'Decreases', 'Remains unchanged', 'Becomes negative'],
    correctAnswerIndex: 0,
    explanation: 'Inspiration (diaphragm moves down) increases abdominal pressure, decreasing venous return from the legs.'
  },
  {
    id: 'q54',
    question: 'Which color Doppler control helps to eliminate low-frequency ghosting artifacts?',
    options: ['Scale', 'Gain', 'Wall Filter', 'Persistence'],
    correctAnswerIndex: 2,
    explanation: 'The Wall Filter (High Pass Filter) eliminates low-frequency Doppler shifts from moving tissue (ghosting/clutter).'
  },
  {
    id: 'q55',
    question: 'What is the primary advantage of Power Doppler?',
    options: ['Directional information', 'Velocity measurement', 'Increased sensitivity to low flow', 'High frame rate'],
    correctAnswerIndex: 2,
    explanation: 'Power Doppler is non-directional but highly sensitive to low flow and unaffected by Doppler angle.'
  },
  {
    id: 'q56',
    question: 'Crosstalk is a Doppler artifact caused by:',
    options: ['Receiver gain too high', 'Wall filter too high', 'PRF too low', 'Transducer frequency too low'],
    correctAnswerIndex: 0,
    explanation: 'Crosstalk ("mirror image" on spectral display) is caused by receiver gain being too high or incident angle near 90°.'
  },
  {
    id: 'q57',
    question: 'The Resistive Index (RI) is calculated as:',
    options: ['(PSV - EDV) / PSV', '(PSV - EDV) / Mean Velocity', 'PSV / EDV', 'PSV - EDV'],
    correctAnswerIndex: 0,
    explanation: 'RI = (Peak Systolic Velocity - End Diastolic Velocity) / Peak Systolic Velocity.'
  },
  {
    id: 'q58',
    question: 'Plug flow is most likely seen in:',
    options: ['Small tortuous vessels', 'Large vessels at the entrance', 'Stenotic jets', 'Venous flow'],
    correctAnswerIndex: 1,
    explanation: 'Plug flow (all layers traveling at same speed) is seen at the entrance of large vessels like the aorta.'
  },
  {
    id: 'q59',
    question: 'Which of the following will result in the highest Doppler shift?',
    options: ['2 MHz tx, 60° angle', '4 MHz tx, 60° angle', '2 MHz tx, 0° angle', '4 MHz tx, 0° angle'],
    correctAnswerIndex: 3,
    explanation: 'Doppler shift is directly proportional to Frequency and Cosine of angle. Higher freq (4MHz) and 0° (Cos=1) gives max shift.'
  },
  {
    id: 'q60',
    question: 'Phasic flow describes velocity changes due to:',
    options: ['Cardiac contraction', 'Respiration', 'Muscle contraction', 'Vessel compliance'],
    correctAnswerIndex: 1,
    explanation: 'Phasic flow (in veins) changes with respiration. Pulsatile flow (in arteries) changes with cardiac contraction.'
  },

  // 8. Quality Assurance & Bioeffects
  {
    id: 'q61',
    question: 'Which phantom is best for evaluating the slice thickness?',
    options: ['AIUM 100mm Test Object', 'Tissue Equivalent Phantom', 'Slice Thickness Phantom', 'Doppler Phantom'],
    correctAnswerIndex: 2,
    explanation: 'A specialized Slice Thickness Phantom (with an inclined plane) is needed to measure elevational resolution.'
  },
  {
    id: 'q62',
    question: 'The Mechanical Index (MI) predicts the likelihood of:',
    options: ['Thermal injury', 'Cavitation', 'Electrical shock', 'Radiation exposure'],
    correctAnswerIndex: 1,
    explanation: 'MI predicts the likelihood of cavitation (bubble formation/bursting). TI predicts thermal bioeffects.'
  },
  {
    id: 'q63',
    question: 'Which form of cavitation is more dangerous?',
    options: ['Stable', 'Transient (Inertial)', 'Thermal', 'Mechanical'],
    correctAnswerIndex: 1,
    explanation: 'Transient (Inertial) cavitation involves bubble bursting and shock waves, causing more localized damage than Stable cavitation.'
  },
  {
    id: 'q64',
    question: 'The maximum heating of tissue is related to:',
    options: ['SPTA intensity', 'SATA intensity', 'SPTP intensity', 'Impedance'],
    correctAnswerIndex: 0,
    explanation: 'SPTA (Spatial Peak Temporal Average) is the intensity most correlated with tissue heating.'
  },
  {
    id: 'q65',
    question: 'Which tissue is most susceptible to thermal injury?',
    options: ['Muscle', 'Fat', 'Bone', 'Blood'],
    correctAnswerIndex: 2,
    explanation: 'Bone is a strong absorber of sound, making the bone-tissue interface most susceptible to heating.'
  },
  {
    id: 'q66',
    question: 'What is the gold standard for measuring acoustic output power?',
    options: ['Hydrophone', 'Calorimeter', 'Radiation Force Balance', 'Thermocouple'],
    correctAnswerIndex: 2,
    explanation: 'A Radiation Force Balance measures the total power of the sound beam.'
  },
  {
    id: 'q67',
    question: 'The region where the beam is narrowest is the:',
    options: ['Fraunhofer zone', 'Fresnel zone', 'Focus', 'Focal zone'],
    correctAnswerIndex: 2,
    explanation: 'The Focus is the specific point where the beam diameter is narrowest.'
  },
  {
    id: 'q68',
    question: 'Which of the following creates a "clean" shadow?',
    options: ['Gallstone', 'Gas', 'Cyst', 'Lipoma'],
    correctAnswerIndex: 0,
    explanation: 'Calcified structures like gallstones or bones absorb/reflect sound, creating a clean (anechoic) shadow. Gas creates a "dirty" shadow.'
  },
  {
    id: 'q69',
    question: 'Comet tail artifact is a form of:',
    options: ['Refraction', 'Reverberation', 'Mirror Image', 'Side Lobes'],
    correctAnswerIndex: 1,
    explanation: 'Comet tail is a form of reverberation where the echoes are very closely spaced, merging into a solid line.'
  },
  {
    id: 'q70',
    question: 'Grating lobes are created by:',
    options: ['Single element transducers', 'Array transducers', 'Mechanical transducers', 'Continuous wave transducers'],
    correctAnswerIndex: 1,
    explanation: 'Grating lobes are off-axis energy beams created by array transducers. Side lobes are from single element transducers.'
  },

  // 9. Instrumentation & Processing
  {
    id: 'q71',
    question: 'Which receiver function increases the dynamic range of signals?',
    options: ['Amplification', 'Compression', 'Demodulation', 'Rejection'],
    correctAnswerIndex: 1,
    explanation: 'Compression reduces the dynamic range of the signal to a range the display can handle, while keeping gray scale relationships.'
  },
  {
    id: 'q72',
    question: 'Read magnification is a form of:',
    options: ['Pre-processing', 'Post-processing', 'Analog conversion', 'Digital filtering'],
    correctAnswerIndex: 1,
    explanation: 'Read magnification occurs after the image is frozen (from memory), so it is post-processing.'
  },
  {
    id: 'q73',
    question: 'Write magnification leads to:',
    options: ['Pixelation', 'Improved spatial resolution', 'Unchanged temporal resolution', 'Post-processing'],
    correctAnswerIndex: 1,
    explanation: 'Write magnification rescans the ROI, increasing pixel density and spatial resolution. It is pre-processing.'
  },
  {
    id: 'q74',
    question: 'How many bits are needed to display 16 shades of gray?',
    options: ['2', '3', '4', '5'],
    correctAnswerIndex: 2,
    explanation: '2^n = shades. 2^4 = 16. So 4 bits are needed.'
  },
  {
    id: 'q75',
    question: 'Which component determines the PRF?',
    options: ['Pulser', 'Receiver', 'Memory', 'Display'],
    correctAnswerIndex: 0,
    explanation: 'The Pulser determines the PRF, PRP, and amplitude of the pulse.'
  },
  {
    id: 'q76',
    question: 'Coded excitation allows for:',
    options: ['Improved penetration and SNR', 'Reduced frame rate', 'Increased bioeffects', 'Worse axial resolution'],
    correctAnswerIndex: 0,
    explanation: 'Coded excitation (long encoded pulses) improves penetration and Signal-to-Noise Ratio (SNR) without increasing peak intensity.'
  },
  {
    id: 'q77',
    question: 'Spatial Compounding improves image quality by:',
    options: ['Increasing frame rate', 'Reducing speckle and shadowing', 'Increasing sector width', 'Using harmonics'],
    correctAnswerIndex: 1,
    explanation: 'Spatial Compounding steers beams from multiple angles to average out speckle and reduce shadowing artifacts.'
  },
  {
    id: 'q78',
    question: 'Elastography measures:',
    options: ['Blood velocity', 'Tissue stiffness', 'Temperature', 'Electrical impedance'],
    correctAnswerIndex: 1,
    explanation: 'Elastography evaluates the stiffness (elasticity) of tissues.'
  },
  {
    id: 'q79',
    question: 'Harmonic imaging improves image quality by:',
    options: ['Improving lateral resolution', 'Reducing grating lobes', 'Reducing superficial reverberation', 'All of the above'],
    correctAnswerIndex: 3,
    explanation: 'Harmonics (2f) creates a narrower beam (better lateral res), reduces lobes, and bypasses superficial distortion.'
  },
  {
    id: 'q80',
    question: 'The Scan Converter is responsible for:',
    options: ['Storing information', 'Amplifying signals', 'Steering the beam', 'Creating the pulse'],
    correctAnswerIndex: 0,
    explanation: 'The scan converter (memory) stores the image data, enabling the change from scan lines to video format.'
  },

  // 10. Miscellaneous & Advanced Physics
  {
    id: 'q81',
    question: 'Which has the highest attenuation rate?',
    options: ['Water', 'Blood', 'Muscle', 'Lung'],
    correctAnswerIndex: 3,
    explanation: 'Air/Lung has extremely high attenuation due to scattering and absorption. Water has the lowest.'
  },
  {
    id: 'q82',
    question: 'The Curie point is the temperature at which:',
    options: ['PZT polarizes', 'PZT loses its piezoelectric properties', 'Ultrasound causes damage', 'Water boils'],
    correctAnswerIndex: 1,
    explanation: 'Heating PZT above the Curie point depolarizes it, destroying its piezoelectric properties.'
  },
  {
    id: 'q83',
    question: 'Dynamic Range is measured in:',
    options: ['Watts', 'Rayls', 'Decibels', 'Hertz'],
    correctAnswerIndex: 2,
    explanation: 'Dynamic Range (ratio of largest to smallest signals) is measured in Decibels (dB).'
  },
  {
    id: 'q84',
    question: 'Which of the following is a binary number?',
    options: ['10110', '12345', '24680', 'ABCDE'],
    correctAnswerIndex: 0,
    explanation: 'Binary numbers consist only of 0s and 1s.'
  },
  {
    id: 'q85',
    question: 'Contrast agents (microbubbles) work by:',
    options: ['Increasing speed of sound', 'Creating harmonic signals', 'Reducing attenuation', 'Absorbing sound'],
    correctAnswerIndex: 1,
    explanation: 'Microbubbles expand/contract non-linearly, creating strong harmonic signals that separate them from tissue.'
  },
  {
    id: 'q86',
    question: 'If the frame rate increases, temporal resolution:',
    options: ['Improves', 'Degrades', 'Remains unchanged', 'Becomes zero'],
    correctAnswerIndex: 0,
    explanation: 'Frame rate and temporal resolution are directly related. Higher frame rate = better temporal resolution.'
  },
  {
    id: 'q87',
    question: 'Which factor does NOT affect Frame Rate?',
    options: ['Imaging Depth', 'Number of Focal Points', 'Sector Width', 'Transducer Frequency'],
    correctAnswerIndex: 3,
    explanation: 'Transducer frequency affects resolution/penetration, but not the speed of sound or time to create a frame.'
  },
  {
    id: 'q88',
    question: 'What is the speed of sound in the PZT crystal?',
    options: ['1540 m/s', '4000-6000 m/s', '330 m/s', '1.54 mm/µs'],
    correctAnswerIndex: 1,
    explanation: 'Sound travels much faster in PZT (approx 4-6 mm/µs) than in soft tissue.'
  },
  {
    id: 'q89',
    question: 'The bandwidth of a transducer is:',
    options: ['The range of frequencies emitted', 'The center frequency', 'The quality factor', 'The pulse duration'],
    correctAnswerIndex: 0,
    explanation: 'Bandwidth is the range of frequencies (max - min) contained in the pulse.'
  },
  {
    id: 'q90',
    question: 'Low Q-factor transducers are good for imaging because they have:',
    options: ['Long pulses', 'Narrow bandwidth', 'Short pulses', 'High sensitivity'],
    correctAnswerIndex: 2,
    explanation: 'Low Q-factor means heavy damping, which creates short pulses needed for good axial resolution.'
  },

  // 11. Final Comprehensive Review
  {
    id: 'q91',
    question: 'Hydrophone measures:',
    options: ['Impedance', 'Pressure amplitude and duty factor', 'Attenuation', 'Flow'],
    correctAnswerIndex: 1,
    explanation: 'A hydrophone measures acoustic pressure, period, pulse duration, and PRF.'
  },
  {
    id: 'q92',
    question: 'Which intensity is lowest?',
    options: ['SPTP', 'SPTA', 'SATA', 'SATP'],
    correctAnswerIndex: 2,
    explanation: 'SATA (Spatial Average Temporal Average) is the lowest intensity.'
  },
  {
    id: 'q93',
    question: 'The beam is focused by:',
    options: ['Lens', 'Curved PZT', 'Electronic Phasing', 'All of the above'],
    correctAnswerIndex: 3,
    explanation: 'Focusing can be external (lens), internal (curved PZT), or electronic (phased array).'
  },
  {
    id: 'q94',
    question: 'A-Mode displays:',
    options: ['Amplitude vs Depth', 'Motion vs Time', 'Brightness vs Depth', 'Frequency vs Time'],
    correctAnswerIndex: 0,
    explanation: 'A-Mode (Amplitude Mode) plots echo amplitude (Y-axis) against depth/time (X-axis).'
  },
  {
    id: 'q95',
    question: 'M-Mode is best for:',
    options: ['Abdominal imaging', 'Cardiac motion', 'Vascular flow', 'Thyroid cysts'],
    correctAnswerIndex: 1,
    explanation: 'M-Mode provides excellent temporal resolution for evaluating rapid cardiac wall and valve motion.'
  },
  {
    id: 'q96',
    question: 'Which resolution is determined by the frame rate?',
    options: ['Axial', 'Lateral', 'Temporal', 'Contrast'],
    correctAnswerIndex: 2,
    explanation: 'Temporal resolution is the ability to precisely position moving structures, determined by frame rate.'
  },
  {
    id: 'q97',
    question: 'If the sector width is doubled, the frame rate:',
    options: ['Doubles', 'Halves', 'Remains the same', 'Quadruples'],
    correctAnswerIndex: 1,
    explanation: 'Doubling the sector width requires twice as many lines per frame (if line density is constant), halving the frame rate.'
  },
  {
    id: 'q98',
    question: 'The "focal point" is where the beam diameter is:',
    options: ['Widest', 'One half the transducer width', 'Narrowest', 'Two times the near zone length'],
    correctAnswerIndex: 2,
    explanation: 'The focal point is the location where the beam is narrowest.'
  },
  {
    id: 'q99',
    question: 'Damping material improves:',
    options: ['Sensitivity', 'Axial Resolution', 'Output Power', 'Penetration'],
    correctAnswerIndex: 1,
    explanation: 'Damping reduces the "ringing" (number of cycles), shortening the pulse and improving axial resolution.'
  },
  {
    id: 'q100',
    question: 'Wide bandwidth transducers usually have:',
    options: ['High Q-Factor', 'Low Q-Factor', 'No Damping', 'Long Pulses'],
    correctAnswerIndex: 1,
    explanation: 'Imaging transducers have backing material, resulting in Low Q-Factor and Wide Bandwidth.'
  },
  {
    id: 'q101',
    question: 'The unit for viscosity is:',
    options: ['Poise', 'Rayls', 'Decibels', 'Hertz'],
    correctAnswerIndex: 0,
    explanation: 'Viscosity is measured in units of Poise.'
  },
  {
    id: 'q102',
    question: 'Parabolic flow has a velocity profile that is:',
    options: ['Flat', 'Bullet shaped', 'Random', 'Reversed'],
    correctAnswerIndex: 1,
    explanation: 'Laminar flow in a long straight tube develops a bullet-shaped (parabolic) profile.'
  },
  {
    id: 'q103',
    question: 'The Doppler shift is negative when:',
    options: ['Source moves towards receiver', 'Source moves away from receiver', 'Angle is 90 degrees', 'Velocity is zero'],
    correctAnswerIndex: 1,
    explanation: 'A negative shift occurs when the reflector (blood) moves away from the transducer.'
  },
  {
    id: 'q104',
    question: 'Variance mode in Color Doppler distinguishes:',
    options: ['Direction', 'Laminar vs Turbulent flow', 'Speed vs Velocity', 'Artery vs Vein'],
    correctAnswerIndex: 1,
    explanation: 'Variance mode maps add a color (often green) to indicate spectral broadening/turbulence.'
  },
  {
    id: 'q105',
    question: 'Which artifact causes a replica of the structure deeper than the original?',
    options: ['Mirror Image', 'Refraction', 'Shadowing', 'Enhancement'],
    correctAnswerIndex: 0,
    explanation: 'Mirror image artifact creates a duplicate copy deep to a strong reflector (like the diaphragm).'
  },
  {
    id: 'q106',
    question: 'Side lobes degrade:',
    options: ['Axial resolution', 'Lateral resolution', 'Temporal resolution', 'Contrast resolution'],
    correctAnswerIndex: 1,
    explanation: 'Side lobes widen the effective beam width, degrading lateral resolution.'
  },
  {
    id: 'q107',
    question: 'The "dead time" refers to:',
    options: ['Receive time', 'Transmit time', 'Pulse duration', 'Listening time'],
    correctAnswerIndex: 0,
    explanation: 'In pulse-echo ultrasound, the system spends >99% of the time listening (receive time).'
  },
  {
    id: 'q108',
    question: 'Duty Factor for continuous wave ultrasound is:',
    options: ['0.1%', '1%', '50%', '100%'],
    correctAnswerIndex: 3,
    explanation: 'CW ultrasound is always transmitting, so Duty Factor = 1.0 or 100%.'
  },
  {
    id: 'q109',
    question: 'Duty Factor for imaging ultrasound is approximately:',
    options: ['100%', '50%', '0.2%', '10%'],
    correctAnswerIndex: 2,
    explanation: 'Pulsed wave imaging has a very low duty factor, typically < 1% (0.002).'
  },
  {
    id: 'q110',
    question: 'Which of the following is NOT an operator control?',
    options: ['Gain', 'TGC', 'Frequency (on some systems)', 'Rectification'],
    correctAnswerIndex: 3,
    explanation: 'Rectification (turning negative voltages to positive) is a receiver function that is not user adjustable.'
  }
];
