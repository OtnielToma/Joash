document.addEventListener("DOMContentLoaded", () => {
  setupCart();

  setupSignupForm();
  setupLoginForm();


  checkNotifications();
  loadTshirts();
  loadHoodies();
  loadOrders();

  const inputFields = document.querySelectorAll('.input-field');
  inputFields.forEach(field => {
    field.addEventListener('invalid', function () {
      this.classList.add('input-error');
    });

    field.addEventListener('input', function () {
      if (this.validity.valid) {
        this.classList.remove('input-error');
      }
    });
  });




  const cartSection = document.getElementById('cart');
  const orderProcessSection = document.getElementById('order-process');
  if (!cartSection || !orderProcessSection) {
    console.error('Required sections not found in the DOM.');
  }


  const ordersContainer = document.querySelector('.orders-container');
  ordersContainer.addEventListener('wheel', handlescroll);

});

document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = new FormData(this);
      const cart = getCart(); 
      formData.append('cart', JSON.stringify(cart));

      fetch('place_order.php', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            clearCart();
            showOrderOverview(data.order_id);
          } else {
            showNotification(data.message);
          }
        })
        .catch(error => {
          showNotification('Failed to place order. Please try again.');
        });
    });
  }
});

function setupCart() {
  renderCartDropdown();
  renderCartPage();
  updateCartCount();
}



