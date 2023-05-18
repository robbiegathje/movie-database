# Movie Database

## Capstone Two Proposal

### James "Robbie" Gathje

Tech Stack: JavaScript, React, Node.js, Express.js

What goal is this website designed to achieve?<br>
The site is centered around user-created watch lists. Essentially, the site acts as a personal database for your favorite movies, tv shows, and people in the film & tv industry. Users are empowered to create lists of whatever kind they'd like: watch later, favorite  actors/actresses, best Rom-Coms, etc. And those lists are publicly shareable!

Who are its intended users (i.e. their demographics)?<br>
Film buffs, binge watchers, streaming savants, or anyone interested in knowing more about the content they consume. Who's that actor? Should I really watch this show, what have other people thought about it? Ooo, I don't want to forget to watch that, I'll add it to my Watch Later! Really anyone who asks or thinks along those lines.

What data does it use?<br>
Generally, the app requires detailed movie & tv series data that includes: who played what role, streaming service availability, MPAA or TV Parental Guidelines rating, runtime, number of seasons & episodes in each season, and similar details. This can all be found through [The Movie Database](https://developer.themoviedb.org/docs) and/or [The Open Movie Database](https://www.omdbapi.com/).

What does its database schema look like?<br>
The database will contain a users table, movies table, tv series table, people table, and lists table to link them all together. Essentially, one user can have many lists, one movie, tv series, or person (actor/actress) could be in many lists, and any given list links it all together with its own title and viewing permissions. Database schema diagram to come.

![Database Schema Diagram](docs/database_schema.png)

What kinds of issues might its API(s) cause?<br>
The Movie Database is very lightly rate limited (~50 requests per second), so it should not be a major issue, but the code for the site ought to avoid pages that require many API calls all at one time. The Open Movie Database has a daily limit of 1,000 requests per API Key that could prove troublesome with any kind of heavier site traffic.

What sensitive information does it secure?<br>
Passwords are secured and must be properly encrypted.

What functionality does it include?<br>
The website has basic login/logout functionality. Its main feature is allowing users to create customizable, shareable lists of movies, tv series, and/or people. Further than that, the app serves as an easily navigated database for any movie, tv show, actor, or actress that the user wants to learn more about.

What does its user flow look like?<br>
The main page displays search. From there, users are able to search for a tv show, movie, actor, or actress, explore the details page for any of their search results, and add any of their search results to any of their created lists. Along the navbar, the user will have access to their user profile, which will contain their lists. Accessing a list page allows a user to reorder it or remove particular items from it. Lists are publicly shareable by url and are able to be private, per the user's preference. User flow diagram to come.

![User Flow Diagram](docs/user_flow_diagram.png)

What features does it have beyond basic CRUD (Create, Read, Update, Delete)?<br>
The base version of the app is built on user-created, shareable lists of movies, tv shows, and/or people.

What stretch goals / extra features could be achieved / implemented?<br>
There are three stretch goals.

1. New & upcoming releases
2. Allow users to store which streaming services they subscribe to and prominently display whether or not they are presently able to stream any particular movie they are searching for.
3. Theatre showtimes