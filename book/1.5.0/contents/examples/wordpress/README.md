# Learning Wordpress

<div class="alert alert-info">
    This example is not compatible with ALEX v1.5.0.
    There is a more up-to-date version of Wordpress and the REST API plugin out there. 
    We do not garantie that this tutorial still works.
</div>

This is a step by step instruction on how to test the REST API of Wordpress 4.4 with ALEX v1.3.0.

## Prepare Wordpress

1. Install PHP and MySQL, e.g. via XAMPP, LAMPP etc
2. Install Wordpress 4.4
3. Setup Wordpress using the admin account (see table)
4. Make sure Wordpress is accessible under http://localhost/wordpress
5. In the backend of Wordpress:
    2. Create the users as shown in the table except the admin
    3. Install plugin: __[WP API 2.0][1]__ for the REST API
    4. Install plugin: __[Basic Auth][2]__ to allow authentication via HTTP header
    5. Install plugin: __[Disable Check Comment Flood][3]__ to prevent HTTP 429 errors on too many comments
    6. Delete the default post "Hello Wold" from all posts
    7. Delete the default page
    8. Delete the default comment
    9. Use the default theme TwentyFifteen

## User accounts

| email                       | username    | password    | role        | base64 encoded username:password     |
|-----------------------------|-------------|-------------|-------------|--------------------------------------|
| admin@admin.com             | admin       | admin       | admin       | YWRtaW46YWRtaW4=                     |
| author@author.com           | author      | author      | author      | YXV0aG9yOmF1dGhvcg==                 |
| contributor@contributor.com | contributor | contributor | contributor | Y29udHJpYnV0b3I6Y29udHJpYnV0b3I=     |
| editor@editor.com           | editor      | editor      | editor      | ZWRpdG9yOmVkaXRvcg==                 |
| subscriber@subscriber.com   | subscriber  | subscriber  | subscriber  | c3Vic2NyaWJlcjpzdWJzY3JpYmVy         |

_The base64 encoded combination of username and password is only required for modelling new symbols that require authentication._

## Start a learning process

1. Start ALEX under a different port than 8000
2. Login as a user
3. Create a new project with the url *http://localhost/wordpress/wp-json/wp/v2*
3. Import symbols from the [wordpress-symbols.json](assets/wordpress-symbols.json)
4. Start learning, use symbol *reset* as reset symbol

## Results

Our tests with Wordpress have been executed on a computer with an quad core Intel Core i5-4670k CPU @3.40GHz, 16GB RAM and a Solid-State-Drive. 
It took us approximately two hours to model the symbols, which includes the familiarization with the REST API.

Wordpress has been learned with four algorithms, which are the L*, DHC, Discrimination Tree and the TTT.
For each test, an equivalence oracle has been chosen that randomly creates membership queries within a predefined length.
Here, we set it up to create 50 MQs with a minimum length of 25, a maximum length of 50 to approximate an equivalence query.

We modeled 19 symbols for logging in with different user roles and doing actions like creating, updating and deleting posts and handling comments.
The final hypothesis has 31 states, which can be seen [here](assets/wordpress-hypothesis.svg).

If you are interested in numbers, here are the statistics of how well different algorithms performed on the specified system.
Note that the L\* algorithm didn't even terminate after more than a day, so we terminated it manually.

| Algorithm | Time         | #States | #Symbols | #MQs  | #EQs   |
| --------- | ------------ | ------- | -------- | ----- | ------ |
| L\*       | -            | -       | -        | -     | -      |  
| DHC       | 4h 8min 15s  | 22      | 94104    | 13832 | 2      |
| DT        | 2h 20min 42s | 31      | 160850   | 8569  | 12     |
| TTT       | 1h 31min 18s | 31      | 109906   | 15322 | 16     |

## Further information

* As soon as you delete the database of ALEX or reset all counters, make sure to reset Wordpress database to its defaults, too. You can do that with the plugin [Wordpress Database Reset][4]
* For good results while learning, use the TTT algorithm in combination with the random word eq oracle (minLength=1, maxLength=50, randomWords=50)
* In the example hypothesis in the file _wordpress-hypothesis.svg_ only symbols related to posts and users have been used.

[1]: http://v2.wp-api.org/
[2]: https://github.com/WP-API/Basic-Auth
[3]: https://de.wordpress.org/plugins/disable-check-comment-flood/
[4]: https://de.wordpress.org/plugins/wordpress-database-reset/
