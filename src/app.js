import { parseCsv, downloadCsv } from './csv.js';
import {
  DEFAULT_REQUESTS,
  DEFAULT_SETTINGS,
  WORK_TYPES,
  buildWorkGuide,
  createId,
  createProgress,
  filterRequests,
  formatMoney,
  normalizeRequest
} from './domain.js';
import { buildTelegramUrl, buildWebsiteUrl, sendToExternalApi } from './integrations.js';

const REQUESTS_KEY = 'universal-montage.requests.v3';
const SETTINGS_KEY = 'universal-montage.settings.v1';
const COMPLETED_KEY = 'universal-montage.completed.v1';

const state = {
  requests: loadJson(REQUESTS_KEY, DEFAULT_REQUESTS),
  settings: loadJson(SETTINGS_KEY, DEFAULT_SETTINGS),
  completed: new Set(loadJson(COMPLETED_KEY, [])),
  query: '',
  guide: null
};

const el = {
  form: document.querySelector('#guide-form'),
  settingsForm: document.querySelector('#settings-form'),
  workType: document.querySelector('#work-type'),
  guideTitle: document.querySelector('#guide-title'),
  guideSteps: document.querySelector('#guide-steps'),
  progressLabel: document.querySelector('#progress-label'),
  progressCount: document.querySelector('#progress-count'),
  progressFill: document.querySelector('#progress-fill'),
  calcGrid: document.querySelector('#calc-grid'),
  materials: document.querySelector('#materials'),
  risks: document.querySelector('#risks'),
  rows: document.querySelector('#request-rows'),
  empty: document.querySelector('#empty-state'),
  search: document.querySelector('#search'),
  importFile: document.querySelector('#import-file'),
  exportButton: document.querySelector('#export-csv'),
  saveTask: document.querySelector('#save-task'),
  exportSheet: document.querySelector('#export-sheet'),
  newTask: document.querySelector('#new-task'),
  integrationStatus: document.querySelector('#integration-status'),
  websiteLink: document.querySelector('#website-link'),
  telegramLink: document.querySelector('#telegram-link'),
  apiButton: document.querySelector('#api-test')
};

function readForm(form) {
  const data = {};
  for (const field of Array.from(form.elements)) {
    if (!field.name) continue;
    data[field.name] = field.type === 'checkbox' ? field.checked : field.value;
  }
  return data;
}

function readTaskInput() {
  const data = readForm(el.form);
  return {
    ...data,
    width: Number(data.width || 0),
    height: Number(data.height || 0),
    length: Number(data.length || 0),
    quantity: Number(data.quantity || 1),
    seamLength: Number(data.seamLength || 0),
    flags: {
      outdoor: Boolean(data.outdoor),
      slope: Boolean(data.slope),
      rainRisk: Boolean(data.rainRisk),
      leak: Boolean(data.leak),
      dismantling: Boolean(data.dismantling),
      paint: Boolean(data.paint)
    }
  };
}

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function save() {
  try {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(state.requests));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
    localStorage.setItem(COMPLETED_KEY, JSON.stringify([...state.completed]));
  } catch {
    // Some locked-down file:// environments disable localStorage.
  }
}

function init() {
  el.workType.innerHTML = WORK_TYPES.map((type) => `<option>${type}</option>`).join('');
  el.workType.value = 'Оклады на окна';
  fillSettingsForm();
  bindEvents();
  renderGuide();
  renderTable();
  renderIntegrations();
}

function bindEvents() {
  el.form.addEventListener('input', renderGuide);
  el.form.addEventListener('change', renderGuide);

  el.guideSteps.addEventListener('change', (event) => {
    const checkbox = event.target.closest('input[type="checkbox"][data-step]');
    if (!checkbox) return;
    if (checkbox.checked) {
      state.completed.add(checkbox.dataset.step);
    } else {
      state.completed.delete(checkbox.dataset.step);
    }
    save();
    renderProgress();
  });

  el.saveTask.addEventListener('click', () => {
    const input = readTaskInput();
    const progress = createProgress(state.guide.steps, [...state.completed]);
    const request = normalizeRequest({
      id: createId('TASK'),
      client: input.client || 'Без клиента',
      object: input.object || 'Без объекта',
      workType: input.workType,
      status: progress.percent === 100 ? 'Выполнена' : 'В работе',
      amount: 0,
      notes: `${progress.percent}% - ${input.notes || 'лист задания'}`
    });
    state.requests.unshift(request);
    save();
    renderTable();
  });

  el.exportSheet.addEventListener('click', () => {
    downloadCsv('universal-montage-work-sheet.csv', [createSheetRow()]);
  });

  el.newTask.addEventListener('click', () => {
    el.form.reset();
    el.workType.value = 'Оклады на окна';
    el.form.elements.width.value = '1.4';
    el.form.elements.height.value = '1.2';
    el.form.elements.quantity.value = '1';
    el.form.elements.outdoor.checked = true;
    state.completed = new Set();
    save();
    renderGuide();
  });

  el.settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    state.settings = { ...state.settings, ...readForm(el.settingsForm) };
    save();
    renderIntegrations();
    showIntegrationStatus('Настройки сохранены.');
  });

  el.search.addEventListener('input', (event) => {
    state.query = event.target.value;
    renderTable();
  });

  el.exportButton.addEventListener('click', () => {
    downloadCsv('universal-montage-tasks.csv', state.requests);
  });

  el.importFile.addEventListener('change', async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    const text = await file.text();
    state.requests = parseCsv(text).map(normalizeRequest);
    save();
    renderTable();
    event.target.value = '';
  });

  el.apiButton.addEventListener('click', async () => {
    const result = await sendToExternalApi(state.settings, { guide: state.guide, settings: state.settings });
    showIntegrationStatus(result.message);
  });
}

