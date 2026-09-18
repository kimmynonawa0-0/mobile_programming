import test from 'node:test';
import assert from 'node:assert/strict';
import { newExercise, finishSession, summarize } from './workouts.js';

function draft() {
  return { id: 'session', name: '  Morning session  ', startedAt: '2026-09-19T08:00:00Z', exercises: [newExercise('Push-ups'), newExercise('Squats')] };
}
const end = new Date('2026-09-19T08:12:00Z');
test('requires a completed set', () => {
  assert.throws(() => finishSession(draft(), end), /at least one/);
});
test('saves only completed sets, preserves draft, and totals sessions', () => {
  const workout = draft();
  Object.assign(workout.exercises[0].sets[0], { done: true, reps: '12', weight: '2.5' });
  const snapshot = JSON.stringify(workout);
  const result = finishSession(workout, end);
  assert.equal(result.name, 'Morning session');
  assert.equal(result.exercises.length, 1);
  assert.equal(result.exercises[0].sets.length, 1);
  assert.equal(result.exercises[0].sets[0].weight, 2.5);
  assert.deepEqual(summarize([result]), { sets: 1, reps: 12, minutes: 12 });
  assert.equal(JSON.stringify(workout), snapshot);
});
test('rejects invalid reps and weight without modifying the draft', () => {
  for (const reps of ['0', '-1', '1.5', '', 'abc', '10000']) {
    const workout = draft();
    Object.assign(workout.exercises[0].sets[0], { done: true, reps });
    assert.throws(() => finishSession(workout, end), /whole-number reps/);
  }
  for (const weight of ['-1', 'abc', 'Infinity', '10000']) {
    const workout = draft();
    Object.assign(workout.exercises[0].sets[0], { done: true, weight });
    assert.throws(() => finishSession(workout, end), /weight/);
  }
});
test('uses defaults for unnamed bodyweight workouts and distinct exercise IDs', () => {
  const workout = draft(); workout.name = ' ';
  workout.exercises[0].sets[0].done = true;
  const result = finishSession(workout, end);
  assert.equal(result.name, 'Daily workout');
  assert.equal(result.exercises[0].sets[0].weight, 0);
  assert.notEqual(workout.exercises[0].id, workout.exercises[1].id);
  assert.deepEqual(summarize([]), { sets: 0, reps: 0, minutes: 0 });
});
