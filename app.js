// Initialize cart and quantity variables
let cart = [];
let cartCount = 0;

// Get references to the cart display and quantity elements
const cartCountElement = document.querySelector('.your-cart h1');
const cartContent = document.querySelector('.cart-content');

// Function to show the empty cart message
function showEmptyCartMessage() {
  const emptyCartMessage = document.createElement('div');
  emptyCartMessage.classList.add('empty-cart');
  emptyCartMessage.innerHTML = `
    <img src="./assets/images/illustration-empty-cart.svg" alt="illustration-empty-cart" class="illustration-empty-cart"/>
    <p>Your added items will appear here</p>
  `;
  cartContent.innerHTML = ''; // Clear any existing cart content
  cartContent.appendChild(emptyCartMessage);
}

// Show the empty cart message initially if the cart is empty
if (cartCount === 0) {
  showEmptyCartMessage();
}

// Increment the quantity of a dessert item
function incrementItem(event) {
  const itemElement = event.target.closest('.item');
  const itemName = itemElement.querySelector('h2').innerText;
  const itemPrice = parseFloat(itemElement.querySelector('.price').innerText.replace('$', ''));
  const quantityElement = itemElement.querySelector('.quantity');
  let quantity = parseInt(quantityElement.innerText);

  // Check if the item already exists in the cart
  const existingItem = cart.find(item => item.name === itemName);

  if (existingItem) {
    // Item exists in the cart, so increment the quantity
    existingItem.quantity += 1;
  } else {
    // Item doesn't exist in the cart, so add it with quantity 1
    cart.push({ name: itemName, price: itemPrice, quantity: 1 });
  }

  // Update the quantity in the UI
  quantityElement.innerText = existingItem ? existingItem.quantity : 1;

  // Update the cart UI
  updateCartUI();
}

// Decrement the quantity of a dessert item
function decrementItem (event) {
  const itemElement = event.target.closest('.item');
  const itemName = itemElement.querySelector('h2').innerText;
  const quantityElement = itemElement.querySelector('.quantity');
  let quantity = parseInt(quantityElement.innerText);

  // Prevent quantity from going below 1
  if (quantity > 1) {
    quantity -= 1;
    quantityElement.innerText = quantity;

    // Update the cart array
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
      existingItem.quantity = quantity;
    }
    updateCartUI();
  }
}

// Remove item from the cart
function removeItem(event) {
  const itemElement = event.target.closest('.cart-item');
  const itemName = itemElement.querySelector('h2').innerText;

  // Remove the item from the cart array
  cart = cart.filter(item => item.name !== itemName);

  // Update the cart UI
  updateCartUI();
}

// Update the cart UI
function updateCartUI() {
  // Update the cart count display
  cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.innerText = `Your cart (${cartCount})`;

  // Calculate total price of the cart
  const TotalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Clear cart content before rendering
  cartContent.innerHTML = '';

  if (cartCount === 0) {
    // If the cart is empty, show the empty cart message
    showEmptyCartMessage();
  } else {
    // Render cart items
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <h2>${item.name}</h2>
        <div class="cart-item-details">
          <div class="prices">
            <p>${item.quantity}x</p>
            <p>@ $${item.price.toFixed(2)}</p>
            <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <img src="./assets/images/icon-remove-item.svg" alt="Remove item" class="remove">
          <hr/>
        </div>
      `;
      cartContent.appendChild(cartItem);

      // Add event listener to remove button
      cartItem.querySelector('.remove').addEventListener('click', removeItem);
    });

    // Append order total
    const totalElement = document.createElement('div');
    totalElement.classList.add('order-total');
    totalElement.innerHTML = `
      <p>Order Total</p>
      <h2>$${TotalPrice.toFixed(2)}</h2>
    `;
    cartContent.appendChild(totalElement);

    const checkout = document.createElement('div');
    checkout.classList.add('checkout');
    checkout.innerHTML = `
      <div class="carbon-neutral">
        <img src="./assets/images/icon-carbon-neutral.svg"/>
        <p>This is a <span>carbon-neutral</span> delivery</p>
      </div>
      <button>Confirm Order</button>
    `;
    cartContent.appendChild(checkout);
  }
}

// Add event listeners to increment and decrement buttons
document.querySelectorAll('.plus').forEach(button => {
  button.addEventListener('click', incrementItem);
});

document.querySelectorAll('.minus').forEach(button => {
  button.addEventListener('click', decrementItem);
});
