/* Generated portable bundle for direct file:// launch. */

(function () {

const HEADERS = ['id', 'client', 'object', 'workType', 'status', 'amount', 'dueDate', 'contact', 'notes'];

function escapeCell(value) {
  const text = String(value ?? '');
  if (/[",\n;]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function splitCsvLine(line) {
  const cells = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }

  cells.push(cell);
  return cells;
}

function toCsv(rows) {
  const lines = [HEADERS.join(',')];
  for (const row of rows) {
    lines.push(HEADERS.map((header) => escapeCell(row[header])).join(','));
  }
  return lines.join('\n');
}

function parseCsv(text) {
  const lines = String(text || '').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];

  const headers = splitCsvLine(lines[0]).map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      const value = cells[index] ?? '';
      row[header] = header === 'amount' ? Number(value || 0) : value;
    });
    return row;
  });
}

function downloadCsv(filename, rows) {
  const csv = `\uFEFF${toCsv(rows)}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}


const STATUSES = ['Новая', 'В работе', 'Выполнена', 'Оплачена', 'Отложена'];

const WORK_TYPES = [
  'Общие монтажные работы',
  'Сварочные работы',
  'Жестяные работы',
  'Оклады на окна',
  'Гидроизоляция',
  'Водосточная система',
  'Сервис/исправление'
];

const WORK_TEMPLATES = {
  'Оклады на окна': {
    defaults: { waste: 1.15, metalUnit: 'м2', sealantPerMeter: 0.12 },
    baseSteps: [
      'Проверить размеры проема и записать фактические замеры',
      'Проверить уклон, примыкания и направление стока',
      'Подготовить металл, крепеж и герметик',
      'Согласовать места крепления и внешний вид',
      'Смонтировать оклады без обратного уклона',
      'Загерметизировать примыкания',
      'Сделать фото узлов до и после',
      'Проверить, что вода не попадает под конструкцию'
    ]
  },
  'Гидроизоляция': {
    defaults: { waste: 1.1, primerPerM2: 0.25, sealantPerMeter: 0.15 },
    baseSteps: [
      'Осмотреть основание и отметить места риска',
      'Очистить и высушить рабочую поверхность',
      'Проверить примыкания, углы и вводы',
      'Нанести грунт при необходимости',
      'Выполнить гидроизоляционный слой',
      'Проверить непрерывность слоя',
      'Сделать фото скрытых участков до закрытия',
      'Назначить контроль после дождя при риске протечки'
    ]
  },
  'Водосточная система': {
    defaults: { bracketStep: 0.6, waste: 1.05 },
    baseSteps: [
      'Проверить длину участка и точки слива',
      'Разметить кронштейны с правильным уклоном',
      'Подготовить желоба, трубы, крепеж и соединители',
      'Смонтировать кронштейны',
      'Установить желоба и соединения',
      'Проверить направление слива',
      'Пролить водой тестовый участок',
      'Сделать фото результата'
    ]
  },
  'Сварочные работы': {
    defaults: { paintPerM2: 0.18, primerPerM2: 0.16, waste: 1.08 },
    baseSteps: [
      'Сверить размеры и точки крепления',
      'Проверить доступ к месту сварки',
      'Подготовить профиль, расходники и защиту',
      'Собрать конструкцию по размерам',
      'Проварить узлы',
      'Зачистить швы',
      'Загрунтовать при необходимости',
      'Покрасить после высыхания грунта'
    ]
  },
  'Жестяные работы': {
    defaults: { waste: 1.15, sealantPerMeter: 0.1 },
    baseSteps: [
      'Снять размеры и проверить геометрию места',
      'Проверить уклоны и примыкания',
      'Подготовить листовой металл и крепеж',
      'Выполнить раскрой с запасом',
      'Смонтировать детали без обратного уклона',
      'Проверить стыки и герметизацию',
      'Сделать фото узлов',
      'Проверить внешний вид с заказчиком'
    ]
  },
  'Сервис/исправление': {
    defaults: { sealantPerMeter: 0.12, waste: 1 },
    baseSteps: [
      'Зафиксировать жалобу и условия проявления проблемы',
      'Осмотреть узел и найти причину',
      'Сделать фото до исправления',
      'Согласовать способ исправления',
      'Устранить причину',
      'Проверить результат',
      'Сделать фото после исправления',
      'Получить подтверждение заказчика'
    ]
  },
  'Общие монтажные работы': {
    defaults: { waste: 1.1 },
    baseSteps: [
      'Зафиксировать задачу и размеры',
      'Проверить доступ и ограничения на объекте',
      'Подготовить материалы и инструмент',
      'Согласовать порядок работ',
      'Выполнить монтаж',
      'Проверить качество креплений',
      'Сделать фото результата',
      'Передать результат заказчику'
    ]
  }
};

const DEFAULT_REQUESTS = [
  {
    id: 'UM-001',
    client: 'Частный клиент',
    object: 'Квартира, оконный блок',
    workType: 'Оклады на окна',
    status: 'В работе',
    amount: 38000,
    dueDate: '2026-06-05',
    contact: '+7 900 000-00-00',
    notes: 'Изготовление и монтаж окладов на окна'
  },
  {
    id: 'UM-002',
    client: 'ИП Заказчик',
    object: 'Офисное помещение',
    workType: 'Сварочные работы',
    status: 'Новая',
    amount: 56000,
    dueDate: '2026-06-12',
    contact: '+7 911 111-11-11',
    notes: 'Замер, сварка, грунтовка и покраска решетки'
  },
  {
    id: 'UM-003',
    client: 'ООО Управляющая компания',
    object: 'Кровельное примыкание',
    workType: 'Сервис/исправление',
    status: 'Оплачена',
    amount: 92000,
    dueDate: '2026-05-30',
    contact: '+7 922 222-22-22',
    notes: 'Сервис после дождя: проверить уклон, примыкания и попадание воды под конструкцию'
  }
];

const DEFAULT_SETTINGS = {
  companyName: 'Универсал Монтаж Сочи',
  website: 'https://www.yniversalmontag.ru/',
  telegram: 'https://t.me/yniversalmontag',
  manager: 'Иван / Николай',
  apiEndpoint: ''
};

function createId(prefix = 'UM') {
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(2, 14);
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${stamp}-${suffix}`;
}

