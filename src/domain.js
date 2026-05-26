export const STATUSES = ['Новая', 'В работе', 'Выполнена', 'Оплачена', 'Отложена'];

export const WORK_TYPES = [
  'Общие монтажные работы',
  'Сварочные работы',
  'Жестяные работы',
  'Оклады на окна',
  'Гидроизоляция',
  'Водосточная система',
  'Сервис/исправление'
];

export const WORK_TEMPLATES = {
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

export const DEFAULT_REQUESTS = [
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

export const DEFAULT_SETTINGS = {
  companyName: 'Универсал Монтаж Сочи',
  website: 'https://www.yniversalmontag.ru/',
  telegram: 'https://t.me/yniversalmontag',
  manager: 'Иван / Николай',
  apiEndpoint: ''
};

export function createId(prefix = 'UM') {
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(2, 14);
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${stamp}-${suffix}`;
}

export function buildWorkGuide(input = {}) {
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

export function createProgress(steps, completedIds = []) {
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

export function normalizeRequest(input = {}) {
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

export function createSummary(requests) {
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

export function suggestChecklist(request = {}) {
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

export function createRecommendations(requests) {
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

export function formatMoney(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function filterRequests(requests, query, status) {
  const needle = String(query || '').trim().toLowerCase();
  return requests.filter((request) => {
    const statusMatches = !status || status === 'Все' || request.status === status;
    const text = [request.id, request.client, request.object, request.workType, request.contact, request.notes].join(' ').toLowerCase();
    return statusMatches && (!needle || text.includes(needle));
  });
}
