let savedOrders = [];

try {
  const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  savedOrders = Array.isArray(storedOrders) ? storedOrders : [];
} catch (error) {
  console.error('Error loading orders:', error);
}

export const orders = savedOrders;

export function addOrder(order) {
  orders.unshift(order);
  saveOrdersToLocalStorage();
}

function saveOrdersToLocalStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}