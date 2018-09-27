# Wordpress

In this section, we learn the REST API of [Wordpress][wordpress] v4.9.8.

## Preparation

### Installation

1. Install PHP and MySQL, e.g. via XAMPP, LAMPP etc.
2. Install and setup Wordpress v4.9.8 using the admin account (see the table below)
3. Install plugin: [Basic Auth][basic-auth] to allow authorization via HTTP Basic Auth

### User accounts

Sign in using the admin account and create the following user accounts:

| email                       | username    | password    | role        | base64 encoded username:password     |
|-----------------------------|-------------|-------------|-------------|--------------------------------------|
| admin@localhost.com         | admin       | admin       | admin       | YWRtaW46YWRtaW4=                     |
| author@localhost.com        | author      | author      | author      | YXV0aG9yOmF1dGhvcg==                 |
| contributor@localhost.com   | contributor | contributor | contributor | Y29udHJpYnV0b3I6Y29udHJpYnV0b3I=     |
| editor@localhost.com        | editor      | editor      | editor      | ZWRpdG9yOmVkaXRvcg==                 |
| subscriber@localhost.com    | subscriber  | subscriber  | subscriber  | c3Vic2NyaWJlcjpzdWJzY3JpYmVy         |

[wordpress]: https://wordpress.org
[basic-auth]: https://github.com/WP-API/Basic-Auth