document.addEventListener('DOMContentLoaded', () => {
  const sections = ['home', 'product', 'tshirts', 'hoodies'];
  let currentSectionIndex = 0;
  let isScrolling = false;
  const mouseScrollDuration = 1400; 
  const otherScrollDuration = 300;  

  function initializeCurrentSectionIndex() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const initialIndex = sections.indexOf(hash);
      if (initialIndex !== -1) {
        currentSectionIndex = initialIndex;
        scrollToSection(currentSectionIndex, 0); 
        localStorage.setItem('currentSectionIndex', currentSectionIndex);
      }
    } else {
      const storedIndex = localStorage.getItem('currentSectionIndex');
      if (storedIndex !== null) {
        currentSectionIndex = parseInt(storedIndex, 10);
        scrollToSection(currentSectionIndex, 10); 
      } else {
        const currentSection = sections.findIndex(sectionId => {
          const section = document.getElementById(sectionId);
          return section && section.getBoundingClientRect().top >= 0;
        });
        currentSectionIndex = currentSection !== -1 ? currentSection : 0;
      }
    }
  }

  function scrollToSection(index, duration) {
    if (index < 0 || index >= sections.length) return;
    const targetSection = document.getElementById(sections[index]);
    if (!targetSection) return; // Ensure the target section exists
    isScrolling = true;
    targetSection.scrollIntoView({ behavior: 'smooth' });
    currentSectionIndex = index;
    localStorage.setItem('currentSectionIndex', currentSectionIndex);
    setTimeout(() => { isScrolling = false; }, duration); // Adjust timeout based on scroll duration
  }


  function handleScroll(event) {
    if (isScrolling) return;
    const duration = mouseScrollDuration;
    if (event.deltaY > 0) {
      scrollToSection(currentSectionIndex + 1, duration);
    } else {
      scrollToSection(currentSectionIndex - 1, duration);
    }
  }

  function handleKeydown(event) {
    if (isScrolling) return;
    if (event.key === 'ArrowDown') {
      scrollToSection(currentSectionIndex + 1, otherScrollDuration);
    } else if (event.key === 'ArrowUp') {
      scrollToSection(currentSectionIndex - 1, otherScrollDuration);
    }
  }

  function updateCurrentSectionIndex(sectionId) {
    const index = sections.indexOf(sectionId);
    if (index !== -1) {
      currentSectionIndex = index;
      localStorage.setItem('currentSectionIndex', currentSectionIndex);
    }
  }

  let touchStartY = 0;

  function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchMove(event) {
    if (isScrolling) return;
    const touchMoveY = event.touches[0].clientY;
    if (touchStartY > touchMoveY + 50) {
      scrollToSection(currentSectionIndex + 1, otherScrollDuration);
    } else if (touchStartY < touchMoveY - 50) {
      scrollToSection(currentSectionIndex - 1, otherScrollDuration);
    }
  }

  window.addEventListener('wheel', handleScroll);
  document.addEventListener('wheel', (event) => {
    event.preventDefault(); 
    handleScroll(event);
  }, { passive: false });

  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchmove', handleTouchMove);

  document.querySelectorAll('.LinkButton, .NavLink, .Logo').forEach(link => {
    link.addEventListener('click', (event) => {
      let href = event.target.getAttribute('href') || event.target.getAttribute('data-href');

      if (href) {
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          event.preventDefault();
          updateCurrentSectionIndex(targetId);
          scrollToSection(currentSectionIndex, otherScrollDuration);
        } else {
          localStorage.setItem('currentSectionIndex', sections.indexOf(targetId));
          window.location.href = href;
        }
      } else {
        console.error('The href attribute is missing or invalid for the clicked link.');
      }
    });

    document.querySelectorAll('.menu-item1').forEach(link => {
      link.addEventListener('click', (event) => {
        const href = event.currentTarget.getAttribute('data-href');

        if (href) {
          const targetId = href.substring(1);
          localStorage.setItem('currentSectionIndex', sections.indexOf(targetId));
          window.location.href = href;
        } else {
          console.error('The data-href attribute is missing or invalid for the clicked link.');
        }
      });
    });

    initializeCurrentSectionIndex();
  });


  document.querySelectorAll('.menu-item1').forEach(link => {
    link.addEventListener('click', (event) => {
      const href = event.currentTarget.getAttribute('data-href');

      if (href) {
        const targetId = href.substring(1);
        localStorage.setItem('currentSectionIndex', sections.indexOf(targetId));
        window.location.href = href;
      } else {
        console.error('The data-href attribute is missing or invalid for the clicked link.');
      }
    });
  });


  document.querySelectorAll('.Logo, .menu-item, .image-container1, .image-container2').forEach(link => {
    link.addEventListener('click', (event) => {
      const href = event.currentTarget.getAttribute('data-href');


      if (href) {
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          event.preventDefault();
          updateCurrentSectionIndex(targetId);
          scrollToSection(currentSectionIndex, otherScrollDuration);
        } else {

          localStorage.setItem('currentSectionIndex', sections.indexOf(targetId));
          window.location.href = href;
        }
      } else {
        console.error('The data-href attribute is missing or invalid for the clicked link.');
      }
    });
  });

  initializeCurrentSectionIndex();
});



function addToCart() {
  const cart = getCart();
  const sizeElement = document.getElementById('product-size');
  const productIdElement = document.getElementById('product-id');
  const productNameElement = document.getElementById('product-name');
  const priceElement = document.getElementById('product-price');
  const productCategoryElement = document.getElementById('product-category');

  if (!sizeElement || !productIdElement || !productNameElement || !priceElement || !productCategoryElement) {
    showNotification('Product details are missing!');
    return;
  }

  const size = sizeElement.value;
  if (!size) {
    showNotification('Please select a size!');
    return;
  }

  const productId = productIdElement.value;
  const productName = productNameElement.textContent;
  const price = parseFloat(priceElement.textContent.replace('Lei', '').trim());
  const productCategory = productCategoryElement.value;
  const product = { id: productId, name: productName, price, size, category: productCategory, quantity: 1 };

  const existingProduct = cart.find(item => item.id === product.id && item.size === product.size);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push(product);
  }
  saveCart(cart);
  updateCartCount();

  showNotification('Product added to cart!');
  renderCartDropdown();
  renderCartPage();
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(element => element.innerText = totalQuantity);
}

