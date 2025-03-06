FROM php:8.3-apache

# Install required extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Enable mod_rewrite (if using Apache)
RUN a2enmod rewrite

# Restart Apache
CMD ["apache2-foreground"]
