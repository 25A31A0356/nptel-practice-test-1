import { QuestionDef } from "@shared/types";

// =========================================================================================
// NPTEL PRACTICE TEST 1 — METAL ADDITIVE MANUFACTURING (2026)
// Complete 60-Question Official Examination Question Bank 
// =========================================================================================

export function generateQuestionBank(): QuestionDef[] {
  return [
    // ==========================================
    
    // ==========================================
    {
      id: "MAM_W01_Q01",
      number: 1,
      topic: "Additive Manufacturing Fundamentals",
      points: 1,
      difficulty: "EASY",
      title: "Capillary Number Representation",
      description: "What does the capillary number (Ca) represent?",
      options: [
        { id: "A", text: "Relative effect of temperature on viscosity" },
        { id: "B", text: "Relative effect of viscous drag forces versus surface tension forces" },
        { id: "C", text: "Relative effect of pressure on interfacial tension" },
        { id: "D", text: "Relative effect of density on fluid velocity" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W01_Q02",
      number: 2,
      topic: "Additive Manufacturing Fundamentals",
      points: 1,
      difficulty: "EASY",
      title: "Layer Marks Phenomenon",
      description: "___________ phenomenon is associated with 3D printing when layer marks become distinctly visible on the surface of parts?",
      options: [
        { id: "A", text: "Staircase descent" },
        { id: "B", text: "Layer degradation" },
        { id: "C", text: "Staircase effect" },
        { id: "D", text: "Print layering" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W01_Q03",
      number: 3,
      topic: "Manufacturing Systems & Customization",
      points: 1,
      difficulty: "EASY",
      title: "Mass Customization in Production",
      description: "___________ based products can be produced according to the tastes of an individual consumer with the help of flexible manufacturing system and computer-based information but at a cost-effective, price.",
      options: [
        { id: "A", text: "Customization" },
        { id: "B", text: "Mass customization" },
        { id: "C", text: "Group technology" },
        { id: "D", text: "Flexible manufacturing system" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W01_Q04",
      number: 4,
      topic: "Materials & Automotive Applications",
      points: 1,
      difficulty: "EASY",
      title: "DS3 Titanium Door Handle Material",
      description: "The custom titanium door handle frame in DS3 Dark Side edition from DS Automobile is made of plastic.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W01_Q05",
      number: 5,
      topic: "Heat Transfer Fundamentals",
      points: 1,
      difficulty: "EASY",
      title: "Fourier's Law Heat Transfer",
      description: "Fourier's Law states that the time rate of heat transfer through a material is inversely proportional to the temperature gradient.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W01_Q06",
      number: 6,
      topic: "CAD / CAM Software in AM",
      points: 1,
      difficulty: "EASY",
      title: "3D Design Software for AM",
      description: "Which software tool is commonly used for 3D design of parts that need to be printed?",
      options: [
        { id: "A", text: "CAD/CAM software" },
        { id: "B", text: "Spreadsheet software" },
        { id: "C", text: "Graphic design software" },
        { id: "D", text: "Database management software" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W01_Q07",
      number: 7,
      topic: "Additive Manufacturing Definition",
      points: 1,
      difficulty: "EASY",
      title: "Additive Manufacturing Definition",
      description: "Additive manufacturing (AM), often known as 3D printing, is:",
      options: [
        { id: "A", text: "Mass production" },
        { id: "B", text: "Layer-by-layer fabrication" },
        { id: "C", text: "Casting techniques" },
        { id: "D", text: "Machining processes" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W01_Q08",
      number: 8,
      topic: "Material Retention Processes",
      points: 1,
      difficulty: "EASY",
      title: "Material Retention Process",
      description: "____________ is the process of one material being retained by another.",
      options: [
        { id: "A", text: "Fusion" },
        { id: "B", text: "Absorption" },
        { id: "C", text: "Oxidation" },
        { id: "D", text: "Sublimation" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W01_Q09",
      number: 9,
      topic: "Process Monitoring & Sensors",
      points: 1,
      difficulty: "EASY",
      title: "Photodiode Sensing in Metal AM",
      description: "What do photodiodes primarily sense in metal AM processes?",
      options: [
        { id: "A", text: "Mechanical vibrations" },
        { id: "B", text: "Thermal radiation and light emission" },
        { id: "C", text: "Electrical conductivity" },
        { id: "D", text: "Pressure changes" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W01_Q10",
      number: 10,
      topic: "Sheet Lamination Process",
      points: 1,
      difficulty: "EASY",
      title: "Sheet Lamination Process",
      description: "Sheet lamination is an additive manufacturing process that bonds sheets to make an object.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "A"
    },

    // ==========================================
    
    // ==========================================
    {
      id: "MAM_W02_Q01",
      number: 11,
      topic: "File Formats in AM",
      points: 1,
      difficulty: "EASY",
      title: "STL Full Form in AM",
      description: "What does STL stand for in additive manufacturing?",
      options: [
        { id: "A", text: "Standard tool layer" },
        { id: "B", text: "Solid triangular lattice" },
        { id: "C", text: "Stereolithography" },
        { id: "D", text: "None of these" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W02_Q02",
      number: 12,
      topic: "Material Extrusion & Bioprinters",
      points: 1,
      difficulty: "EASY",
      title: "Material Extrusion Scope",
      description: "Material Extrusion approaches range from a single syringe attached to an XYZ gantry system distributing ingredients using compressed gas back pressure to:",
      options: [
        { id: "A", text: "Digital Light Processing (DLP)" },
        { id: "B", text: "Continuous Liquid Interface Production (CLIP)" },
        { id: "C", text: "Bioprinters" },
        { id: "D", text: "Selective Laser Melting (SLM)" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W02_Q03",
      number: 13,
      topic: "Material Jetting Printheads",
      points: 1,
      difficulty: "EASY",
      title: "Material Jetting Printhead Characteristics",
      description: "Material Jetting printheads deposit material quickly with hundreds to thousands of nozzles.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W02_Q04",
      number: 14,
      topic: "Geometric Topologies in CAD",
      points: 1,
      difficulty: "EASY",
      title: "Non-Manifold Geometric Topologies",
      description: "What term describes geometric topologies allowing disjoint lumps to exist in their own logical body?",
      options: [
        { id: "A", text: "Non-linear geometries" },
        { id: "B", text: "Non-manifold geometries" },
        { id: "C", text: "Non-Euclidean geometries" },
        { id: "D", text: "Non-planar geometries" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W02_Q05",
      number: 15,
      topic: "Binder Jetting Technology",
      points: 1,
      difficulty: "EASY",
      title: "Binders in Binder Jetting",
      description: "Binders in Binder Jetting technology can treat metals that cannot be __________ processed.",
      options: [
        { id: "A", text: "chemically" },
        { id: "B", text: "thermally" },
        { id: "C", text: "mechanically" },
        { id: "D", text: "electrically" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W02_Q06",
      number: 16,
      topic: "Data Management in AM Files",
      points: 1,
      difficulty: "EASY",
      title: "Efficiency Principle in AM Files",
      description: "Which principle ensures that the same information is not stored in multiple places in the file?",
      options: [
        { id: "A", text: "Simplicity" },
        { id: "B", text: "Extensibility" },
        { id: "C", text: "Efficiency" },
        { id: "D", text: "Redundancy" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W02_Q07",
      number: 17,
      topic: "Commercial Material Jetting Systems",
      points: 1,
      difficulty: "EASY",
      title: "High-End Colored MJ Providers",
      description: "____________ and 3D Systems provide high-end MJ systems that can print colored items.",
      options: [
        { id: "A", text: "XJET" },
        { id: "B", text: "Stratasys" },
        { id: "C", text: "Nanoparticle Jetting Inc" },
        { id: "D", text: "3D Systems" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W02_Q08",
      number: 18,
      topic: "Preprocessing in AM Pipelines",
      points: 1,
      difficulty: "EASY",
      title: "CAD Preprocessing Requirement",
      description: "CAD models used in AM are directly converted into machine-readable files without any preprocessing.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W02_Q09",
      number: 19,
      topic: "HP Metal Jet Technology",
      points: 1,
      difficulty: "EASY",
      title: "HP Metal Jet Binder Jetting Enhancements",
      description: "HP's metal jet technology aims to improve Binder Jetting (BJ) by enhancing printing sharp corners and well-defined edges majorly through:",
      options: [
        { id: "A", text: "Reducing porosity" },
        { id: "B", text: "Increasing surface roughness" },
        { id: "C", text: "Improving dimensional accuracy" },
        { id: "D", text: "Decreasing surface polish" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W02_Q10",
      number: 20,
      topic: "PBF System Dimensions",
      points: 1,
      difficulty: "EASY",
      title: "Maximum Height Limit in PBF Systems",
      description: "PBF systems are currently limited to a maximum height of __________, as mentioned in the lecture.",
      options: [
        { id: "A", text: "1000 mm" },
        { id: "B", text: "800 mm" },
        { id: "C", text: "500 mm" },
        { id: "D", text: "1200 mm" }
      ],
      correct_option_id: "C"
    },

    // ==========================================
    
    // ==========================================
    {
      id: "MAM_W03_Q01",
      number: 21,
      topic: "Laser Systems & Lasers in AM",
      points: 1,
      difficulty: "EASY",
      title: "High Pressure Gas Laser Types",
      description: "Which type of lasers uses gas at 1 atm or higher and parallel electrodes?",
      options: [
        { id: "A", text: "CO2 laser" },
        { id: "B", text: "Fiber laser" },
        { id: "C", text: "Semiconductor laser" },
        { id: "D", text: "Solid-state laser" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W03_Q02",
      number: 22,
      topic: "Laser Physics & Population Inversion",
      points: 1,
      difficulty: "EASY",
      title: "Population Inversion Mechanism",
      description: "Which component of the laser system is responsible for creating population inversion?",
      options: [
        { id: "A", text: "Gain medium" },
        { id: "B", text: "Pumping source" },
        { id: "C", text: "Resonant optical cavity" },
        { id: "D", text: "Mirrors" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W03_Q03",
      number: 23,
      topic: "Laser Acronym Definition",
      points: 1,
      difficulty: "EASY",
      title: "Full Form of LASER",
      description: "“LASER” stands for _________.",
      options: [
        { id: "A", text: "Light Amplified by Stimulated Emission of Radiation" },
        { id: "B", text: "Light Amplification by Stimulated Emitted of Radiation" },
        { id: "C", text: "Light Amplification by Stimulated Emission of Radiation" },
        { id: "D", text: "Light Amplified by Stimulating Emission of Radiation" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W03_Q04",
      number: 24,
      topic: "Stimulated Emission & Amplification",
      points: 1,
      difficulty: "EASY",
      title: "Condition for Light Amplification",
      description: "In order for stimulated emission to produce a laser beam or amplify light, what condition must be met regarding the rates of emission and absorption?",
      options: [
        { id: "A", text: "Stimulated emission rate must be lower than absorption rate" },
        { id: "B", text: "Stimulated emission rate must be equal to absorption rate" },
        { id: "C", text: "Stimulated emission rate must be higher than absorption rate" },
        { id: "D", text: "Absorption rate must be higher than stimulated emission rate" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W03_Q05",
      number: 25,
      topic: "Laser Beam Transverse Modes",
      points: 1,
      difficulty: "EASY",
      title: "Transverse Modes in Laser Beams",
      description: "The transverse modes superimposed on a laser beam are known as:",
      options: [
        { id: "A", text: "Parallel modes" },
        { id: "B", text: "TEM modes" },
        { id: "C", text: "Longitudinal modes" },
        { id: "D", text: "Coherent modes" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W03_Q06",
      number: 26,
      topic: "Atomic Energy Levels",
      points: 1,
      difficulty: "EASY",
      title: "Atomic Energy States E1 and E2",
      description: "In the given atomic system, what best describe E1 and E2?",
      options: [
        { id: "A", text: "E1 is the excited state, and E2 is the ground state" },
        { id: "B", text: "E1 is the energy level of electrons, and E2 is the energy level of atoms" },
        { id: "C", text: "E1 is the ground state, and E2 is the excited state" },
        { id: "D", text: "E1 and E2 represent different polarization states" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W03_Q07",
      number: 27,
      topic: "Electron Beam Powder Bed Fusion (EPBF)",
      points: 1,
      difficulty: "EASY",
      title: "Electron Beam Energy in EPBF",
      description: "The _________ of the beam electrons heats the metal powder in EPBF.",
      options: [
        { id: "A", text: "kinetic energy" },
        { id: "B", text: "potential energy" },
        { id: "C", text: "both of these" },
        { id: "D", text: "none of these" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W03_Q08",
      number: 28,
      topic: "Electron Optics & Stigmator",
      points: 1,
      difficulty: "EASY",
      title: "Stigmator Solenoid Configuration",
      description: "In the explained Electron Beam Mechanism, how many solenoids with magnetic quadruples make up a stigmator?",
      options: [
        { id: "A", text: "One" },
        { id: "B", text: "Two" },
        { id: "C", text: "Three" },
        { id: "D", text: "Four" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W03_Q09",
      number: 29,
      topic: "Fiber Lasers & Optical Cladding",
      points: 1,
      difficulty: "EASY",
      title: "Pumping Light Absorption in Fiber Lasers",
      description: "In fiber optic lasers, the _______ absorbs pumping light each time the beam passes through.",
      options: [
        { id: "A", text: "cladding" },
        { id: "B", text: "core" },
        { id: "C", text: "diode laser pump" },
        { id: "D", text: "None of these" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W03_Q10",
      number: 30,
      topic: "Laser Medium Excitation Methods",
      points: 1,
      difficulty: "EASY",
      title: "Electrical Excitation Approach",
      description: "The laser medium's excitation by an intense electrical discharge (i.e., non-radiative) is known as the:",
      options: [
        { id: "A", text: "Electrical excitation approach" },
        { id: "B", text: "Optical pumping approach" },
        { id: "C", text: "Chemical excitation approach" },
        { id: "D", text: "Thermal excitation approach" }
      ],
      correct_option_id: "A"
    },

    // ==========================================
    
    // ==========================================
    {
      id: "MAM_W04_Q01",
      number: 31,
      topic: "Laser Directed Energy Deposition (LDED)",
      points: 1,
      difficulty: "EASY",
      title: "Powder Interaction Factors in LDED",
      description: "What factors impact the interactions of powder particles during LDED (powder-fed AM)?",
      options: [
        { id: "A", text: "Laser intensity and frequency" },
        { id: "B", text: "Nozzle type, angle between powder delivery system, and powder stream diameter" },
        { id: "C", text: "Ambient temperature and humidity" },
        { id: "D", text: "Substrate material composition" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W04_Q02",
      number: 32,
      topic: "Microstructure & Segregation",
      points: 1,
      difficulty: "EASY",
      title: "Reducing Dendritic Segregation",
      description: "What is a key factor in reducing dendritic segregation in Additive Manufacturing (AM)?",
      options: [
        { id: "A", text: "Achieving compositional homogeneity" },
        { id: "B", text: "Increasing grain size and distribution" },
        { id: "C", text: "Enhancing fluid flow and mass transfer" },
        { id: "D", text: "Introducing phase transformation" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W04_Q03",
      number: 33,
      topic: "Laser Powder Bed Fusion (LPBF) Hardware",
      points: 1,
      difficulty: "EASY",
      title: "Galvanometer Scanner Function in LPBF",
      description: "What is the function of galvanometer scanners in Laser Powder Bed Fusion (LPBF)?",
      options: [
        { id: "A", text: "They control the temperature of the laser beam" },
        { id: "B", text: "They perform x and y laser scanning" },
        { id: "C", text: "They regulate the powder flow rate" },
        { id: "D", text: "They adjust the laser intensity" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W04_Q04",
      number: 34,
      topic: "Directed Energy Deposition (DED) Equipment",
      points: 1,
      difficulty: "EASY",
      title: "Essential Powder Delivery Equipment in DED",
      description: "Which equipment is essential for the delivery and deposition of powders in a DED process?",
      options: [
        { id: "A", text: "Powder mixers" },
        { id: "B", text: "Powder feeders and delivery nozzles" },
        { id: "C", text: "Cooling chambers" },
        { id: "D", text: "Laser systems" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W04_Q05",
      number: 35,
      topic: "Solidification & Phase Diagrams",
      points: 1,
      difficulty: "EASY",
      title: "Mushy Zone Temperature Range",
      description: "At what temperature range does the mushy zone typically occur in metal alloys?",
      options: [
        { id: "A", text: "Below the solidus temperature" },
        { id: "B", text: "Between the solidus and liquidus temperatures" },
        { id: "C", text: "Above the liquidus temperature" },
        { id: "D", text: "At the eutectic temperature" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W04_Q06",
      number: 36,
      topic: "Thermal Cycling & Grain Morphology",
      points: 1,
      difficulty: "EASY",
      title: "Grain Morphology Control in Deposited Layers",
      description: "Which factor controls the early phase distribution and grain morphology of the deposited layer in additive manufacturing?",
      options: [
        { id: "A", text: "Thermal cycling and cooling" },
        { id: "B", text: "Heat source speed" },
        { id: "C", text: "Cooling to ambient temperature" },
        { id: "D", text: "Heat transfer mechanisms" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W04_Q07",
      number: 37,
      topic: "Wire-Feed DED Challenges",
      points: 1,
      difficulty: "EASY",
      title: "Wire-Feed Process Limitations in DED",
      description: "What challenge arises when achieving complex geometries with wire-feed processes in DED AM?",
      options: [
        { id: "A", text: "Low deposition rates" },
        { id: "B", text: "High porosity of parts" },
        { id: "C", text: "Difficulty controlling process parameters" },
        { id: "D", text: "Inability to obtain high geometry accuracy and low porosity simultaneously" }
      ],
      correct_option_id: "D"
    },
    {
      id: "MAM_W04_Q08",
      number: 38,
      topic: "Rapid Solidification Microstructures",
      points: 1,
      difficulty: "EASY",
      title: "Fast Cooling Microstructure Formation",
      description: "At fast cooling rates in AM, what type of structure forms?",
      options: [
        { id: "A", text: "Ferrite" },
        { id: "B", text: "Martensitic" },
        { id: "C", text: "Pearlite" },
        { id: "D", text: "Bainite" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W04_Q09",
      number: 39,
      topic: "Gravity Powder Feeders",
      points: 1,
      difficulty: "EASY",
      title: "High Precision Gravity Feeders",
      description: "What external components can be added to gravity feeders for achieving high precision feed rates?",
      options: [
        { id: "A", text: "Laser sensors" },
        { id: "B", text: "Temperature controllers" },
        { id: "C", text: "Metering wheels and lobe gears" },
        { id: "D", text: "Cooling chambers" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W04_Q10",
      number: 40,
      topic: "Controlled Solidification Protocols",
      points: 1,
      difficulty: "EASY",
      title: "Controlled Solidification Significance",
      description: "What is the one of the major significances of controlled solidification protocol in casting a large ingot of metal alloy into a single crystal?",
      options: [
        { id: "A", text: "It ensures the alloy remains in liquid state throughout the process" },
        { id: "B", text: "It prevents solidification of the alloy" },
        { id: "C", text: "It facilitates transformation of a homogeneous liquid into a perfect homogeneous solid" },
        { id: "D", text: "It accelerates the cooling process to reduce production time" }
      ],
      correct_option_id: "C"
    },

    // ==========================================
    
    // ==========================================
    {
      id: "MAM_W05_Q01",
      number: 41,
      topic: "AM Microstructure & Properties",
      points: 1,
      difficulty: "EASY",
      title: "AM Microstructure Anisotropy",
      description: "What type of microstructure do AM-processed products generally have?",
      options: [
        { id: "A", text: "Isotropic" },
        { id: "B", text: "Transparent" },
        { id: "C", text: "Anisotropic" },
        { id: "D", text: "Porous" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W05_Q02",
      number: 42,
      topic: "Cladding & Dilution Equations",
      points: 1,
      difficulty: "EASY",
      title: "Dilution Equation Parameter Xs",
      description: "In the dilution equation provided, what does Xs represent?",
      options: [
        { id: "A", text: "The density of melted powder alloy" },
        { id: "B", text: "The density of the substrate material" },
        { id: "C", text: "The weight percentage of an element in the total surface of the clad region" },
        { id: "D", text: "The weight percentage of an element in the substrate" }
      ],
      correct_option_id: "D"
    },
    {
      id: "MAM_W05_Q03",
      number: 43,
      topic: "Porosity & Defects in AM",
      points: 1,
      difficulty: "EASY",
      title: "Pores from Excessive Energy Input",
      description: "What type of pores are characterized by an inefficient melting regime and excessive energy input during processing?",
      options: [
        { id: "A", text: "Elongated, non-spherical pores" },
        { id: "B", text: "Gas pores" },
        { id: "C", text: "Spherical pores" },
        { id: "D", text: "Non-defective pores" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W05_Q04",
      number: 44,
      topic: "Thermal Gradients & Cracking",
      points: 1,
      difficulty: "EASY",
      title: "Powder Bed Temperature Gradient & Cracks",
      description: "A high powder bed temperature gradient can initiate and accelerate crack formation.",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W05_Q05",
      number: 45,
      topic: "Cyclic Softening in Alloys",
      points: 1,
      difficulty: "EASY",
      title: "Cyclic Softening Behavior",
      description: "Which type of alloy shows less cyclic softening, according to the provided information?",
      options: [
        { id: "A", text: "Wrought alloys" },
        { id: "B", text: "AM-manufactured alloys" },
        { id: "C", text: "Both show similar cyclic softening" },
        { id: "D", text: "Neither show cyclic softening" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W05_Q06",
      number: 46,
      topic: "Post-Processing Operations",
      points: 1,
      difficulty: "EASY",
      title: "De-powdering and Support Removal Category",
      description: "Which category of post-processing involves activities like de-powdering and support removal?",
      options: [
        { id: "A", text: "Mechanical properties" },
        { id: "B", text: "Visual inspection" },
        { id: "C", text: "Process-inherent process" },
        { id: "D", text: "Surface treatment" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W05_Q07",
      number: 47,
      topic: "Process Parameters in AM",
      points: 1,
      difficulty: "EASY",
      title: "Ambient Parameters in AM",
      description: "Which factor is typically constant and falls under the category of ‘Ambient’ parameters?",
      options: [
        { id: "A", text: "Beam power" },
        { id: "B", text: "Layer thickness" },
        { id: "C", text: "Shield gas type" },
        { id: "D", text: "Maximum velocity" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W05_Q08",
      number: 48,
      topic: "Titanium Alloys in AM",
      points: 1,
      difficulty: "EASY",
      title: "Extensively Studied Titanium Alloy",
      description: "Which Ti alloy is the most extensively studied in Additive Manufacturing (AM)?",
      options: [
        { id: "A", text: "Ti-6Al-4V" },
        { id: "B", text: "Ti-5Al-2.5Sn" },
        { id: "C", text: "Ti-6Al-2Sn-4Zr-2Mo" },
        { id: "D", text: "Ti-3Al-2.5V" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W05_Q09",
      number: 49,
      topic: "Energy Density & Volumetric Energy",
      points: 1,
      difficulty: "EASY",
      title: "Specific Energy Measurement",
      description: "What does the specific energy measure?",
      options: [
        { id: "A", text: "The amount of thermal energy received by each unit of volume" },
        { id: "B", text: "Input energy from the surface irradiated by the laser beam" },
        { id: "C", text: "The scanning speed of the laser" },
        { id: "D", text: "The layer thickness of the material" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W05_Q10",
      number: 50,
      topic: "Industrial Challenges in AM",
      points: 1,
      difficulty: "EASY",
      title: "Reproducibility Challenge in AM",
      description: "What is a difficulty faced by the AM industry in obtaining reproducible qualities?",
      options: [
        { id: "A", text: "Obtaining consistent hardness" },
        { id: "B", text: "Achieving uniform surface roughness" },
        { id: "C", text: "Ensuring geometrical integrity" },
        { id: "D", text: "Reproducing density accurately" }
      ],
      correct_option_id: "C"
    },

    // ==========================================
    
    // ==========================================
    {
      id: "MAM_W06_Q01",
      number: 51,
      topic: "Design for Additive Manufacturing (DfAM)",
      points: 1,
      difficulty: "EASY",
      title: "F-1 Cylinder Weight Reduction by DfAM",
      description: "Which company in the U.S. successfully achieved an 80% weight reduction in the F-1 automobile cylinder using DfAM technology?",
      options: [
        { id: "A", text: "Toyota" },
        { id: "B", text: "Local Motors" },
        { id: "C", text: "FIT WEST" },
        { id: "D", text: "None of the above" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W06_Q02",
      number: 52,
      topic: "Structural Optimization & Compliance",
      points: 1,
      difficulty: "EASY",
      title: "Augmented Compliance Response Equation Form",
      description: "What form is the governing equation added in to create the augmented compliance response?",
      options: [
        { id: "A", text: "First order" },
        { id: "B", text: "Second order" },
        { id: "C", text: "Zero form" },
        { id: "D", text: "Differential form" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W06_Q03",
      number: 53,
      topic: "Restrictive DfAM & Skin Models",
      points: 1,
      difficulty: "EASY",
      title: "Restrictive DfAM Geometric Models",
      description: "Restrictive DfAM methods aim to bridge the gap between the __________ geometric model and the skin model.",
      options: [
        { id: "A", text: "nominal" },
        { id: "B", text: "ideal" },
        { id: "C", text: "faulty" },
        { id: "D", text: "imperfect" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W06_Q04",
      number: 54,
      topic: "Traditional vs Additive Manufacturing Thinking",
      points: 1,
      difficulty: "EASY",
      title: "Traditional Manufacturing Mindset",
      description: "Most engineers think ______ because traditional manufacturing usually involves taking a block of material and taking stuff out of it.",
      options: [
        { id: "A", text: "additively" },
        { id: "B", text: "subtractively" },
        { id: "C", text: "multiplicatively" },
        { id: "D", text: "cumulatively" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W06_Q05",
      number: 55,
      topic: "Material Thermal Properties in Design",
      points: 1,
      difficulty: "EASY",
      title: "Thermal Properties & Layer Time Limitations",
      description: "The thermal properties of a material dictate __________ and some aspects of design.",
      options: [
        { id: "A", text: "layer time limitations" },
        { id: "B", text: "thermal conductivity" },
        { id: "C", text: "mechanical strength" },
        { id: "D", text: "electrical resistance" }
      ],
      correct_option_id: "A"
    },
    {
      id: "MAM_W06_Q06",
      number: 56,
      topic: "FDM Slicing & Toolpaths",
      points: 1,
      difficulty: "EASY",
      title: "FDM Infill & Raster Fill",
      description: "When printing with FDM technology, most printers will, by default, print one or two edges around the hole and then __________ the other areas.",
      options: [
        { id: "A", text: "solidify" },
        { id: "B", text: "reinforce" },
        { id: "C", text: "raster fill" },
        { id: "D", text: "smooth" }
      ],
      correct_option_id: "C"
    },
    {
      id: "MAM_W06_Q07",
      number: 57,
      topic: "Design Freedom in AM",
      points: 1,
      difficulty: "EASY",
      title: "Additive Manufacturing Design Freedom",
      description: "Additive manufacturing contributes significantly to industries with __________ freedom.",
      options: [
        { id: "A", text: "structural" },
        { id: "B", text: "design" },
        { id: "C", text: "mechanical" },
        { id: "D", text: "material" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W06_Q08",
      number: 58,
      topic: "Lattice Structures & Topology Optimization",
      points: 1,
      difficulty: "EASY",
      title: "Lattice Beam Optimization",
      description: "The _____ beam uses lattices to reduce the volume of the load-bearing design space.",
      options: [
        { id: "A", text: "yellow" },
        { id: "B", text: "green" },
        { id: "C", text: "red" },
        { id: "D", text: "blue" }
      ],
      correct_option_id: "B"
    },
    {
      id: "MAM_W06_Q09",
      number: 59,
      topic: "Overhangs, Bridges & Supports in DfAM",
      points: 1,
      difficulty: "EASY",
      title: "Bridge Connection in DfAM",
      description: "What connects the bridges to the body of the part?",
      options: [
        { id: "A", text: "Glue" },
        { id: "B", text: "Screws" },
        { id: "C", text: "Fusion" },
        { id: "D", text: "Connected at both ends" }
      ],
      correct_option_id: "D"
    },
    {
      id: "MAM_W06_Q10",
      number: 60,
      topic: "Part Consolidation & Integrated Structures",
      points: 1,
      difficulty: "EASY",
      title: "Integrated Structure Part Consolidation",
      description: "‘Integrated Structure’ design improves performance by reducing __________ parts and merging them into one.",
      options: [
        { id: "A", text: "material" },
        { id: "B", text: "joint" },
        { id: "C", text: "design" },
        { id: "D", text: "unit" }
      ],
      correct_option_id: "B"
    }
  ];
}
