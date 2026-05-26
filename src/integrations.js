export function buildTelegramUrl(settings) {
  return settings.telegram || 'https://t.me/yniversalmontag';
}

export function buildWebsiteUrl(settings) {
  return settings.website || 'https://www.yniversalmontag.ru/';
}

export async function sendToExternalApi(settings, payload) {
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
