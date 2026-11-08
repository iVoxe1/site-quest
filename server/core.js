import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
export function hashPassword(password) { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`; }
export function verifyPassword(password, hash) { try { const [salt, key] = hash.split(':'); return timingSafeEqual(Buffer.from(key, 'hex'), scryptSync(password, salt, 64)); } catch { return false; } }
export function validateQuestions(questions) {
  if (!Array.isArray(questions) || questions.length < 1 || questions.length > 30) throw new Error('Provide between 1 and 30 questions.');
  return questions.map(q => {
    if (typeof q.prompt !== 'string' || !q.prompt.trim() || q.prompt.length > 2000 || !Array.isArray(q.options) || q.options.length !== 4 || q.options.some(o => typeof o !== 'string' || !o.trim() || o.length > 1000) || !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) throw new Error('Each question needs a prompt, four options, and a correct answer.');
    return { prompt: q.prompt.trim(), options: q.options.map(o => o.trim()), answer: q.answer };
  });
}
export function grade(questions, answers) { return questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0); }
export function practiceQuestions(text, count = 5) {
  const sentences = text.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).filter(s => s.length > 35 && s.length < 500);
  const words = [...new Set((text.match(/[A-Za-z][A-Za-z-]{4,}/g) || []))];
  const questions = [];
  for (const sentence of sentences) {
    const candidates = sentence.match(/[A-Za-z][A-Za-z-]{4,}/g) || [];
    const word = candidates.sort((a,b) => b.length - a.length)[0];
    if (!word || words.filter(w => w.toLowerCase() !== word.toLowerCase()).length < 3) continue;
    const options = [word, ...words.filter(w => w.toLowerCase() !== word.toLowerCase()).sort(() => Math.random() - .5).slice(0,3)].sort(() => Math.random() - .5);
    questions.push({ prompt: 'Complete the statement: ' + sentence.replace(word, '________'), options, answer: options.indexOf(word) });
    if (questions.length >= count) break;
  }
  if (!questions.length) throw new Error('Add a few complete paragraphs with at least four distinct words to generate practice questions.');
  return questions;
}
