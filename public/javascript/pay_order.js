(async () => {
  const payContainer = document.getElementById('pay-container')
  const payButton = document.getElementById('pay-button');
  const qrContainer = document.getElementById('qr-code');
  const qr = document.getElementById('qr');

  payButton.addEventListener('click', async () => {
    payButton.innerText = "Processing..";
    try {
      console.log(JSON.stringify(window.cart.lineItems, null, 2));
      const cart = window.cart; 
      
      const orderRequestBody = {
        amount: window.cart.cart.total,
        items: cart.lineItems,
      }

      const response = await fetch('/orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(orderRequestBody),
      });

      const order = await response.json();
      
      payContainer.classList.add("hidden");
      qrContainer.classList.remove("hidden");
      console.log(`APP URL: ${order.app_url}`)
      new QRCode("qr", {
        text: order.app_url,
        width: 100,
        height: 100,
      });
    } catch(error) {
      console.log(`⚠️ Error: ${error}`);
    }
  });
})()