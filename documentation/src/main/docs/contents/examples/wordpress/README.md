# Wordpress

In this section, we demonstrate how to learn the [REST API][rest] of the content management system [Wordpress][wordpress] v4.9.8.
This tutorial covers the article publishing process using different user roles that Wordpress offers.
The modelled symbols can be downloaded [here](./assets/symbols-wordpress-20181007.json) and imported into ALEX.

## Preparation

### Installation

1. Install PHP and MySQL, e.g. via XAMPP, LAMPP etc.
2. Install and setup Wordpress v4.9.8 using the admin account as seen the table below.
3. Install the [Basic Auth][basic-auth] plugin to allow authorization via HTTP Basic Auth.

### User accounts

Sign in using the admin account and create the following user accounts:

| email                       | username    | password    | role        |
|-----------------------------|-------------|-------------|-------------|
| admin@localhost.com         | admin       | admin       | admin       |
| author@localhost.com        | author      | author      | author      |
| employee@localhost.com      | employee    | employee    | employee    |
| editor@localhost.com        | editor      | editor      | editor      |
| subscriber@localhost.com    | subscriber  | subscriber  | subscriber  |

## Input symbols

The input alphabet consists of the following 11 symbols:

* **Create Post** Creates a new article.
* **Delete Post** Deletes the article.
* **Login \{Admin, Author, Contributor, Editor, Subscriber}** Sets the variable for which user to use for the requests.
* **Set Post \{Draft, Future, Pending, Private, Publish}** Sets the status of the article.

## Learning setup

We learned the REST API with the following configuration:

* *TTT* algorithm
* *Random word* equivalence oracle (min=100, max=100, words=100, seed=42)
* *HtmlUnit driver* (although not required, it has to be specified)

After about 23 minutes on an Intel Core i5-6600k, 16Gb RAM and an SSD, the learning process finished and produced an automaton model with 14 states. 
The final model can be downloaded [here](./assets/model-wordpress-20181007.dot) and inspected in the web-based dot rendering tool [WebGraphviz][webgraphviz].
The model reveals several interesting properties.
For example the path (0 -> 7 -> 8 -> 9) shows that the status of an article that has been created by an admin can only be changed by the admin himself.

[rest]: https://developer.wordpress.org/rest-api/
[wordpress]: https://wordpress.org
[basic-auth]: https://github.com/WP-API/Basic-Auth
[webgraphviz]: http://www.webgraphviz.com/
