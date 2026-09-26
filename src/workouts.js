import { exerciseCatalog } from './exerciseCatalog.js';
export const exercises = exerciseCatalog.map(exercise => exercise.name);
let counter = 0;
export function newExercise(name) {
  const id = `${Date.now()}-${counter++}`;
  return { id, name, sets: [1, 2, 3].map(n => ({ id: `${id}-${n}`, reps: '10', weight: '', done: false })) };
}
export function summarize(sessions) {
  return sessions.reduce((total, session) => {
    total.minutes += session.durationMinutes;
    session.exercises.forEach(e => e.sets.forEach(set => { total.sets++; total.reps += Number(set.reps); }));
    return total;
  }, { sets: 0, reps: 0, minutes: 0 });
}
export function finishSession(draft, now = new Date()) {
  const completed = draft.exercises.map(e => ({ ...e, sets: e.sets.filter(s => s.done).map(s => ({ ...s })) })).filter(e => e.sets.length);
  if (!completed.length) throw new Error('Check off at least one completed set before saving.');
  for (const exercise of completed) {
    for (const set of exercise.sets) {
      if (!/^\d+$/.test(set.reps) || Number(set.reps) < 1 || Number(set.reps) > 9999) throw new Error(`${exercise.name}: enter whole-number reps between 1 and 9999.`);
      if (set.weight !== '' && (!/^\d+(\.\d+)?$/.test(set.weight) || Number(set.weight) > 9999)) throw new Error(`${exercise.name}: enter a weight from 0 to 9999 kg, or leave it blank.`);
      set.reps = Number(set.reps); set.weight = Number(set.weight);
    }
  }
  return { ...draft, name: draft.name.trim() || 'Daily workout', exercises: completed, finishedAt: now.toISOString(), durationMinutes: Math.max(1, Math.round((now - new Date(draft.startedAt)) / 60000)) };
}
