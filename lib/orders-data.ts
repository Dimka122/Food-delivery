// Общее хранилище заказов для всех API роутов
declare global {
  var __orders__: any[] | undefined
}

export function getOrders() {
  if (!global.__orders__) {
    global.__orders__ = []
  }
  return global.__orders__
}
