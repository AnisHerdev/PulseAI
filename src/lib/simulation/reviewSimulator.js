/**
 * reviewSimulator.js
 *
 * Generates simulated patient reviews at realistic intervals.
 * - 1 review every ~12 seconds
 * - Burst of 2-3 reviews every ~60 seconds
 * - Rolling window of max 100 reviews
 * - Rating distribution: 5★=35%, 4★=35%, 3★=15%, 2★=10%, 1★=5%
 */

// ── Rating distribution (cumulative thresholds) ─────────────────────────────
// rand < 0.05 → 1★, < 0.15 → 2★, < 0.30 → 3★, < 0.65 → 4★, else 5★
function pickRating() {
  const r = Math.random();
  if (r < 0.05) return 1;
  if (r < 0.15) return 2;
  if (r < 0.30) return 3;
  if (r < 0.65) return 4;
  return 5;
}

// ── Departments matching the dashboard ───────────────────────────────────────
const DEPARTMENTS = ['Cardiology', 'Orthopedics', 'Oncology', 'Surgery', 'Emergency', 'General Medicine', 'Pediatrics', 'Radiology'];

const VISIT_TYPES = ['Outpatient', 'Inpatient', 'Emergency', 'Day Surgery', 'Follow-up', 'Consultation'];

// ── Feedback templates by rating tier ────────────────────────────────────────

const POSITIVE_FEEDBACK = [
  'Excellent care from the entire team. Dr. {doctor} was very thorough and took the time to explain everything clearly.',
  'I was impressed by the professionalism. The nursing staff, especially {nurse}, made me feel comfortable throughout.',
  'Very smooth experience from registration to discharge. The {department} team is outstanding.',
  'Dr. {doctor} provided exceptional care. The follow-up instructions were clear and the staff was attentive.',
  'The {department} department exceeded my expectations. Clean facilities and caring staff.',
  'Had a wonderful experience at {department}. Dr. {doctor} was knowledgeable and compassionate.',
  'Everything went smoothly. {nurse} in {department} was incredibly helpful and kind.',
  'Top-notch medical care. The team in {department} was professional and efficient.',
  'Very satisfied with my visit. Dr. {doctor} listened carefully and addressed all my concerns.',
  'Great experience overall. The wait was minimal and the staff was very organized.',
  'Highly recommend the {department} department. The care I received from Dr. {doctor} was excellent.',
  'The entire process was efficient and well-coordinated. {nurse} deserves special recognition.',
];

const MID_FEEDBACK = [
  'The care was okay but the wait time in {department} was over an hour. Staff seemed busy.',
  'Dr. {doctor} was competent but seemed rushed during the consultation. Average experience.',
  'Mixed experience. The medical treatment was fine but the billing process was confusing.',
  'The {department} department was adequate. However, communication about wait times could be improved.',
  'Treatment was effective but I had to ask multiple times for updates on my results.',
  'Decent care but the discharge process took too long. Could be more streamlined.',
  'The medical staff was professional but the facilities in {department} need updating.',
  'Appointment started late. Dr. {doctor} was knowledgeable but the overall experience was average.',
];

const NEGATIVE_FEEDBACK = [
  'Very long wait time at {department}. Had to wait over 2 hours before being seen. Very frustrating.',
  'Poor communication from the {department} staff. Nobody explained what was happening with my treatment plan.',
  'The billing department made errors on my invoice. Had to call multiple times to get it corrected.',
  'Disappointing experience. The {department} waiting area was crowded and uncomfortable. Staff seemed overwhelmed.',
  'Dr. {doctor} barely spent 5 minutes with me. Did not feel heard. Would not recommend.',
  'The discharge process was a nightmare. Waited over 3 hours for paperwork. Unacceptable.',
  'Had issues with appointment scheduling. Called three times and was put on hold each time.',
  'Facility cleanliness in {department} was below expectations. The restrooms needed attention.',
  'My follow-up results were delayed by a week. No one reached out to explain the delay.',
  'Staff at {department} reception was rude and unhelpful. The experience left me very dissatisfied.',
];

// ── Doctor/nurse names for template interpolation ────────────────────────────
const DOCTOR_NAMES = [
  'Dr. Ananya Sharma', 'Dr. Rajesh Patel', 'Dr. Emily Chen', 'Dr. Michael Rodriguez',
  'Dr. Priya Nair', 'Dr. James Wilson', 'Dr. Fatima Khan', 'Dr. David Lee',
  'Dr. Sunita Reddy', 'Dr. Robert Taylor', 'Dr. Kavitha Iyer', 'Dr. Sarah Mitchell',
];

const NURSE_NAMES = [
  'Nurse Meera', 'Nurse Johnson', 'Nurse Deepa', 'Nurse Williams',
  'Nurse Lakshmi', 'Nurse Thompson', 'Nurse Rekha', 'Nurse Anderson',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

let _reviewId = 0;

function fillTemplate(template, department) {
  return template
    .replace(/\{doctor\}/g, pick(DOCTOR_NAMES))
    .replace(/\{nurse\}/g, pick(NURSE_NAMES))
    .replace(/\{department\}/g, department);
}

/**
 * Generate a single simulated review.
 */
export function generateReview() {
  const rating = pickRating();
  const department = pick(DEPARTMENTS);
  const visitType = pick(VISIT_TYPES);

  let feedbackPool;
  if (rating >= 4) feedbackPool = POSITIVE_FEEDBACK;
  else if (rating === 3) feedbackPool = MID_FEEDBACK;
  else feedbackPool = NEGATIVE_FEEDBACK;

  const feedbackText = fillTemplate(pick(feedbackPool), department);

  _reviewId += 1;

  return {
    id: `rev-${Date.now()}-${_reviewId}`,
    timestamp: new Date().toISOString(),
    rating,
    department,
    visit_type: visitType,
    feedback_text: feedbackText,
  };
}

/**
 * Generate a burst of reviews (2–3).
 */
export function generateBurst() {
  const count = 2 + Math.floor(Math.random() * 2); // 2 or 3
  return Array.from({ length: count }, () => generateReview());
}

/**
 * Maintains a rolling window of reviews (max windowSize).
 * Returns the updated array with the new review(s) prepended.
 */
export function addToWindow(existingReviews, newReviews, windowSize = 100) {
  const combined = [...newReviews, ...existingReviews];
  return combined.slice(0, windowSize);
}

/**
 * Split reviews into { lowMid, high }.
 * lowMid: rating <= 3
 * high: rating >= 4
 */
export function splitReviews(reviews) {
  const lowMid = reviews.filter((r) => r.rating <= 3);
  const high = reviews.filter((r) => r.rating >= 4);
  return { lowMid, high };
}

/**
 * Compute aggregate stats from a review list.
 */
export function computeAggregates(reviews) {
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const departmentCounts = {};

  for (const r of reviews) {
    ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
    departmentCounts[r.department] = (departmentCounts[r.department] || 0) + 1;
  }

  const totalRating = reviews.reduce((s, r) => s + r.rating, 0);
  const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  return {
    totalReviews: reviews.length,
    averageRating: parseFloat(avgRating.toFixed(2)),
    ratingCounts,
    departmentCounts,
  };
}
