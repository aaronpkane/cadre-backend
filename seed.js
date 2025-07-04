const db = require('./db');

const seed = async () => {
    try {
    console.log('🌱 Starting seed...');

    // Clear old data (if needed)
    await db.query('TRUNCATE members RESTART IDENTITY CASCADE');

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
      {code: 'IQ-BTM-LEQB', title: 'Unit BTM Qualification Board', description: 'BTM Board'},
      {code: 'IQ-BO-LEQB', title: 'Unit BO Qualification Board', description: 'BO Board'},
      {code: 'STWATCH-LEQB', title: 'Unit ST Watch Qualificaiton Board', description: 'ST Watch Board'},
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

    console.log('✅ Seed complete!');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  } finally {
    db.end(); // Close DB connection
  }
}

seed();
