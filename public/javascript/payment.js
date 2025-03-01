(async () => {
  const payContainer = document.getElementById('pay-container');
  const payButton = document.getElementById('pay-button');
  const qrContainer = document.getElementById('qr-code');
  const success = document.getElementById('success');
  const error = document.getElementById('error');
  const cart = document.getElementById('cart');
  const tryAgainButton = document.getElementById('try-again');
  const payDeeplinkButton = document.getElementById('pay-deeplink-button');
  const payDeeplinkContainer = document.getElementById(
    'pay-deeplink-container'
  );

  let orderId = null;

  payButton.addEventListener('click', async () => {
    payButton.innerText = 'Processing..';
    try {
      const cart = window.cart;

      const orderRequestBody = {
        amount: window.cart.cart.total,
        items: cart.lineItems,
      };

      const response = await fetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderRequestBody),
      });

      const order = await response.json();
      orderId = order.id;

      payContainer.classList.add('hidden');
      qrContainer.classList.remove('hidden');

      if (getComputedStyle(qrContainer, null).display !== 'none') {
        // Show QR code on desktop for user to scan the code and pay.
        new QRCode('qr', {
          text: order.app_url,
          width: 100,
          height: 100,
        });
      } else {
        payDeeplinkContainer.classList.remove('hidden');
        // Show deeplink button on the phone to redirect to app
        payDeeplinkButton.onclick = () => {
          window.open(order.app_url, '_blank');
        };
      }

      pollPaymentStatus(orderId);
    } catch (error) {
      console.log(`⚠️ Error: ${error}`);
    }
  });

  tryAgainButton.addEventListener('click', () => {
    error.classList.add('hidden');
    cart.classList.remove('hidden');
    pollPaymentStatus(orderId);
  });

  const pollPaymentStatus = async (
    orderID,
    timeout = 20000,
    interval = 1000,
    start = Date.now()
  ) => {
    const response = await fetch(`/orders/${orderID}`);
    const orderStatus = await response.json();

    const hasTimedOut = Date.now() > start + timeout;

    if (orderStatus.status !== 'PAID' && !hasTimedOut) {
      setTimeout(
        pollPaymentStatus,
        interval,
        orderID,
        timeout,
        interval,
        start
      );
    } else {
      console.log('Polling Timed Out');
      handleOrderPaymentStatus(orderStatus);
    }
  };

  const handleOrderPaymentStatus = (orderStatus) => {
    cart.classList.add('hidden');
    if (orderStatus.status === 'PAID') {
      //Show receipt
      success.classList.remove('hidden');
    } else {
      // Show error UI
      error.classList.remove('hidden');
    }
  };
})();
