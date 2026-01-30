const STORAGE_KEY = 'pagosapp_checkout';

/**
 * Solo persiste items y deliveryInfo (nunca datos de tarjeta).
 * Permite recuperar el progreso del cliente tras un refresh.
 */
export function loadPersistedCheckout(checkoutInitialState) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return {
      ...checkoutInitialState,
      items: Array.isArray(parsed.items) ? parsed.items : checkoutInitialState.items,
      deliveryInfo:
        parsed.deliveryInfo && typeof parsed.deliveryInfo === 'object'
          ? { ...checkoutInitialState.deliveryInfo, ...parsed.deliveryInfo }
          : checkoutInitialState.deliveryInfo,
    };
  } catch {
    return undefined;
  }
}

export function savePersistedCheckout(checkoutState) {
  try {
    const toSave = {
      items: checkoutState.items || [],
      deliveryInfo: checkoutState.deliveryInfo || {},
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}