function buildWorkGuide(input = {}) {
  const workType = WORK_TEMPLATES[input.workType] ? input.workType : 'Общие монтажные работы';
  const template = WORK_TEMPLATES[workType];
  const width = Number(input.width || 0);
  const height = Number(input.height || 0);
  const length = Number(input.length || 0);
  const quantity = Math.max(1, Number(input.quantity || 1));
  const seamLength = Number(input.seamLength || length || 0);
  const area = round(width * height * quantity);
  const perimeter = round((width + height) * 2 * quantity);
  const workLength = round(length || perimeter || seamLength);
  const flags = input.flags || {};
  const calculations = {
    area,
    perimeter,
    length: workLength,
    sealant: round((seamLength || perimeter || workLength) * (template.defaults.sealantPerMeter || 0)),
    primer: round(area * (template.defaults.primerPerM2 || 0)),
    paint: round(area * (template.defaults.paintPerM2 || 0)),
    brackets: template.defaults.bracketStep ? Math.ceil(workLength / template.defaults.bracketStep) + 1 : 0
  };

  const materials = buildMaterials(workType, calculations, template.defaults);
  const steps = buildSteps(template.baseSteps, flags);

  return {
    title: workType,
    calculations,
    materials,
    steps,
    risks: buildRisks(flags)
  };
}

function createProgress(steps, completedIds = []) {
  const completed = new Set(completedIds);
  const total = steps.length;
  const done = steps.filter((step) => completed.has(step.id)).length;
  return {
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0
  };
}

function buildMaterials(workType, calculations, defaults) {
  const waste = defaults.waste || 1;
  const materials = [];

  if (['Оклады на окна', 'Жестяные работы'].includes(workType)) {
    materials.push({ name: 'Листовой металл', value: round((calculations.area || 1) * waste), unit: 'м2' });
  }
  if (workType === 'Водосточная система') {
    materials.push({ name: 'Желоб/труба', value: round(calculations.length * waste), unit: 'м' });
    materials.push({ name: 'Кронштейны', value: calculations.brackets, unit: 'шт' });
  }
  if (workType === 'Сварочные работы') {
    materials.push({ name: 'Профиль/металл', value: round((calculations.length || 1) * waste), unit: 'м' });
  }
  if (calculations.sealant > 0) {
    materials.push({ name: 'Герметик', value: calculations.sealant, unit: 'тубы' });
  }
  if (calculations.primer > 0) {
    materials.push({ name: 'Грунт', value: calculations.primer, unit: 'л' });
  }
  if (calculations.paint > 0) {
    materials.push({ name: 'Краска', value: calculations.paint, unit: 'л' });
  }
  materials.push({ name: 'Крепеж', value: 'по месту', unit: '' });
  return materials;
}

function buildSteps(baseSteps, flags) {
  const steps = [...baseSteps];
  if (flags.dismantling) {
    steps.unshift('Выполнить демонтаж без повреждения соседних узлов');
  }
  if (flags.rainRisk) {
    steps.push('Отдельно проверить риск: косой дождь и заток воды');
  }
  if (flags.slope) {
    steps.push('Проверить уклон уровнем или контрольным проливом');
  }
  if (flags.paint) {
    steps.push('Проверить высыхание грунта перед покраской');
  }
  if (flags.leak) {
    steps.push('Зафиксировать место протечки до исправления');
  }
  if (flags.outdoor) {
    steps.push('Учесть погоду, доступ и безопасность работ снаружи');
  }
  return [...new Set(steps)].map((text, index) => ({
    id: `step-${index + 1}`,
    text
  }));
}

