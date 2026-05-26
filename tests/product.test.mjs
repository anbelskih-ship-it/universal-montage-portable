import assert from 'node:assert/strict';
import { parseCsv, toCsv } from '../src/csv.js';
import {
  buildWorkGuide,
  createProgress,
  createSummary,
  normalizeRequest,
  suggestChecklist
} from '../src/domain.js';

const sourceRows = [
  { id: 'UM-001', client: 'ООО Альфа', object: 'Склад', workType: 'Оклады на окна', status: 'В работе', amount: 120000, dueDate: '2026-06-10', contact: '+7 900 000-00-00', notes: 'Монтажные работы' },
  { id: 'UM-002', client: 'ИП Бета', object: 'Офис', workType: 'Сервис/исправление', status: 'Оплачена', amount: 45000, dueDate: '2026-06-03', contact: '+7 911 111-11-11', notes: 'Сервис' }
];

const csv = toCsv(sourceRows);
assert.match(csv, /id,client,object,workType,status,amount,dueDate,contact,notes/);
assert.match(csv, /ООО Альфа/);

const parsed = parseCsv(csv);
assert.equal(parsed.length, 2);
assert.equal(parsed[0].client, 'ООО Альфа');
assert.equal(parsed[1].amount, 45000);

const normalized = normalizeRequest({ client: '  Клиент  ', amount: '15000', status: '' });
assert.equal(normalized.client, 'Клиент');
assert.equal(normalized.amount, 15000);
assert.equal(normalized.status, 'Новая');
assert.equal(normalized.workType, 'Общие монтажные работы');
assert.ok(normalized.id.startsWith('UM-'));

const summary = createSummary(sourceRows);
assert.equal(summary.total, 2);
assert.equal(summary.totalAmount, 165000);
assert.equal(summary.byStatus['В работе'], 1);
assert.equal(summary.byStatus['Оплачена'], 1);
assert.equal(summary.byWorkType['Оклады на окна'], 1);
assert.equal(summary.serviceCount, 1);

const checklist = suggestChecklist({ workType: 'Оклады на окна', notes: 'косой дождь и уклон' });
assert.ok(checklist.some((item) => item.includes('уклон')));
assert.ok(checklist.some((item) => item.includes('косого дождя')));

const guide = buildWorkGuide({
  workType: 'Оклады на окна',
  width: 1.4,
  height: 1.2,
  quantity: 3,
  seamLength: 10,
  flags: {
    outdoor: true,
    slope: true,
    rainRisk: true,
    paint: false,
    leak: false,
    dismantling: true
  }
});
assert.equal(guide.title, 'Оклады на окна');
assert.equal(guide.calculations.perimeter, 15.6);
assert.equal(guide.materials.some((item) => item.name === 'Листовой металл'), true);
assert.equal(guide.materials.some((item) => item.name === 'Герметик'), true);
assert.equal(guide.steps.some((step) => step.text.includes('косой дождь')), true);
assert.equal(guide.steps.some((step) => step.text.includes('демонтаж')), true);

const progress = createProgress(guide.steps, [guide.steps[0].id, guide.steps[1].id]);
assert.equal(progress.done, 2);
assert.equal(progress.total, guide.steps.length);
assert.equal(progress.percent, Math.round(2 / guide.steps.length * 100));

console.log('product tests passed');