function renderCartDropdown() {
  const cart = getCart();
  const cartListElements = document.querySelectorAll('.cart-dropdown .cart-list');
  cartListElements.forEach(cartList => {
    cartList.innerHTML = '';
    cart.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('cart-item');
      productElement.innerHTML = `
        <span>${product.name} (x${product.quantity}, Size: ${product.size})</span>
        <button onclick="removeFromCart('${product.id}', '${product.size}')">-</button>
      `;
      cartList.appendChild(productElement);
    });
  });
}

function renderCartPage() {
  const cart = getCart();
  const cartList = document.querySelector('.cart-list');
  const cartTotalPrice = document.getElementById('cart-total-price');
  if (cartList && cartTotalPrice) {
    cartList.innerHTML = '';

    let totalPrice = 0;

    cart.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('cart-item');
      productElement.innerHTML = `
        <span>${product.name} (x${product.quantity}, Size: ${product.size})</span>
        <button onclick="removeFromCart('${product.id}', '${product.size}')">-</button>
      `;
      cartList.appendChild(productElement);
      totalPrice += product.price * product.quantity;
    });

    cartTotalPrice.innerText = totalPrice.toFixed(2) + ' Lei';
  }
}

function removeFromCart(productId, size) {
  let cart = getCart();
  const productIndex = cart.findIndex(product => product.id === productId && product.size === size);
  if (productIndex !== -1) {
    if (cart[productIndex].quantity > 1) {
      cart[productIndex].quantity -= 1;
    } else {
      cart.splice(productIndex, 1);
    }
  }
  saveCart(cart);
  updateCartCount();
  renderCartDropdown();
  renderCartPage();
}

function clearCart() {
  localStorage.removeItem('cart');
  updateCartCount();
  renderCartDropdown();
  renderCartPage();
}


function startOrderProcess() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const cart = getCart();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!loggedIn) {
    showLoginPrompt();
    return;
  }

  if (totalQuantity === 0) {
    showNotification("Add products to cart");
    return;
  }

  const cartSection = document.getElementById('cart');
  const orderProcessSection = document.getElementById('order-process');
  cartSection.classList.add('hidden');
  orderProcessSection.classList.remove('hidden');
  goToStep(1);
}

function showOrderOverview(orderId) {
  fetch(`order_details.php?order_id=${orderId}`)
    .then(response => response.json())
    .then(order => {
      const orderOverview = document.createElement('div');
      orderOverview.innerHTML = `
      <div class="container" id="set1">
        <h3>Order Overview</h3>
        <p>Order ID: ${order.id}</p>
        <p>Total: ${order.total_price} Lei</p>
        <p>Date: ${order.order_date}</p>
        <div>
          <h4>Items:</h4>
          ${order.items.map(item => `
            <p>${item.name} (Size: ${item.size}) x${item.quantity} - ${item.price} Lei</p>
          `).join('')}
        </div>
        <a id="back" href="index.html#home" class="NavLink back-link">back to home</a>
      </div>
    `;
      showNotification("Order placed successfully!");
      const orderProcessSection = document.getElementById('order-process');
      orderProcessSection.innerHTML = '';
      orderProcessSection.appendChild(orderOverview);
    })
    .catch(error => console.error('Error fetching order details:', error));
}


const style = document.createElement('style');
style.innerHTML = `
  .back-link {
    color: #ff4500 !important;
    font-size: 2vh;
  }
`;
document.head.appendChild(style);



function showLoginPrompt() {
  const loginPrompt = document.getElementById('login-prompt');
  loginPrompt.style.display = 'block';
}

function goToStep(step) {
  if ((step === 2 && !validateAddress('shipping')) || (step === 4 && !validateAddress('billing'))) {
    return;
  }

  const steps = document.querySelectorAll('.order-step');
  steps.forEach(stepElement => stepElement.classList.add('hidden'));
  document.getElementById(`step-${step}`).classList.remove('hidden');

  if (step === 4) {
    loadOrderSummary();
  }
}