function buildRisks(flags) {
  const risks = [];
  if (flags.rainRisk) risks.push('косой дождь');
  if (flags.slope) risks.push('неверный уклон');
  if (flags.leak) risks.push('повторная протечка');
  if (flags.dismantling) risks.push('повреждение при демонтаже');
  if (flags.outdoor) risks.push('погодные условия');
  return risks;
}

function round(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function normalizeRequest(input = {}) {
  const workType = WORK_TYPES.includes(input.workType) ? input.workType : 'Общие монтажные работы';
  return {
    id: String(input.id || createId()).trim(),
    client: String(input.client || '').trim(),
    object: String(input.object || '').trim(),
    workType,
    status: STATUSES.includes(input.status) ? input.status : 'Новая',
    amount: Number(input.amount || 0),
    dueDate: String(input.dueDate || '').trim(),
    contact: String(input.contact || '').trim(),
    notes: String(input.notes || '').trim()
  };
}

function createSummary(requests) {
  return requests.reduce((summary, request) => {
    const amount = Number(request.amount || 0);
    summary.total += 1;
    summary.totalAmount += amount;
    summary.byStatus[request.status] = (summary.byStatus[request.status] || 0) + 1;
    summary.byWorkType[request.workType] = (summary.byWorkType[request.workType] || 0) + 1;
    if (request.status !== 'Оплачена') {
      summary.openAmount += amount;
    }
    if (request.workType === 'Сервис/исправление' || /сервис|исправ|дожд|протеч|вода/i.test(request.notes)) {
      summary.serviceCount += 1;
    }
    return summary;
  }, { total: 0, totalAmount: 0, openAmount: 0, serviceCount: 0, byStatus: {}, byWorkType: {} });
}

function suggestChecklist(request = {}) {
  const workType = request.workType || 'Общие монтажные работы';
  const text = `${request.object || ''} ${request.notes || ''}`.toLowerCase();
  const items = ['Зафиксировать исходные замеры и контакт заказчика', 'Сделать фото до и после работ'];

  if (workType === 'Сварочные работы') {
    items.push('Проверить размеры, точки крепления и доступ к месту сварки');
    items.push('Запланировать грунтовку и покраску после сварки');
  }

  if (workType === 'Жестяные работы' || workType === 'Оклады на окна') {
    items.push('Проверить уклон, примыкания и возможный заток воды');
    items.push('Оценить риск косого дождя и попадания воды под конструкцию');
  }

  if (workType === 'Гидроизоляция' || text.includes('дожд') || text.includes('вода') || text.includes('протеч')) {
    items.push('Проверить места примыкания и герметичность после высыхания');
    items.push('Отметить, нужна ли повторная проверка после дождя');
  }

  if (workType === 'Водосточная система') {
    items.push('Проверить направление слива и отсутствие обратного уклона');
    items.push('Согласовать следующий этап монтажа покрытия или водостока');
  }

  if (workType === 'Сервис/исправление') {
    items.push('Записать причину выезда и что именно исправлено');
    items.push('Получить подтверждение заказчика после устранения проблемы');
  }

  return [...new Set(items)];
}

function createRecommendations(requests) {
  const summary = createSummary(requests);
  const recommendations = [];
  if (summary.serviceCount > 0) {
    recommendations.push('Есть сервисные случаи: проверьте причины, повторяемость проблем с водой, уклонами и примыканиями.');
  }
  if ((summary.byWorkType['Оклады на окна'] || 0) > 0 || (summary.byWorkType['Жестяные работы'] || 0) > 0) {
    recommendations.push('По окладам и жестяным работам полезно фиксировать фото узлов, уклоны и погодный риск.');
  }
  if ((summary.byStatus['Новая'] || 0) > 0) {
    recommendations.push('Новые заявки стоит быстро переводить в замер, расчет или отложено, чтобы не терять входящий спрос.');
  }
  return recommendations.length ? recommendations : ['Критичных подсказок нет. Можно экспортировать журнал или добавить новые заявки.'];
}

function formatMoney(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function filterRequests(requests, query, status) {
  const needle = String(query || '').trim().toLowerCase();
  return requests.filter((request) => {
    const statusMatches = !status || status === 'Все' || request.status === status;
    const text = [request.id, request.client, request.object, request.workType, request.contact, request.notes].join(' ').toLowerCase();
    return statusMatches && (!needle || text.includes(needle));
  });
}


function buildTelegramUrl(settings) {
  return settings.telegram || 'https://t.me/yniversalmontag';
}

function buildWebsiteUrl(settings) {
  return settings.website || 'https://www.yniversalmontag.ru/';
}

async function sendToExternalApi(settings, payload) {
  if (!settings.apiEndpoint) {
    return { ok: false, message: 'API endpoint не задан. Данные подготовлены локально.' };
  }

  const response = await fetch(settings.apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return { ok: response.ok, message: response.ok ? 'Данные отправлены' : 'Ошибка отправки' };
}


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
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(state.requests));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  localStorage.setItem(COMPLETED_KEY, JSON.stringify([...state.completed]));
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

init();


}());

