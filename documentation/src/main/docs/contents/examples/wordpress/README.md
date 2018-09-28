# Wordpress

In this section, we learn the [REST API][rest] of the content management system [Wordpress][wordpress] v4.9.8.

## Preparation

### Installation

1. Install PHP and MySQL, e.g. via XAMPP, LAMPP etc.
2. Install and setup Wordpress v4.9.8 using the admin account (see the table below)
3. Install plugin: [Basic Auth][basic-auth] to allow authorization via HTTP Basic Auth

### User accounts

Sign in using the admin account and create the following user accounts:

| email                       | username    | password    | role        |
|-----------------------------|-------------|-------------|-------------|
| admin@localhost.com         | admin       | admin       | admin       |
| author@localhost.com        | author      | author      | author      |
| contributor@localhost.com   | contributor | contributor | contributor |
| editor@localhost.com        | editor      | editor      | editor      |
| subscriber@localhost.com    | subscriber  | subscriber  | subscriber  |

[rest]: https://developer.wordpress.org/rest-api/
[wordpress]: https://wordpress.org
[basic-auth]: https://github.com/WP-API/Basic-Auth
