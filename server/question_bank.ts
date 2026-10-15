import { QuestionDef } from "@shared/types";

// =========================================================================================
// NPTEL PRACTICE TEST — METAL ADDITIVE MANUFACTURING (2026)
// Complete 6 Question Papers (Week-07 through Week-12)
// Total 52 Questions with Official Solutions & Answers
// =========================================================================================

export function generateQuestionBank(): QuestionDef[] {
  return [
    // =========================================================================
    // QUESTION PAPER 1: ASSIGNMENT WEEK-07 (2026)
    // =========================================================================
    {
      id: "MAM_W07_Q01",
      number: 1,
      topic: "In-Process Monitoring & Measurement",
      points: 1,
      difficulty: "EASY",
      title: "On-Machine Measurement Definition",
      description: "What does ‘on-machine measurement’ refer to?",
      options: [
        { id: "A", text: "Measurement of parts before processing" },
        { id: "B", text: "Measurement of parts after processing" },
        { id: "C", text: "Measurement of parts during processing" },
        { id: "D", text: "Measurement of parts in storage" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W07_Q02",
      number: 2,
      topic: "Pyrometry & Thermal Sensing",
      points: 1,
      difficulty: "EASY",
      title: "Two-Colour Pyrometer Wavelength Filters",
      description: "In a two-colour pyrometer, how many wavelength filters are used in the sandwich detector?",
      options: [
        { id: "A", text: "One" },
        { id: "B", text: "Two" },
        { id: "C", text: "Three" },
        { id: "D", text: "Four" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W07_Q03",
      number: 3,
      topic: "Defect Correlation & CT Inspections",
      points: 1,
      difficulty: "EASY",
      title: "In-Process Defects vs Post-Process Inspection Flaws",
      description: "The relationship between in-process defects and flaws found by post-process inspections, such as X-ray computed tomography, is _______.",
      options: [
        { id: "A", text: "well-established" },
        { id: "B", text: "still unclear" },
        { id: "C", text: "negligible" },
        { id: "D", text: "irrelevant" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W07_Q04",
      number: 4,
      topic: "Process Signatures in AM",
      points: 1,
      difficulty: "EASY",
      title: "Process Signatures Observation Levels",
      description: "Relevant process signatures are divided into different observation levels based on their color and shape.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W07_Q05",
      number: 5,
      topic: "Thermography Spectral Bands",
      points: 1,
      difficulty: "EASY",
      title: "Spectral Bands for Thermography",
      description: "____________are the most common and appropriate spectral bands used for thermography?",
      options: [
        { id: "A", text: "Short and long infrared ranges" },
        { id: "B", text: "Medium and long infrared ranges" },
        { id: "C", text: "Near and far infrared ranges" },
        { id: "D", text: "Ultraviolet and infrared ranges" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W07_Q06",
      number: 6,
      topic: "Blackbody Radiation Laws",
      points: 1,
      difficulty: "EASY",
      title: "Planck's Law of Radiation",
      description: "Planck's law tells us how the intensity of electromagnetic radiation emitted by a blackbody, varies across its spectrum.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W07_Q07",
      number: 7,
      topic: "Infrared Sensor Calibration",
      points: 1,
      difficulty: "EASY",
      title: "Small Wavelength IR Sensor Calibration Limit",
      description: "Small Wavelength infrared sensors are sensitive, but they can't be calibrated below:",
      options: [
        { id: "A", text: "250 °C" },
        { id: "B", text: "350 °C" },
        { id: "C", text: "20 °C" },
        { id: "D", text: "0 °C" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W07_Q08",
      number: 8,
      topic: "Thermal Radiance Components",
      points: 1,
      difficulty: "EASY",
      title: "Radiance Components for Real Bodies",
      description: "Which of the following is not a component of radiance for real bodies?",
      options: [
        { id: "A", text: "Absorption" },
        { id: "B", text: "Transmission" },
        { id: "C", text: "Reflection" },
        { id: "D", text: "Emissivity" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W07_Q09",
      number: 9,
      topic: "Pyrometer Technology",
      points: 1,
      difficulty: "EASY",
      title: "Dual-Wavelength Pyrometer Capabilities",
      description: "Dual-wavelength pyrometers allow for independent selection and combination of wavelengths.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W07_Q10",
      number: 10,
      topic: "Sensing Architectures in AM",
      points: 1,
      difficulty: "EASY",
      title: "Co-Axial Sensing Architectures Process Application",
      description: "In which type of additive manufacturing process can co-axial sensing architectures be used?",
      options: [
        { id: "A", text: "Laser Powder Bed Fusion (L-PBF)" },
        { id: "B", text: "Electron Beam Powder Bed Fusion (EB-PBF)" },
        { id: "C", text: "Selective Laser Melting (SLM)" },
        { id: "D", text: "Fused Deposition Modeling (FDM)" }
      ],
      correct_option_id: "A"
    },

    // =========================================================================
    // QUESTION PAPER 2: ASSIGNMENT WEEK-08 (2026)
    // =========================================================================
    {
      id: "MAM_W08_Q01",
      number: 11,
      topic: "Titanium Matrix Composites",
      points: 1,
      difficulty: "EASY",
      title: "Hardening Element for Ti Matrix Composites",
      description: "Which element contributes to the hardening of Titanium matrix composites alongside TiB whiskers?",
      options: [
        { id: "A", text: "Nitrogen" },
        { id: "B", text: "Oxygen" },
        { id: "C", text: "Carbon" },
        { id: "D", text: "Aluminum" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W08_Q02",
      number: 12,
      topic: "Composite Densification",
      points: 1,
      difficulty: "EASY",
      title: "Fe2O3 Content and Densification",
      description: "The higher content of Fe2O3 negatively affects the densification property of the composites.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W08_Q03",
      number: 13,
      topic: "Solidification Defects",
      points: 1,
      difficulty: "EASY",
      title: "Solidification Rate and Pore Formation",
      description: "Faster solidification of liquid melts causes partial filling of gaps in the melted area, causing pores.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W08_Q04",
      number: 14,
      topic: "AM Defects & Part Integrity",
      points: 1,
      difficulty: "EASY",
      title: "Cracks and Part Functionality",
      description: "Cracks degrade manufactured parts' functionality and cause failure.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W08_Q05",
      number: 15,
      topic: "Aluminum Matrix Composites",
      points: 1,
      difficulty: "EASY",
      title: "Al Matrix Composites for Improved Mechanical Properties",
      description: "Which type of Al matrix composites improves Al alloy mechanical properties?",
      options: [
        { id: "A", text: "TiB2" },
        { id: "B", text: "Al-Si-10Mg" },
        { id: "C", text: "LPBF" },
        { id: "D", text: "None of these" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W08_Q06",
      number: 16,
      topic: "Metal-Matrix Interfaces",
      points: 1,
      difficulty: "EASY",
      title: "SiC-Al Matrix Interface Effects",
      description: "What does inadequate SiC-Al matrix interface hinder?",
      options: [
        { id: "A", text: "In-situ reaction" },
        { id: "B", text: "Composite density" },
        { id: "C", text: "Wettability" },
        { id: "D", text: "Microstructure alteration" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W08_Q07",
      number: 17,
      topic: "Composite Powder Preparation",
      points: 1,
      difficulty: "EASY",
      title: "Mixing Matrix Powder and Reinforcements",
      description: "What method is used to mix both the matrix powder and reinforcing ingredients at the beginning of composite manufacture?",
      options: [
        { id: "A", text: "Ball milling" },
        { id: "B", text: "Grinding" },
        { id: "C", text: "Melting" },
        { id: "D", text: "None of these" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W08_Q08",
      number: 18,
      topic: "Fluid Dynamics in Melt Pool",
      points: 1,
      difficulty: "EASY",
      title: "Dispersion of Reinforcements in Liquid Flow",
      description: "Which factor affects the dispersion of reinforcements in the liquid flow?",
      options: [
        { id: "A", text: "Gravity" },
        { id: "B", text: "Buoyancy" },
        { id: "C", text: "Surface tension" },
        { id: "D", text: "Liquid flow velocity" }
      ],
      correct_option_id: "D"
    },
    {
      id: "MAM_W08_Q09",
      number: 19,
      topic: "Marangoni Convection & Particle Aggregation",
      points: 1,
      difficulty: "EASY",
      title: "TiC Particle Aggregation in Marangoni Flow",
      description: "What causes the TiC particles to aggregate near the center of the Marangoni flow?",
      options: [
        { id: "A", text: "Centrifugal force" },
        { id: "B", text: "Torque" },
        { id: "C", text: "Magnetic field" },
        { id: "D", text: "Gravitational force" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W08_Q10",
      number: 20,
      topic: "Wear Resistance in Composites",
      points: 1,
      difficulty: "EASY",
      title: "Wear Resistance in Coarse TiC Composites",
      description: "Which factor contributes to poor wear resistance in composites reinforced with coarse TiC components?",
      options: [
        { id: "A", text: "Shear stress" },
        { id: "B", text: "Tensile stress" },
        { id: "C", text: "Compressive stress" },
        { id: "D", text: "Abrasive stress" }
      ],
      correct_option_id: "A"
    },

    // =========================================================================
    // QUESTION PAPER 3: ASSIGNMENT WEEK-09 (2026)
    // =========================================================================
    {
      id: "MAM_W09_Q01",
      number: 21,
      topic: "Reverse Engineering & CAD",
      points: 1,
      difficulty: "EASY",
      title: "Digital Models from CAD Drawings",
      description: "Digital models obtained from CAD drawings are crucial for ________.",
      options: [
        { id: "A", text: "obsolete computer parts" },
        { id: "B", text: "identifying components" },
        { id: "C", text: "understanding design intent" },
        { id: "D", text: "photographing circuit boards" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W09_Q02",
      number: 22,
      topic: "3D Scanning & Image Alignment",
      points: 1,
      difficulty: "EASY",
      title: "Purpose of Alignment in Range Imaging",
      description: "What is the purpose of alignment in the context described?",
      options: [
        { id: "A", text: "To adjust the scanner's settings" },
        { id: "B", text: "To bring Range Images to the same reference system" },
        { id: "C", text: "To calibrate the scanner's lenses" },
        { id: "D", text: "None of these" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W09_Q03",
      number: 23,
      topic: "Reverse Engineering Fundamentals",
      points: 1,
      difficulty: "EASY",
      title: "Primary Focus of Reverse Engineering",
      description: "What is the primary focus of reverse engineering?",
      options: [
        { id: "A", text: "Investigating natural phenomena" },
        { id: "B", text: "Designing new technologies" },
        { id: "C", text: "Extracting design blueprints from man-made objects" },
        { id: "D", text: "Analyzing scientific theories" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W09_Q04",
      number: 24,
      topic: "3D Surface Scanning Techniques",
      points: 1,
      difficulty: "EASY",
      title: "Impeller Surface Scanning Method",
      description: "How were the surfaces of the impeller scanned?",
      options: [
        { id: "A", text: "Simultaneously" },
        { id: "B", text: "Separately, with each surface scanned individually" },
        { id: "C", text: "Manually" },
        { id: "D", text: "None of these" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W09_Q05",
      number: 25,
      topic: "Component Design Origins",
      points: 1,
      difficulty: "EASY",
      title: "Origin of New Component Designs",
      description: "The design of a new component often originates from:",
      options: [
        { id: "A", text: "Conceptual sketches" },
        { id: "B", text: "Existing physical real parts" },
        { id: "C", text: "Digital simulations" },
        { id: "D", text: "Market research" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W09_Q06",
      number: 26,
      topic: "Reverse Engineering Analysis",
      points: 1,
      difficulty: "EASY",
      title: "Design Understanding through Component Measurement",
      description: "The team measures capacitors and resistors as they remove them to grasp the design's ____________.",
      options: [
        { id: "A", text: "complexity" },
        { id: "B", text: "engineering" },
        { id: "C", text: "color scheme" },
        { id: "D", text: "material composition" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W09_Q07",
      number: 27,
      topic: "Non-Contact Scanning Methods",
      points: 1,
      difficulty: "EASY",
      title: "Non-Contact Reverse Engineering Capture",
      description: "In non-contact reverse engineering, ________ are captured by projecting energy sources on an object.",
      options: [
        { id: "A", text: "3D models" },
        { id: "B", text: "2D cross-sectional images" },
        { id: "C", text: "CAD drawings" },
        { id: "D", text: "virtual reality simulations" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W09_Q08",
      number: 28,
      topic: "Point Cloud Data Processing",
      points: 1,
      difficulty: "EASY",
      title: "Point Cloud Processing Actions",
      description: "What happens during the processing of the points cloud?",
      options: [
        { id: "A", text: "Noise and outlines are enhanced" },
        { id: "B", text: "Points cloud from different places are separated" },
        { id: "C", text: "Noise and outlines are removed, and points may be combined if the part was scanned in more than one place" },
        { id: "D", text: "None of these" }
      ],
      correct_option_id: "C"
    },

    // =========================================================================
    // QUESTION PAPER 4: ASSIGNMENT WEEK-10 (2026)
    // =========================================================================
    {
      id: "MAM_W10_Q01",
      number: 29,
      topic: "Non-Destructive Testing (NDT)",
      points: 1,
      difficulty: "EASY",
      title: "Permanent Record in Inspection Methods",
      description: "No permanent record is available unless one of the more sophisticated _________ and data collection systems is used.",
      options: [
        { id: "A", text: "testing techniques" },
        { id: "B", text: "inspection methods" },
        { id: "C", text: "analysis procedures" },
        { id: "D", text: "evaluation systems" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W10_Q02",
      number: 30,
      topic: "Acoustic Emission Testing",
      points: 1,
      difficulty: "EASY",
      title: "Acoustic Emission Wave Generation",
      description: "What does the term ‘acoustic emission’ refer to?",
      options: [
        { id: "A", text: "Generation of static waves" },
        { id: "B", text: "Generation of transient waves" },
        { id: "C", text: "Generation of continuous waves" },
        { id: "D", text: "Generation of seismic waves" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W10_Q03",
      number: 31,
      topic: "Ultrasonic NDT",
      points: 1,
      difficulty: "EASY",
      title: "Pulse Vibration Frequency in Ultrasonic Testing",
      description: "In what frequency range does the pulse vibrate in ultrasonic testing, in general?",
      options: [
        { id: "A", text: "1 Hz to 6 Hz" },
        { id: "B", text: "1 kHz to 6 kHz" },
        { id: "C", text: "1 MHz to 6 MHz" },
        { id: "D", text: "1 GHz to 6 GHz" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W10_Q04",
      number: 32,
      topic: "Computed Tomography (CT)",
      points: 1,
      difficulty: "EASY",
      title: "Operating Beam Principle in Computed Tomography",
      description: "Computed Tomography (CT) works on the principle of irradiating a sample with a beam of:",
      options: [
        { id: "A", text: "Electromagnetic waves" },
        { id: "B", text: "Gamma rays" },
        { id: "C", text: "X-rays" },
        { id: "D", text: "Ultraviolet rays" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W10_Q05",
      number: 33,
      topic: "In-Service NDT Inspection",
      points: 1,
      difficulty: "EASY",
      title: "Primary Reason for In-Service NDT",
      description: "In-service, NDT inspections are primarily conducted for which of the following reasons?",
      options: [
        { id: "A", text: "To ensure products have defects" },
        { id: "B", text: "To decrease public safety" },
        { id: "C", text: "To ensure products remain useful and safe" },
        { id: "D", text: "To neglect product integrity" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W10_Q06",
      number: 34,
      topic: "Visual Testing (VT) Techniques",
      points: 1,
      difficulty: "EASY",
      title: "Enhancing Visual Testing Effectiveness",
      description: "How can Visual Testing (VT) be somewhat improved to enhance its effectiveness and scope?",
      options: [
        { id: "A", text: "Using magnetic particle testing" },
        { id: "B", text: "Employing ultrasonic testing" },
        { id: "C", text: "Utilizing a boroscope" },
        { id: "D", text: "Applying radiographic testing" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W10_Q07",
      number: 35,
      topic: "Eddy Current Testing",
      points: 1,
      difficulty: "EASY",
      title: "Eddy Current Generation in Conductive Media",
      description: "Eddy currents can be produced in any electrically conducting __________.",
      options: [
        { id: "A", text: "material" },
        { id: "B", text: "wire only" },
        { id: "C", text: "plate only" },
        { id: "D", text: "None of these" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W10_Q08",
      number: 36,
      topic: "CT Image Reconstruction",
      points: 1,
      difficulty: "EASY",
      title: "Multiplanar Reformatted Imaging in CT",
      description: "Multiplanar reformatted imaging is possible in CT due to multiple contiguous or single _______ scans.",
      options: [
        { id: "A", text: "axial" },
        { id: "B", text: "lateral" },
        { id: "C", text: "helical" },
        { id: "D", text: "circular" }
      ],
      correct_option_id: "C"
    },

    // =========================================================================
    // QUESTION PAPER 5: ASSIGNMENT WEEK-11 (2026)
    // =========================================================================
    {
      id: "MAM_W11_Q01",
      number: 37,
      topic: "Eco-Design & Sustainable AM",
      points: 1,
      difficulty: "EASY",
      title: "Eco-Design Material Selection",
      description: "Eco-design displays itself in real-world applications using ___________ materials throughout the manufacture.",
      options: [
        { id: "A", text: "high-impact" },
        { id: "B", text: "traditional" },
        { id: "C", text: "low-impact" },
        { id: "D", text: "synthetic" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W11_Q02",
      number: 38,
      topic: "SLM Applications & Consumer Products",
      points: 1,
      difficulty: "EASY",
      title: "Manufacturing Technique for Titanium Bottle Opener",
      description: "Which manufacturing technique was utilized to produce the titanium bottle opener?",
      options: [
        { id: "A", text: "CNC machining" },
        { id: "B", text: "Injection molding" },
        { id: "C", text: "Selective laser melting" },
        { id: "D", text: "Metal casting" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W11_Q03",
      number: 39,
      topic: "Sustainable Design Philosophy",
      points: 1,
      difficulty: "EASY",
      title: "Well-Designed Objects & Sustainability",
      description: "A well-designed object is less sustainable and holds less value.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W11_Q04",
      number: 40,
      topic: "Functional Specifications in Product Design",
      points: 1,
      difficulty: "EASY",
      title: "Functional Specifications Scope",
      description: "What do functional specifications define?",
      options: [
        { id: "A", text: "The project budgets" },
        { id: "B", text: "The product’s overall functions and input/output qualities" },
        { id: "C", text: "The marketing strategy" },
        { id: "D", text: "The team members roles" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W11_Q05",
      number: 41,
      topic: "Raw Material Efficiency in Manufacturing",
      points: 1,
      difficulty: "EASY",
      title: "Lowest Raw Material Wastage Manufacturing",
      description: "Which manufacturing process has the capability of producing components with the lowest amount of raw material wastage?",
      options: [
        { id: "A", text: "Subtractive manufacturing" },
        { id: "B", text: "Traditional manufacturing" },
        { id: "C", text: "Additive manufacturing" },
        { id: "D", text: "All of these" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W11_Q06",
      number: 42,
      topic: "Circular Economy in AM",
      points: 1,
      difficulty: "EASY",
      title: "Technology Enabling Circular Business Models",
      description: "Which of the following technologies plays a crucial role in enabling circular business models?",
      options: [
        { id: "A", text: "Virtual Reality" },
        { id: "B", text: "3D Printing" },
        { id: "C", text: "Blockchain" },
        { id: "D", text: "All of these" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W11_Q07",
      number: 43,
      topic: "Aerospace AM & Emissions Reduction",
      points: 1,
      difficulty: "EASY",
      title: "Aircraft Light-Weighting Emission Reduction",
      description: "Lighter parts in aircraft boost fuel efficiency and minimize __________ emissions",
      options: [
        { id: "A", text: "nitrogen" },
        { id: "B", text: "carbon" },
        { id: "C", text: "oxygen" },
        { id: "D", text: "hydrogen" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W11_Q08",
      number: 44,
      topic: "Topology Optimization & Material Elimination",
      points: 1,
      difficulty: "EASY",
      title: "Action when Relative Density Falls Below Threshold",
      description: "Which action is taken when the relative density of a material falls below the specified threshold?",
      options: [
        { id: "A", text: "Material is strengthened" },
        { id: "B", text: "Material is eliminated" },
        { id: "C", text: "Material is hardened" },
        { id: "D", text: "Material is softened" }
      ],
      correct_option_id: "B"
    },

    // =========================================================================
    // QUESTION PAPER 6: ASSIGNMENT WEEK-12 (2026)
    // =========================================================================
    {
      id: "MAM_W12_Q01",
      number: 45,
      topic: "Production Components & Economic Factors",
      points: 1,
      difficulty: "EASY",
      title: "Basic Production Components",
      description: "Which of the following are the basic production components?",
      options: [
        { id: "A", text: "Land and labor" },
        { id: "B", text: "Human capital" },
        { id: "C", text: "Time, entrepreneurship" },
        { id: "D", text: "All of these" }
      ],
      correct_option_id: "D"
    },
    {
      id: "MAM_W12_Q02",
      number: 46,
      topic: "Operations & Value Creation",
      points: 1,
      difficulty: "EASY",
      title: "Translating Resources into Products and Services",
      description: "The company must also translate resources into products and services.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W12_Q03",
      number: 47,
      topic: "Health, Safety & Environmental Factors in AM",
      points: 1,
      difficulty: "EASY",
      title: "Byproduct Gas in Metal AM Exposure",
      description: "________ is produced when metal additive manufacturing methods are exposed.",
      options: [
        { id: "A", text: "Hydrogen" },
        { id: "B", text: "Nitrogen" },
        { id: "C", text: "Ozone" },
        { id: "D", text: "Carbon dioxide" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W12_Q04",
      number: 48,
      topic: "Manufacturing Controllability & Agility",
      points: 1,
      difficulty: "EASY",
      title: "Controllability in Manufacturing Systems",
      description: "Controllability involves adjusting to changing situations with minimal:",
      options: [
        { id: "A", text: "Time and Expenses" },
        { id: "B", text: "Performance implications" },
        { id: "C", text: "Both of these" },
        { id: "D", text: "None of these" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W12_Q05",
      number: 49,
      topic: "Laser Safety Standards",
      points: 1,
      difficulty: "EASY",
      title: "ANSI Standard for Safe Use of Lasers",
      description: "Which ANSI standard provides the direction for safe use of lasers across various sectors such as industry, military, research and higher education?",
      options: [
        { id: "A", text: "ANSI Z136.4" },
        { id: "B", text: "ANSI Z136.1" },
        { id: "C", text: "ANSI Z136.5" },
        { id: "D", text: "ANSI Z136.9" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W12_Q06",
      number: 50,
      topic: "Operations Management Scope",
      points: 1,
      difficulty: "EASY",
      title: "Demand Planning and Operations",
      description: "Demand planning, forecasting and inventory are all part of operations.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W12_Q07",
      number: 51,
      topic: "Occupational Health & Metal Exposure",
      points: 1,
      difficulty: "EASY",
      title: "Symptoms of Metal Fume Fever",
      description: "Which is not a symptom of metal fume fever?",
      options: [
        { id: "A", text: "Metallic taste on the mouth" },
        { id: "B", text: "Chills" },
        { id: "C", text: "Fever" },
        { id: "D", text: "Dizziness" }
      ],
      correct_option_id: "D"
    },
    {
      id: "MAM_W12_Q08",
      number: 52,
      topic: "Industrial Revolutions & Manufacturing Evolution",
      points: 1,
      difficulty: "EASY",
      title: "Industrial Revolutions & Technological Foundations",
      description: "_________is/was based on internal combustion engines and electrical devices to manufacture products.",
      options: [
        { id: "A", text: "Industry 1.0" },
        { id: "B", text: "Industry 2.0" },
        { id: "C", text: "Industry 3.0" },
        { id: "D", text: "Industry 4.0" }
      ],
      correct_option_id: "B"
    }
  ];
}