function validateAddress(type) {
  const fields = [
    document.getElementById(`${type}-name`),
    document.getElementById(`${type}-address`),
    document.getElementById(`${type}-city`),
    document.getElementById(`${type}-zip`)
  ];

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      field.focus();
      return false;
    }
  }

  return true;
}

function loadOrderSummary() {
  const cart = getCart();
  const orderCartList = document.getElementById('order-cart-list');
  const orderTotalPrice = document.getElementById('order-total-price');
  orderCartList.innerHTML = '';

  let totalPrice = 0;

  cart.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('cart-item');
    productElement.innerHTML = `
      <span>${product.name} (Size: ${product.size}, x${product.quantity})</span>
      <span> ${product.price.toFixed(2)} Lei</span>`;
    orderCartList.appendChild(productElement);
    totalPrice += product.price * product.quantity;
  });

  orderTotalPrice.innerText = totalPrice.toFixed(2) + 'Lei';
  injectCSS();
}



function injectCSS() {
  const style = document.createElement('style');
  style.innerHTML = `
  
    @media (max-width: 768px) {
      #set1.container {
        max-width: 80vw;
      }
    }
    @media (min-width: 769px) {
      #set1.container {
        max-width: 50vw;
      }
    }
  `;
  document.head.appendChild(style);
}


function setupAccountPage() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const userNameElement = document.getElementById('user-name');
  const userEmailElement = document.getElementById('user-email');
  const userPhoneElement = document.getElementById('user-phone');
  const ordersList = document.getElementById('orders-list');

  if (loggedIn) {
    fetch('user_orders.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const user = data.user;
          userNameElement.innerText = user.name;
          userEmailElement.innerText = user.email;
          userPhoneElement.innerText = user.phone;

          const orders = data.orders;
          ordersList.innerHTML = '';
          if (orders.length > 0) {
            orders.forEach((order, index) => {
              const orderElement = document.createElement('div');
              orderElement.classList.add('order-item');
              orderElement.innerHTML = `
                <h4>Order #${index + 1}</h4>
                <p>Date of Placing: ${order.order_date}</p>
                <p>Total Price: $${order.total_price}</p>
                <h5>Items Bought:</h5>
                <ul>
                  ${order.items.map(item => `
                    <li>${item.name} x${item.quantity} - $${item.price}</li>
                  `).join('')}
                </ul>
              `;
              ordersList.appendChild(orderElement);
            });
          } else {
            ordersList.innerHTML = '<p>You currently have no orders.</p> <a href="index.html#product" class="LinkButton Primary">Shop Now</a>';
          }
        } else {
          showNotification(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);

        if (window.location.pathname.endsWith('account.html')) {
          showNotification('Failed to load account details. Please try again.');
        }
      });

    document.getElementById('account').classList.remove('hidden');
    document.getElementById('login').classList.add('hidden');
  } else {
    document.getElementById('account').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000); 
  }
}


function setupSignupForm() {
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(signupForm);

      fetch('signup.php', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            showNotification('Signup successful. Please check your email for the verification code.');
            document.getElementById('signup').style.display = 'none';
            document.getElementById('verificationSection').style.display = 'block';
            document.getElementById('verificationForm').dataset.email = formData.get('email');
          } else {
            showNotification('Signup failed: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          showNotification('Signup failed. Please try again.');
        });
    });
  }

  const verificationForm = document.getElementById('verificationForm');
  if (verificationForm) {
    verificationForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(verificationForm);
      formData.append('email', verificationForm.dataset.email);

      fetch('verify.php', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            showNotification('Verification successful. Redirecting to login...');
            setTimeout(() => {
              window.location.href = 'login.html';
            }, 3000); // Adjust the delay as needed
          } else {
            showNotification('Verification failed: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          showNotification('Verification failed. Please try again.');
        });
    });
  }
}


