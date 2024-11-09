



## Deployment

* [See on vercel](https://inventory-application-phi.vercel.app/)


<!-- GETTING STARTED -->
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need `Node.js` and `npm` installed globally on your machine.
* [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/oddtO/inventory-application.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Initialize database with schema and data (can use .env.local, .env.production or any other .env file)
   ```sh
   ENV_FILE=.env npm run dbinit
   ```
4. Run dev server on http://localhost:3000 (reads from .env.local file as specified in package.json)
   ```sh
   npm run start-dev
   ```
5. Compile for production
   ```sh
   npm run build
   ```


## Features

* Responsive design.
* Store data in Postgresql.
* Data divided into games, publishers, genres.
* A game can have one publisher but multiple genres.
* Display amount of games, publishers and genres in the dashboard.
* Display last added games in the dashboard.
* List all games of a specific publisher or genre.
* Ability to perform CRUD operations on games, publishers and genres.
* Text search games, publishers and genres.
* Deletion allowed only after entering a secret password.






## Built With

#### Technologies

* Typescript
* Express
* NodeJS
* Postgresql
* SCSS
* HTML
* EJS
* Git






<!-- AUTHORS -->
## Author

* [Github](https://github.com/oddtO)
* [LinkedIn](https://www.linkedin.com/in/dmytro-yefimov-316690207/)
* [Dou](https://dou.ua/users/oddto/)
<p align="right">(<a href="#top">back to top</a>)</p>
