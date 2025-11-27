FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev sqlite3 libsqlite3-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/api

# Copy Laravel app
COPY apps/api .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/api \
    && chmod -R 755 /var/www/api/storage \
    && chmod -R 755 /var/www/api/bootstrap/cache

# Create SQLite database if not exists
RUN touch /var/www/api/database/database.sqlite \
    && chown www-data:www-data /var/www/api/database/database.sqlite

EXPOSE 9000

CMD ["php-fpm"]