function fetchUserDetails() {
  fetch('user_details.php')
    .then(response => response.json())
    .then(data => {
      const ordersList = document.getElementById('orders-list');
      ordersList.innerHTML = '';
      data.orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.classList.add('order-item');
        orderElement.innerHTML = `
          <p>Order ID: ${order.id}</p>
          <p>Total: $${order.total}</p>
          <p>Date: ${order.date}</p>
          <hr>
        `;
        ordersList.appendChild(orderElement);
      });
    })
    .catch(error => console.error('Error fetching user details:', error));
}


function checkNotifications() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('signup_success')) {
    showNotification('Account created successfully. You can now log in.');
  } else if (urlParams.has('signup_error')) {
    const error = urlParams.get('signup_error');
    switch (error) {
      case 'invalid_email':
        showNotification('Invalid email format. Please try again.');
        break;
      case 'email_exists':
        showNotification('This email is already registered. Please use a different email.');
        break;
      case 'database_error':
        showNotification('An error occurred while creating your account. Please try again.');
        break;
      case 'invalid_request':
        showNotification('Invalid request. Please try again.');
        break;
      default:
        showNotification('Signup failed. Please try again.');
        break;
    }
  }
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }
}

const products = [
  { id: 1, name: 'Green Tshirt', price: 59.99, category: 'tshirt', image: 'resources/green.webp' },
  { id: 2, name: 'Yellow Tshirt', price: 59.99, category: 'tshirt', image: 'resources/yellow.webp' },
  { id: 3, name: 'Blue Tshirt', price: 59.99, category: 'tshirt', image: 'resources/blue.webp' },
  { id: 4, name: 'Pink Tshirt', price: 59.99, category: 'tshirt', image: 'resources/pink.webp' },
  { id: 5, name: 'Pink Hoodie', price: 99.99, category: 'hoodie', image: 'resources/Phoodie.webp' },
  { id: 6, name: 'White Hoodie', price: 99.99, category: 'hoodie', image: 'resources/Whoodie.webp' },
  { id: 7, name: 'Green Hoodie', price: 99.99, category: 'hoodie', image: 'resources/Ghoodie.webp' },
  { id: 8, name: 'Yellow Hoodie', price: 99.99, category: 'hoodie', image: 'resources/Yhoodie.webp' },
];

function loadTshirts() {
  const tshirts = products.filter(product => product.category === 'tshirt');
  const productContainer = document.querySelector('#tshirts .product-list');
  productContainer.innerHTML = '';

  tshirts.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    productElement.innerHTML = `
      <a href="product_detail.html?id=${product.id}">
<img src="${product.image}" alt="${product.name}" >
        <h3>${product.name}</h3>
        <p>${product.price.toFixed(2)} Lei</p>
      </a>
    `;
    productContainer.appendChild(productElement);
  });
}

function loadHoodies() {
  const hoodies = products.filter(product => product.category === 'hoodie');
  const productContainer = document.querySelector('#hoodies .product-list');
  productContainer.innerHTML = '';

  hoodies.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    productElement.innerHTML = `
      <a href="product_detail.html?id=${product.id}">
	<img src="${product.image}" alt="${product.name}" >
        <h3>${product.name}</h3>
        <p>${product.price.toFixed(2)} Lei</p>
      </a>
    `;
    productContainer.appendChild(productElement);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  if (loggedIn) {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('account').classList.remove('hidden');
    loadAccountDetails();
  } else {
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('account').classList.add('hidden');
  }
});

function logout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('userName');
  fetch('logout.php')
    .then(response => {
      if (!response.ok) {
        console.error('Network response was not ok:', response.statusText);
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        window.location.href = 'index.html';
      } else {
        console.error('Logout failed:', data);
        showNotification('Logout failed. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error during logout:', error);
      showNotification('Error during logout. Please check your network connection.');
    });
}


