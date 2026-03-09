FROM php:8.2-apache

# Enable Apache modules
RUN a2enmod rewrite

# Install MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

# Copy backend files
COPY backend/ /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expose port
EXPOSE 80

CMD ["apache2-foreground"]