function renderGuide() {
  state.guide = buildWorkGuide(readTaskInput());
  state.completed = new Set([...state.completed].filter((id) => state.guide.steps.some((step) => step.id === id)));
  el.guideTitle.textContent = state.guide.title;
  el.guideSteps.innerHTML = state.guide.steps.map((step) => `
    <li>
      <label>
        <input type="checkbox" data-step="${step.id}" ${state.completed.has(step.id) ? 'checked' : ''}>
        <span>${escapeHtml(step.text)}</span>
      </label>
    </li>
  `).join('');
  renderCalculations();
  renderProgress();
}

function renderProgress() {
  const progress = createProgress(state.guide.steps, [...state.completed]);
  el.progressLabel.textContent = `${progress.percent}%`;
  el.progressCount.textContent = `${progress.done}/${progress.total}`;
  el.progressFill.style.width = `${progress.percent}%`;
}

function renderCalculations() {
  const calc = state.guide.calculations;
  el.calcGrid.innerHTML = [
    ['Площадь', `${calc.area} м2`],
    ['Периметр', `${calc.perimeter} м`],
    ['Длина', `${calc.length} м`],
    ['Герметик', `${calc.sealant} тубы`],
    ['Грунт', `${calc.primer} л`],
    ['Краска', `${calc.paint} л`],
    ['Кронштейны', `${calc.brackets} шт`]
  ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');

  el.materials.innerHTML = state.guide.materials.map((item) => (
    `<li><span>${escapeHtml(item.name)}</span><strong>${escapeHtml(item.value)} ${escapeHtml(item.unit)}</strong></li>`
  )).join('');
  el.risks.innerHTML = state.guide.risks.length
    ? state.guide.risks.map((risk) => `<li>${escapeHtml(risk)}</li>`).join('')
    : '<li>особых рисков не отмечено</li>';
}

function renderTable() {
  const rows = filterRequests(state.requests, state.query, 'Все');
  el.empty.hidden = rows.length > 0;
  el.rows.innerHTML = rows.map((request) => `
    <tr>
      <td><strong>${escapeHtml(request.id)}</strong><small>${escapeHtml(request.dueDate || 'сохранено')}</small></td>
      <td>${escapeHtml(request.client)}<small>${escapeHtml(request.contact || '')}</small></td>
      <td>${escapeHtml(request.object)}</td>
      <td>${escapeHtml(request.workType || 'Общие монтажные работы')}</td>
      <td><span class="status">${escapeHtml(request.status)}</span></td>
      <td>${escapeHtml(request.notes)}</td>
    </tr>
  `).join('');
}

function createSheetRow() {
  const input = readTaskInput();
  const progress = createProgress(state.guide.steps, [...state.completed]);
  return {
    id: createId('SHEET'),
    client: input.client || '',
    object: input.object || '',
    workType: input.workType,
    status: `${progress.percent}%`,
    amount: 0,
    dueDate: '',
    contact: '',
    notes: [
      input.notes || '',
      `Материалы: ${state.guide.materials.map((item) => `${item.name} ${item.value} ${item.unit}`).join('; ')}`,
      `Шаги: ${state.guide.steps.map((step) => step.text).join('; ')}`
    ].filter(Boolean).join(' | ')
  };
}

function fillSettingsForm() {
  for (const [key, value] of Object.entries(state.settings)) {
    const input = el.settingsForm.elements[key];
    if (input) input.value = value;
  }
}

function renderIntegrations() {
  el.websiteLink.href = buildWebsiteUrl(state.settings);
  el.telegramLink.href = buildTelegramUrl(state.settings);
}

function showIntegrationStatus(message) {
  el.integrationStatus.textContent = message;
  window.setTimeout(() => {
    el.integrationStatus.textContent = '';
  }, 4500);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[char]));
}

try {
  init();
} catch (error) {
  console.error(error);
  const guideSteps = document.querySelector('#guide-steps');
  if (guideSteps) {
    guideSteps.innerHTML = '<li><label><input type="checkbox"><span>Открыть файл UniversalMontage-WorkGuide.html из этой же папки</span></label></li>';
  }
}