function loadAccountDetails() {
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  if (userName && userEmail) {
    document.getElementById('user-name').innerText = userName;
    document.getElementById('user-email').innerText = userEmail;
  } else {
    fetch('user_details.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.getElementById('user-name').innerText = data.user.name;
          document.getElementById('user-email').innerText = data.user.email;
          localStorage.setItem('userName', data.user.name);
          localStorage.setItem('userEmail', data.user.email);
        } else {
          console.error('Failed to load user details:', data);
        }
      })
      .catch(error => console.error('Error fetching user details:', error));
  }
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 4000);
  }
}


function toggleAccountMenu() {
  var menu = document.getElementById("accountMenu");
  menu.classList.toggle("show");
}

function navigateAndOpenTab(event, tabName) {
  event.preventDefault();
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  if (loggedIn) {
    localStorage.setItem('openTab', tabName);
    window.location.href = 'account.html';
  } else {
    window.location.href = 'account.html';
  }
}


function loadOrders() {
  fetch('user_orders.php')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = ''; // Clear existing orders
        data.orders.forEach(order => {
          const orderItem = document.createElement('div');
          orderItem.className = 'order-item';
          orderItem.innerHTML = `
            <h4>Order #${order.id}</h4>
            <p>Date: ${order.order_date}</p>
            <p>Total Price: $${order.total_price}</p>
            <p>Shipping Name: ${order.shipping_name}</p>
            <p>Shipping Address: ${order.shipping_address}, ${order.shipping_city}, ${order.shipping_zip}</p>
            <p>Shipping Method: ${order.shipping_method}</p>
            <h5>Items:</h5>
            <ul>
              ${order.items.map(item => `
                <li>${item.name} - ${item.quantity} x $${item.price}</li>
              `).join('')}
            </ul>
          `;
          ordersList.appendChild(orderItem);
        });
      } else {
        console.error('Failed to load orders:', data);
      }
    })
    .catch(error => console.error('Error fetching orders:', error));
}

window.removeFromCart = removeFromCart;



document.addEventListener("DOMContentLoaded", () => {
  const cartLinkPC = document.querySelector('.cart-container .cart-link');
  const cartDropdownPC = document.querySelector('.cart-container .cart-dropdown');
  const cartLinkMobile = document.querySelector('.cart-container1 .cart-link1');
  const cartDropdownMobile = document.querySelector('.cart-container1 .cart-dropdown');

  if (cartLinkPC && cartDropdownPC) {
    cartLinkPC.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = cartLinkPC.getAttribute('href');
    });

    cartLinkPC.addEventListener('mouseover', () => {
      cartDropdownPC.classList.add('open');
    });

    cartLinkPC.addEventListener('mouseout', () => {
      cartDropdownPC.classList.remove('open');
    });

    cartDropdownPC.addEventListener('mouseover', () => {
      cartDropdownPC.classList.add('open');
    });

    cartDropdownPC.addEventListener('mouseout', () => {
      cartDropdownPC.classList.remove('open');
    });
  }

  if (cartLinkMobile && cartDropdownMobile) {
    cartLinkMobile.addEventListener('click', (e) => {
      e.preventDefault();
      cartDropdownMobile.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!cartLinkMobile.contains(e.target) && !cartDropdownMobile.contains(e.target)) {
        cartDropdownMobile.classList.remove('open');
      }
    });

    const goToCartButton = cartDropdownMobile.querySelector('.LinkButton.Primary');
    if (goToCartButton) {
      goToCartButton.addEventListener('click', () => {
        window.location.href = goToCartButton.getAttribute('href');
      });
    }
  }

  document.querySelectorAll('.LinkButton, .NavLink').forEach(link => {
    link.addEventListener('click', (event) => {
      let href = event.target.getAttribute('href') || event.target.getAttribute('data-href');

      if (href) {
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          event.preventDefault();
          updateCurrentSectionIndex(targetId);
          scrollToSection(currentSectionIndex, otherScrollDuration);
        } else {
          window.location.href = href;
        }
      } else {
        console.error('The href attribute is missing or invalid for the clicked link.');
      }
    });
  });
});


