/**
 * staffIndex.js
 *
 * In-memory staff roster used for mention matching against patient reviews.
 * Departments align with those used in the dashboard and review simulator.
 *
 * Each record: { id, name, role, department, aliases }
 */

export const STAFF_INDEX = [
  // ── Cardiology ──
  {
    id: 'staff-001',
    name: 'Dr. Ananya Sharma',
    role: 'Cardiologist',
    department: 'Cardiology',
    aliases: ['Ananya', 'Dr Sharma', 'Sharma'],
  },
  {
    id: 'staff-002',
    name: 'Dr. Rajesh Patel',
    role: 'Cardiac Surgeon',
    department: 'Cardiology',
    aliases: ['Rajesh', 'Dr Patel', 'Patel'],
  },

  // ── Orthopedics ──
  {
    id: 'staff-003',
    name: 'Dr. Emily Chen',
    role: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    aliases: ['Emily', 'Dr Chen', 'Chen'],
  },
  {
    id: 'staff-004',
    name: 'Dr. Michael Rodriguez',
    role: 'Sports Medicine',
    department: 'Orthopedics',
    aliases: ['Michael', 'Dr Rodriguez', 'Rodriguez'],
  },

  // ── Oncology ──
  {
    id: 'staff-005',
    name: 'Dr. Priya Nair',
    role: 'Oncologist',
    department: 'Oncology',
    aliases: ['Priya', 'Dr Nair', 'Nair'],
  },

  // ── Surgery ──
  {
    id: 'staff-006',
    name: 'Dr. James Wilson',
    role: 'General Surgeon',
    department: 'Surgery',
    aliases: ['James', 'Dr Wilson', 'Wilson'],
  },
  {
    id: 'staff-007',
    name: 'Dr. Fatima Khan',
    role: 'Surgical Specialist',
    department: 'Surgery',
    aliases: ['Fatima', 'Dr Khan', 'Khan'],
  },

  // ── Emergency ──
  {
    id: 'staff-008',
    name: 'Dr. David Lee',
    role: 'Emergency Physician',
    department: 'Emergency',
    aliases: ['David', 'Dr Lee', 'Lee'],
  },

  // ── General Medicine ──
  {
    id: 'staff-009',
    name: 'Dr. Sunita Reddy',
    role: 'Internal Medicine',
    department: 'General Medicine',
    aliases: ['Sunita', 'Dr Reddy', 'Reddy'],
  },
  {
    id: 'staff-010',
    name: 'Dr. Robert Taylor',
    role: 'General Practitioner',
    department: 'General Medicine',
    aliases: ['Robert', 'Dr Taylor', 'Taylor'],
  },

  // ── Pediatrics ──
  {
    id: 'staff-011',
    name: 'Dr. Kavitha Iyer',
    role: 'Pediatrician',
    department: 'Pediatrics',
    aliases: ['Kavitha', 'Dr Iyer', 'Iyer'],
  },

  // ── Radiology ──
  {
    id: 'staff-012',
    name: 'Dr. Sarah Mitchell',
    role: 'Radiologist',
    department: 'Radiology',
    aliases: ['Sarah', 'Dr Mitchell', 'Mitchell'],
  },

  // ── Nursing Staff ──
  {
    id: 'staff-013',
    name: 'Nurse Meera',
    role: 'Head Nurse',
    department: 'General Medicine',
    aliases: ['Meera'],
  },
  {
    id: 'staff-014',
    name: 'Nurse Deepa',
    role: 'ICU Nurse',
    department: 'Cardiology',
    aliases: ['Deepa'],
  },
  {
    id: 'staff-015',
    name: 'Nurse Lakshmi',
    role: 'Ward Nurse',
    department: 'Oncology',
    aliases: ['Lakshmi'],
  },
  {
    id: 'staff-016',
    name: 'Nurse Rekha',
    role: 'ER Nurse',
    department: 'Emergency',
    aliases: ['Rekha'],
  },
  {
    id: 'staff-017',
    name: 'Nurse Johnson',
    role: 'Surgical Nurse',
    department: 'Surgery',
    aliases: ['Johnson'],
  },
  {
    id: 'staff-018',
    name: 'Nurse Williams',
    role: 'Pediatric Nurse',
    department: 'Pediatrics',
    aliases: ['Williams'],
  },
  {
    id: 'staff-019',
    name: 'Nurse Thompson',
    role: 'Orthopedic Nurse',
    department: 'Orthopedics',
    aliases: ['Thompson'],
  },
  {
    id: 'staff-020',
    name: 'Nurse Anderson',
    role: 'Radiology Technician',
    department: 'Radiology',
    aliases: ['Anderson'],
  },
];
