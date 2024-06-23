# Joash

# Aplicație Web Magazin de Îmbrăcăminte

Acest document oferă o prezentare generală a aplicației web pentru magazinul de îmbrăcăminte, detaliind livrabilele proiectului, informațiile despre repository, pașii de compilare, instalare și lansare.

## Repository

Codul sursă complet pentru acest proiect este disponibil pe GitHub:
[Repository Aplicație Web Joash](https://github.com/OtnielToma/Joash)

## Hosting Live

Proiectul este hostat live pe o instanță EC2 de AWS și este accesibil la adresa: [www.joash.store](http://www.joash.store)

## Fisierele Proiectului

Proiectul cuprinde următoarele fișiere și directoare principale:

- `account.html`: Pagină cont utilizator
- `auth.php`: Script de autentificare
- `cart.html`: Pagină coș de cumpărături
- `composer.json`: Fișier de configurare Composer
- `composer.lock`: Fișier de blocare Composer
- `db.php`: Script de conectare la baza de date
- `index.html`: Pagina principală
- `login.html`: Pagină de autentificare
- `login.php`: Script de autentificare
- `logout.php`: Script de deconectare
- `main.js`: Fișier JavaScript principal
- `menu.js`: Fișier JavaScript pentru meniu
- `order_debug.log`: Jurnal de depanare pentru comenzi
- `order_details.php`: Script pentru detalii comandă
- `order-app`: Aplicație pentru comenzi
- `package-lock.json`: Fișier de blocare npm
- `package.json`: Fișier de configurare npm
- `phpinfo.php`: Script PHP pentru informații PHP
- `phpMyAdmin`: Director pentru phpMyAdmin
- `place_order.php`: Script pentru plasarea comenzilor
- `postcss.config.js`: Fișier de configurare PostCSS
- `product_detail.html`: Pagină detalii produs
- `README.md`: Documentația proiectului
- `robots.txt`: Fișier robots.txt
- `send_verification_email.js`: Script pentru trimiterea emailurilor de verificare
- `sendEmail.js`: Script pentru trimiterea emailurilor
- `signup.html`: Pagină de înregistrare
- `signup.php`: Script de înregistrare
- `sitemap.xml`: Fișier sitemap
- `styles.css`: Fișier CSS principal
- `user_details.php`: Script pentru detalii utilizator
- `user_orders.php`: Script pentru comenzi utilizator
- `vendor`: Director pentru dependențele Composer
- `verify.php`: Script pentru verificarea emailurilor

## Vizualizare Rapidă

Pentru a vizualiza rapid aplicația, fișierul index.html va deschide pagina principală a aplicației web, oferind acces la toate paginile acesteia. Totuși, anumite funcționalități (logare, înregistrare, plasare comandă și trimiterea de emailuri) nu vor fi disponibile din cauza lipsei serviciilor necesare pentru acestea.


## Schema Bazei de Date

Aplicația folosește MariaDB pentru gestionarea bazei de date. Principalele tabele din baza de date sunt:

### Tabelul `users`
| Câmp     | Tip          | Null | Cheie | Implicit | Extra          |
|----------|--------------|------|-------|----------|----------------|
| id       | int(11)      | NO   | PRI   | NULL     | auto_increment |
| name     | varchar(100) | NO   |       | NULL     |                |
| email    | varchar(100) | NO   | UNI   | NULL     |                |
| phone    | varchar(15)  | YES  |       | NULL     |                |
| password | varchar(255) | NO   |       | NULL     |                |

### Tabelul `orders`
| Câmp             | Tip          | Null | Cheie | Implicit             | Extra          |
|------------------|--------------|------|-------|----------------------|----------------|
| id               | int(11)      | NO   | PRI   | NULL                 | auto_increment |
| user_id          | int(11)      | NO   | MUL   | NULL                 |                |
| total_price      | decimal(10,2)| NO   |       | NULL                 |                |
| order_date       | timestamp    | YES  |       | current_timestamp()  |                |
| shipping_name    | varchar(255) | NO   |       | NULL                 |                |
| shipping_address | varchar(255) | NO   |       | NULL                 |                |
| shipping_city    | varchar(255) | NO   |       | NULL                 |                |
| shipping_zip     | varchar(20)  | NO   |       | NULL                 |                |
| shipping_method  | varchar(50)  | NO   |       | NULL                 |                |

### Tabelul `products`
| Câmp     | Tip          | Null | Cheie | Implicit | Extra          |
|----------|--------------|------|-------|----------|----------------|
| id       | int(11)      | NO   | PRI   | NULL     | auto_increment |
| name     | varchar(255) | NO   |       | NULL     |                |
| price    | decimal(10,2)| NO   |       | NULL     |                |
| category | varchar(255) | NO   |       | NULL     |                |
| sizes    | varchar(255) | NO   |       | NULL     |                |

### Tabelul `order_details`
| Câmp       | Tip          | Null | Cheie | Implicit | Extra          |
|------------|--------------|------|-------|----------|----------------|
| id         | int(11)      | NO   | PRI   | NULL     | auto_increment |
| order_id   | int(11)      | NO   | MUL   | NULL     |                |
| product_id | int(11)      | NO   | MUL   | NULL     |                |
| quantity   | int(11)      | NO   |       | NULL     |                |
| price      | decimal(10,2)| NO   |       | NULL     |                |
| size       | varchar(5)   | NO   |       | NULL     |                |

## Instrucțiuni de Instalare și Lansare

### Cerințe Prealabile

Asigurați-vă că următoarele servicii și unelte sunt instalate pe sistemul dumneavoastră:

- PHP
- Node.js
- npm
- Composer
- MariaDB
- phpMyAdmin (opțional)

### Instalarea PHP

1. **Pentru Ubuntu:**
   ```sh
   sudo apt update
   sudo apt install php libapache2-mod-php php-mysql
   ```

2. **Pentru Windows:**
   Descărcați instalatorul PHP de pe [php.net](https://www.php.net/downloads) și urmați acești pași:
   - Rulați instalatorul și urmați instrucțiunile de pe ecran.
   - Adăugați PHP în PATH-ul sistemului editând variabilele de mediu.

### Instalarea Node.js și npm

1. **Pentru Ubuntu:**
   ```sh
   curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

2. **Pentru Windows:**
   Descărcați instalatorul Node.js de pe [nodejs.org](https://nodejs.org/en/download/) și urmați acești pași:
   - Rulați instalatorul și urmați instrucțiunile de pe ecran.
   - Verificați instalarea deschizând Command Prompt și rulând:
     ```sh
     node -v
     npm -v
     ```

### Instalarea Composer

1. **Pentru Ubuntu:**
   ```sh
   sudo apt update
   sudo apt install curl php-cli php-mbstring git unzip
   curl -sS https://getcomposer.org/installer | php
   sudo mv composer.phar /usr/local/bin/composer
   ```

2. **Pentru Windows:**
   Descărcați și rulați Composer-Setup.exe de pe [getcomposer.org](https://getcomposer.org/download/) și urmați acești pași:
   - Rulați instalatorul și urmați instrucțiunile de pe ecran.
   - Verificați instalarea deschizând Command Prompt și rulând:
     ```sh
     composer -v
     ```

### Instalarea MariaDB

1. **Pentru Ubuntu:**
   ```sh
   sudo apt update
   sudo apt install mariadb-server
   sudo systemctl start mariadb
   sudo mysql_secure_installation
   ```

2. **Pentru Windows:**
   Descărcați și instalați MariaDB de pe [mariadb.org](https://mariadb.org/download/).

### Pași de Instalare

1. **Clonați repository-ul:**
   ```sh
   git clone https://github.com/OtnielToma/Joash
   cd Joash
   ```

2. **Instalați dependențele PHP:**
   ```sh
   composer install
   ```

3. **Instalați dependențele Node.js:**
   ```sh


   npm install
   ```

4. **Configurați baza de date:**
   - Deschideți MariaDB și creați o nouă bază de date numită `clothing_shop`.
   - Importați schema bazei de date din fișierul SQL furnizat.
   - Actualizați fișierul `db.php` cu detaliile de conexiune la baza de date.
   - Crearea bazei de date
   ```sh
   CREATE DATABASE clothing_shop;

   USE clothing_shop;

   CREATE TABLE users (
      id INT(11) NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      phone VARCHAR(15),
      password VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
   );

   CREATE TABLE orders (
      id INT(11) NOT NULL AUTO_INCREMENT,
      user_id INT(11) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      shipping_name VARCHAR(255) NOT NULL,
      shipping_address VARCHAR(255) NOT NULL,
      shipping_city VARCHAR(255) NOT NULL,
      shipping_zip VARCHAR(20) NOT NULL,
      shipping_method VARCHAR(50) NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (user_id) REFERENCES users(id)
   );

   CREATE TABLE products (
      id INT(11) NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      sizes VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
   );

   CREATE TABLE order_details (
      id INT(11) NOT NULL AUTO_INCREMENT,
      order_id INT(11) NOT NULL,
      product_id INT(11) NOT NULL,
      quantity INT(11) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      size VARCHAR(5) NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
   );
   ```

### Lansarea Aplicației

1. **Porniți serverul de dezvoltare PHP:**
   ```sh
   php -S localhost:8000
   ```

2. **Accesați aplicația în browserul web:**
   ```
   http://localhost:8000
   ```

## Informații Suplimentare

- Pentru trimiterea emailurilor, asigurați-vă că ați configurat scripturile `send_verification_email.js` și `sendEmail.js` cu detaliile furnizorului de servicii de email.
- Utilizați `phpMyAdmin` pentru gestionarea bazei de date (opțional).

Aceasta ar trebui să ofere toate informațiile necesare pentru a pune în funcțiune aplicația web pentru magazinul de îmbrăcăminte Joash pe un sistem nou.
