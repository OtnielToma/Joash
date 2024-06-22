document.addEventListener("DOMContentLoaded", () => {
  if (typeof setupAccountPage === 'function') {
    setupAccountPage();
  } else {
    console.error('setupAccountPage function is not defined.');
  }

  const isMobile = window.innerWidth <= 768;
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const menuItems = document.querySelectorAll('.menu-item');

  if (hamburgerMenu && dropdownMenu && menuItems.length > 0) {
    setupMenu(isMobile, hamburgerMenu, dropdownMenu, menuItems);
    hamburgerMenu.addEventListener('click', toggleMenu);
  }

});

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
            ordersList.innerHTML = '<p>You currently have no orders.</p>';
          }
        } else {
          showNotification(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);

        // Check if the current page is account.html
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
      window.location.href = 'account.html#login';
    }, 3000); // Redirect after showing notification
  }
}

function setupMenu(isMobile, hamburgerMenu, dropdownMenu, menuItems) {
  if (isMobile) {
    hamburgerMenu.style.display = 'block';
    dropdownMenu.style.display = 'none';
    menuItems.forEach(item => item.addEventListener('click', handleMenuItemClick));
  } else {
    hamburgerMenu.style.display = 'none';
    dropdownMenu.style.display = 'none';
    menuItems.forEach(item => item.style.display = 'block');
  }
}

function handleMenuItemClick(event) {
  const href = event.target.getAttribute('data-href');
  window.location.href = href;
}

function toggleMenu() {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const menuItems = document.querySelectorAll('.menu-item');

  if (hamburgerMenu && dropdownMenu && menuItems.length > 0) {
    const isActive = dropdownMenu.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
    menuItems.forEach((item, index) => {
      item.style.animation = isActive ? `menuItemFadeIn 0.5s forwards ${index * 0.2}s` : '';
    });
  }
}


function navigateToSection(href) {
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => item.classList.remove('active'));
  const activeItem = document.querySelector(`.menu-item[data-href="${href}"]`);
  if (activeItem) {
    activeItem.classList.add('active');
  }
  window.location.href = href;

  const dropdownMenu = document.querySelector('.dropdown-menu');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  if (dropdownMenu && hamburgerMenu) {
    dropdownMenu.classList.remove('active');
    hamburgerMenu.classList.remove('active');
  }
}

function setActiveMenuItem() {
  const currentPath = window.location.hash || window.location.pathname;
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    const href = item.getAttribute('data-href');
    if (href === currentPath || (href === "#home" && currentPath === "/")) {
      item.classList.add('active');
    }
  });
}
