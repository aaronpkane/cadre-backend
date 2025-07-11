const db = require('./db');

const seed = async () => {
    try {
    console.log('🌱 Starting seed...');

    // Clear old data (if needed)
    await db.query('TRUNCATE members RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE task_competency_links RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE tasks RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE competencies RESTART IDENTITY CASCADE');
  
    // Seed members
    const members = [
      { rate_rank: 'BM1', first_name: 'Joseph', last_name: 'Coastie', employee_id: '0000001', email: 'joseph.coastie@uscg.mil' },
      { rate_rank: 'ME1', first_name: 'Andrew', last_name: 'Hicks', employee_id: '0000002', email: 'andrew.p.hicks@uscg.mil' },
      { rate_rank: 'MK1', first_name: 'Shelby', last_name: 'Valier', employee_id: '0000003', email: 'shelby.l.valier@uscg.mil'},
      { rate_rank: 'BM2', first_name: 'John', last_name: 'Doe', employee_id: '0000004', email: 'john.q.doe@uscg.mil'},
      { rate_rank: 'MK2', first_name: 'Jane', last_name: 'Smith', employee_id: '0000005', email: 'jane.w.smith@uscg.mil'}
    ];

    for (let m of members) {
      await db.query(
        `INSERT INTO members (rate_rank, first_name, last_name, employee_id, email) VALUES ($1, $2, $3, $4, $5)`,
        [m.rate_rank, m.first_name, m.last_name, m.employee_id, m.email]
      );
    }

    // Seed tasks
    const tasks = [
      {code: '1-01', title: 'Physical Fitness Standard', description: 'PFT'},
      {code: '1-02', title: 'Authority & Jurisdiction', description: 'A&J'},
      {code: '1-03', title: 'Use of Force Policy', description: 'UOF'},
      {code: '1-04', title: 'Level 1 - Officer Presence', description: 'UOF Level 1'},
      {code: '1-05', title: 'Level 2 - Verbal Commands', description: 'UOF Level 2'},
      {code: '1-06', title: 'Level 3 - Control Techniques', description: 'UOF Level 3'},
      {code: '1-07', title: 'Level 4 - Aggressive Response Techniques', description: 'UOF Level 4'},
      {code: '1-08', title: 'Level 5 - Intermediate Weapons', description: 'UOF Level 5'},
      {code: '1-09', title: 'Level 6 - Deadly Force', description: 'UOF Level 6'},
      {code: '1-10', title: 'Two-Person UOF Techniques', description: 'Two-Person UOF Evaluation'},
      {code: '1-11', title: 'Weapons Retention', description: 'Weps Retention'},
      {code: '1-12', title: 'Questioning Individuals During a Boarding', description: 'Questioning'},
      {code: '1-13', title: 'Initial/Extended Safety Sweep', description: 'BISS/EISS'},
      {code: '1-14', title: 'Hazardous Situations/Confined Spaces', description: 'HAZSIT'},
      {code: '1-15', title: 'Tactical Procedures', description: 'TacPro'},
      {code: '1-16', title: 'Easy Weapons Removal', description: 'Easy Weapons Removal'},
      {code: '1-17', title: 'Restraint Devices', description: 'Handcuffing'},
      {code: '1-18', title: 'Frisk Search', description: 'Frisk'},
      {code: '1-19', title: 'Search Incident to Arrest', description: 'SIA'},
      {code: '1-20', title: 'Law Enforcement Equipment', description: 'LE Equipment'},
      {code: '1-21', title: 'Ethics for Boarding Personnel', description: 'Ethics'},
      {code: '1-22', title: 'Chemical Irritant', description: 'OC Pepper Spray'},
      {code: '1-23', title: 'Boarding Procedures', description: 'Boarding Pro'},
      {code: '1-24', title: 'Found Weapon', description: 'Found Weapon'},
      {code: '1-25', title: 'Hostage Situation', description: 'Hostage Situation'},
      {code: '1-26', title: 'Seizing Property', description: 'Seizing Property'},
      {code: '1-27', title: 'Statement Writing', description: 'Statements'},
      {code: '1-28', title: 'Asylum Request', description: 'Asylum'},
      {code: '1-29', title: 'Radiation Detection Level 1 Initial Training', description: 'RAD 1'},
      {code: '2-01', title: 'Criminal Violations', description: 'Criminal Vios'},
      {code: '2-02', title: 'Firearms Related Offenses', description: 'Gun Laws'},
      {code: '2-03', title: 'Inspecting Vessel Requirements for Recreational Vessels', description: 'RBS Inspections'},
      {code: '2-04', title: 'Inspecting Vessel Requirements for Un-Inspected Commercial Vessels', description: 'UICV Inspections'},
      {code: '2-05', title: 'Inspecting Vessel Requirements for Commercial Fishing Industry Vessels', description: 'CFV Inspections'},
      {code: '2-06', title: 'Fraudulent Documents', description: 'Fraud Docs'},
      {code: '2-07', title: 'Vessel Search', description: 'Vessel Search'},
      {code: '2-08', title: 'Narcotics Identificaiton', description: 'Narcotics ID'},
      {code: '2-09', title: 'Arrest Procedures', description: 'Arrest'},
      {code: '2-10', title: 'Case File Preparation', description: 'App G Prep'},
      {code: '2-11', title: 'Required Reports', description: 'Reports'},
      {code: 'LE First Aid', title: 'First Aid Certification', description: 'First Aid'},
      {code: 'LE CPR', title: 'CPR Certification', description: 'CPR'},
      {code: 'HT-MT-B', title: 'Human Trafficking Awareness Training', description: 'Human Trafficking'},
      {code: 'AMIO-MOF-BRIEF', title: 'Manifestation of Fear', description: 'MOF'},
      {code: 'JUFE', title: 'Judgmental Use of Force Evaluation', description: 'JUFE'},
      {code: 'BUI', title: 'BUI Enforcement', description: 'BUI'},
      {code: 'RADLVL 1-D/E', title: 'Radiation Detection Level 1 Proficiency Drill', description: 'RAD 1 Drills'},
      {code: 'PQCI', title: 'FT&E Phase I - Pistol PQS', description: 'Phase I'},
      {code: 'PQCII', title: 'FT&E Phase II - Shooting Drills', description: 'Phase II'},
      {code: 'PQCIII', title: 'FT&E Phase III - Pistol Qualification Course', description: 'Phase III'},
      {code: 'PQCIV', title: 'FT&E Phase IV - Practical Scenario Evaluation', description: 'Phase IV'},
      {code: 'IQ-BO-LEQB', title: 'Unit BO Qualification Board', description: 'BO Board'},
      {code: 'IQ-BTM-LEQB', title: 'Unit BTM Qualification Board', description: 'BTM Board'},
      {code: 'IQ-STWATCH-LEQB', title: 'Unit ST Watch Qualificaiton Board', description: 'ST Watch Board'},
      {code: 'OPSBO', title: 'Graduate MLEA BO Course', description: 'MLEA Graduate'},
    ];

    for (let t of tasks) {
       await db.query(
        'INSERT INTO tasks (code, title, description) VALUES ($1, $2, $3)',
        [t.code, t.title, t.description]
      );
    }

    // Seed competencies
    const competencies = [
      { code: 'OPSBO', title: 'Boarding Officer', description: 'BO' },
      { code: 'BTM', title: 'Boarding Team Member', description: 'BTM' },
      { code: 'STWATCH', title: 'Security Team Watchstander', description: 'STWATCH' },
    ];

    for (let c of competencies) {
      await db.query(
        'INSERT INTO competencies (code, title, description) VALUES ($1, $2, $3)',
        [c.code, c.title, c.description]
      );
    }

    // Seed task_competency relationships
    const task_competency_links = [
      // BO Initial Tasks
      { task_id: 1, competency_id: 1, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-01
      { task_id: 41, competency_id: 1, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-LE FIRST AID
      { task_id: 42, competency_id: 1, certification_phase: 'initial', recurrence_type: 'permanent' },  // IQ-LE CPR
      { task_id: 43, competency_id: 1, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-HT-MT-B
      { task_id: 45, competency_id: 1, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-JUFE
      { task_id: 46, competency_id: 1, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-BUI
      { task_id: 48, competency_id: 1, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-PQCI
      { task_id: 49, competency_id: 1, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-PQCII
      { task_id: 50, competency_id: 1, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-PQCIII
      { task_id: 51, competency_id: 1, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-PQCIV
      { task_id: 52, competency_id: 1, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-BO-LEQB      
      { task_id: 55, competency_id: 1, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-OPSBO
      // BO Recurrent Tasks
      { task_id: 1, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // 1-01        
      { task_id: 2, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-02      
      { task_id: 3, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // 1-03
      { task_id: 4, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-04
      { task_id: 5, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-05
      { task_id: 6, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-06
      { task_id: 7, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-07
      { task_id: 8, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-08
      { task_id: 9, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-09
      { task_id: 10, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-10
      { task_id: 11, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-11
      { task_id: 12, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-12
      { task_id: 13, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-13
      { task_id: 14, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-14
      { task_id: 15, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-15
      { task_id: 16, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-16
      { task_id: 17, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-17
      { task_id: 18, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-18
      { task_id: 19, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-19
      { task_id: 20, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-20
      { task_id: 21, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-21
      { task_id: 22, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-22
      { task_id: 23, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-23
      { task_id: 24, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-24
      { task_id: 25, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-25
      { task_id: 26, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-26
      { task_id: 27, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-27
      { task_id: 28, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-28
      { task_id: 29, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-29
      { task_id: 30, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 2-01
      { task_id: 31, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 2-02
      { task_id: 32, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 2-03
      { task_id: 33, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 2-04
      { task_id: 34, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 2-05
      { task_id: 35, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 2-06
      { task_id: 36, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 2-07
      { task_id: 37, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 2-08
      { task_id: 38, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 2-09 
      { task_id: 39, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 2-10
      { task_id: 40, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 2-11      
      { task_id: 41, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'biennial' }, // LE FIRST AID     
      { task_id: 42, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'biennial' }, // LE CPR
      { task_id: 43, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // HT-MT-B
      { task_id: 45, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // JUFE
      { task_id: 46, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'annual' }, // BUI
      { task_id: 48, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // PQCI
      { task_id: 49, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // PQCII
      { task_id: 50, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // PQCIII
      { task_id: 51, competency_id: 1, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // PQCIV
      // BTM Initial Tasks
      { task_id: 1, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-01
      { task_id: 2, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-02
      { task_id: 3, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-03
      { task_id: 4, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-04
      { task_id: 5, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-05
      { task_id: 6, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-06
      { task_id: 7, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-07
      { task_id: 8, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-08
      { task_id: 9, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-09
      { task_id: 10, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-10
      { task_id: 11, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-11
      { task_id: 12, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-12
      { task_id: 13, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-13
      { task_id: 14, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-14
      { task_id: 15, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-15
      { task_id: 16, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-16      
      { task_id: 17, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-17
      { task_id: 18, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-18
      { task_id: 19, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-19
      { task_id: 20, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-20
      { task_id: 21, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-21
      { task_id: 22, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-22
      { task_id: 23, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-23
      { task_id: 24, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-24
      { task_id: 25, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-25
      { task_id: 26, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-26
      { task_id: 27, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-27
      { task_id: 28, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-28
      { task_id: 29, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-29
      { task_id: 41, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-LE FIRST AID
      { task_id: 42, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-LE CPR
      { task_id: 43, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-HT-MT-B
      { task_id: 45, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-JUFE      
      { task_id: 48, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-PQCI
      { task_id: 49, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-PQCII
      { task_id: 50, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-PQCIII
      { task_id: 51, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-PQCIV
      { task_id: 53, competency_id: 2, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-BTM-LEQB
      // BTM Recurrent Tasks
      { task_id: 1, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // 1-01        
      { task_id: 2, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-02      
      { task_id: 3, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // 1-03
      { task_id: 4, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-04
      { task_id: 5, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-05
      { task_id: 6, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-06
      { task_id: 7, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-07
      { task_id: 8, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-08
      { task_id: 9, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-09
      { task_id: 10, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-10
      { task_id: 11, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-11
      { task_id: 12, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-12
      { task_id: 13, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-13
      { task_id: 14, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-14
      { task_id: 15, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-15
      { task_id: 16, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-16
      { task_id: 17, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-17
      { task_id: 18, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-18
      { task_id: 19, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-19
      { task_id: 41, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'biennial' }, // LE FIRST AID     
      { task_id: 42, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'biennial' }, // LE CPR
      { task_id: 43, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'annual' }, // HT-MT-B
      { task_id: 45, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // JUFE
      { task_id: 48, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // PQCI
      { task_id: 49, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // PQCII
      { task_id: 50, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // PQCIII
      { task_id: 51, competency_id: 2, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // PQCIV
      // STWatch Initial Tasks
      { task_id: 1, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-01
      { task_id: 3, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-03
      { task_id: 4, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-04
      { task_id: 5, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-05
      { task_id: 6, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-06
      { task_id: 7, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-07
      { task_id: 8, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-08
      { task_id: 9, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-09
      { task_id: 10, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-10
      { task_id: 17, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-17
      { task_id: 18, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-18
      { task_id: 20, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-20
      { task_id: 22, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-1-22
      { task_id: 43, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-HT-MT-B
      { task_id: 44, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-AMIO BRIEF
      { task_id: 55, competency_id: 3, certification_phase: 'initial', recurrence_type: 'permanent' }, // IQ-STWATCH-LEQB
      // STWatch Recurrent Tasks
      { task_id: 1, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // 1-01
      { task_id: 3, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'semiannual' }, // 1-03
      { task_id: 4, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-04
      { task_id: 5, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-05
      { task_id: 6, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-06
      { task_id: 7, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-07
      { task_id: 8, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-08
      { task_id: 9, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-09
      { task_id: 10, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-10
      { task_id: 17, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-17
      { task_id: 18, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'annual' }, // 1-18
      { task_id: 43, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'annual' }, // HT-MT-B
      { task_id: 44, competency_id: 3, certification_phase: 'recurrent', recurrence_type: 'annual' } // AMIO BRIEF
    ];

    for (let tcl of task_competency_links) {
      await db.query(
        'INSERT INTO task_competency_links (task_id, competency_id, certification_phase, recurrence_type) VALUES ($1, $2, $3, $4)',
        [tcl.task_id, tcl.competency_id, tcl.certification_phase, tcl.recurrence_type]
      );
    }

    console.log('✅ Seed complete!');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  } finally {
    db.end(); // Close DB connection
  }
}

seed();
