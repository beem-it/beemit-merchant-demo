class Cart {
  constructor() {
    this.cart = {
      items: [],
      shippingCost: 0.0,
      discount: null,
      subtotal: 0.0,
      total: 0.0,
    };

    this.lineItems = [];

    this.products = [
      { name: 'TShirt', description: 'T shirt for all', image: '👕' },
      { name: 'Stickers', description: 'Swag for your laptops', image: '🏷' },
      { name: 'Just Beem it', description: 'Super cool beemer', image: '⚡️' },
    ];
    this.populateCart();
  }

  formatAmount(amount) {
    let price = (amount / 100).toFixed(2);
    let numberFormat = new Intl.NumberFormat(['en-AU'], {
      style: 'currency',
      currency: 'AUD',
      currencyDisplay: 'symbol',
    });
    return numberFormat.format(price);
  }

  populateCart() {
    this.cart = this.generateCartItems();
    this.lineItems = this.generateLineItems(this.cart);

    const orderItems = document.getElementById('order-items');

    this.cart.items.forEach((value) => {
      const formattedAmount = this.formatAmount(value.amount);
      const formattedTotalPrice = this.formatAmount(
        value.amount * value.quantity
      );

      let orderItem = document.createElement('div');
      orderItem.id = 'order-item';
      orderItem.classList.add('order-item');
      orderItem.innerHTML = `
        <p class="image"> ${value.image} </p>
        <div class="product">
          <p class="label"> ${value.name}</p>
          <p class="description">${value.description}</p>
        </div>
        <div class="quantity-amount">
          <p class="quantity"> ${value.quantity} x ${formattedAmount}</p>
          <p class="amount">${formattedTotalPrice}</p>
        </div>
      `;

      orderItems.appendChild(orderItem);
    });

    this.updatePaymentSummary(this.cart);
  }

  updatePaymentSummary(cart) {
    const subtotal = document.getElementById('subtotal');
    const discount = document.getElementById('discount');
    const shipping = document.getElementById('shipping');
    const total = document.getElementById('total');

    subtotal.innerText = this.formatAmount(cart.subtotal);
    discount.innerText = `-${this.formatAmount(cart.discount)}`;
    shipping.innerText =
      cart.shippingCost && cart.shippingCost > 0
        ? this.formatAmount(cart.shippingCost)
        : 'free';
    total.innerText = `${this.formatAmount(cart.total)}`;
  }

  generateCartItems() {
    const randomNumber = (min, max) => {
      min = Math.floor(min);
      max = Math.ceil(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Generate SKU line items
    let items = [];
    let shippingCost = 0.0;
    let discount = 0.0;

    for (let product of this.products) {
      let item = {
        id: 'uuid',
        image: product.image,
        name: product.name,
        amount: randomNumber(100, 500),
        description: product.description,
        quantity: randomNumber(1, 5),
      };
      items.push(item);
    }

    const shouldChargeShipping = Math.random() >= 0.5;
    if (shouldChargeShipping) {
      shippingCost = randomNumber(700, 1500);
    }

    discount = randomNumber(500, 1000);

    const subtotal = items.reduce((acc, current) => {
      return acc + current.amount * current.quantity;
    }, 0);

    const total = subtotal + shippingCost - discount;

    return {
      items,
      shippingCost,
      discount,
      subtotal,
      total,
    };
  }

  generateLineItems(cart) {
    // Generate SKU line items
    let items = [];

    cart.items.forEach((item) => {
      let lineItem = {
        type: 'sku',
        amount: item.quantity * item.amount,
        description: item.name,
        quantity: item.quantity,
      };
      items.push(lineItem);
    });

    // Generate Discount Line Item
    const discount = {
      type: 'discount',
      amount: -cart.discount,
      description: 'Beemer Discount',
    };
    items.push(discount);

    if (cart.shippingCost && cart.shippingCost > 0) {
      const shipping = {
        type: 'shipping',
        amount: cart.shippingCost,
        description: 'Express Shipping',
      };
      items.push(shipping);
    }

    return items;
  }
}

this.window.cart = new Cart();
