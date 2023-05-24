# Movie Database

## Capstone Two Proposal version 1.1

### James "Robbie" Gathje

Tech Stack: [The Movie Database](https://developer.themoviedb.org/docs), JavaScript, React, Node.js, Express.js

What is the project being proposed and why?<br>
The project being proposed is a movie database web-application (website) intended to equally demonstrate my front-end & back-end skills as a full-stack developer.

What goal is this website designed to achieve?<br>
The site is centered around user-created watch lists. Essentially, the site acts as a personal database for your favorite movies, tv shows, and people in the film & tv industry. Users are empowered to create lists of whatever kind they'd like: watch later, favorite  actors/actresses, best Rom-Coms, etc. And those lists are publicly shareable!

Who are its intended users (i.e. their demographics)?<br>
Film buffs, binge watchers, streaming savants, or anyone interested in knowing more about the content they consume. However, the app is only available in English, and the content it references is localized to the United States. Particularly, any reference to streaming service availability is a reference only to US availibility on that platform. Generally, the app is intended for the internet-centric generations of Gen Z and Millenials, approximately ages 13-43, but it could very well appeal more broadly, considering the vast, ageless appeal of television and movie content.

What data does it use?<br>
The app requires detailed movie & tv series data that includes: who played what role, streaming service availability, MPA or TV Parental Guidelines rating, runtime, number of seasons & episodes in each season, and similar details. Additionally, the app requires users to register with a username & password in order to access list-creation features. Movie, TV, and related data is acquired through [The Movie Database](https://developer.themoviedb.org/docs).

What does its database schema look like?

![Database Schema Diagram](docs/database_schema.png)

What kinds of issues might its API(s) cause?<br>
[The Movie Database](https://developer.themoviedb.org/docs) is very lightly rate limited (~50 requests per second), so it shouldn't be a major issue, but all code for the site needs to avoid making API calls in large batches.

What sensitive information does it secure?<br>
Passwords are secured and must be properly encrypted. Usernames are also secured. However, usernames are only shared between users, or with the public, if a user chooses to share one of their lists. Anyone with the link to that list would have knowledge of that user's username.

What functionality does it include?

1. User Registration, Security, and Authorization - login/logout
2. Customizable, Shareable Watch Lists - users are enabled to create, edit, and share lists of content (movies/tv series) and/or people (actors, actresses, directors, writers, etc.) of their own categorization (favorite movies, favorites actors, best Rom-Coms, etc.).
3. Movie Database & Reference - general information on any movie, tv series, or person in the industry

What does its user flow look like?

![User Flow Diagram](docs/user_flow_diagram.png)

What features does it have beyond basic CRUD (Create, Read, Update, Delete)?<br>
The base version of the app is built on user-created, shareable lists of movies, tv shows, and/or people.

What stretch goals / extra features could be achieved / implemented?<br>
There are three stretch goals.

1. New & upcoming releases
2. Theatre showtimes
3. Allow users to store which streaming services they subscribe to and prominently display whether or not they are presently able to stream any particular movie or tv show they are searching for.