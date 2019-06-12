# passport_programming_challenge
Full stack web application which features for realtime tree update.

## Running

Install Dependencies
```npm install```

Start Server
```npm start```

Run Tests
```npm test```

Visit [localhost:3000](http://localhost:3000)


## Technologies used

* **Front-End** : HTML, CSS, JavaScript, JQuery.
* **Back-End**  : Node, Express, Socket.io.
* **Database**  : MongoDB with Mongoose.
* **Testing**   : Mocha, Chai and Supertest.


## Project Structure

* **app.js**  : Entry point for application.
* **public**  : Contains client side code like index.html, javascript and CSS files.
* **models**  : Contains Database Schema.
* **test**    : Contains testcases for API's.
* **routes**  : Contains files for handeling API requests.
* **helpers** : Contains helper files.

## Notes

* Rate Limiter is implemented to prevent Denial-of-service(DOS) attack.
* Input field validation includes prevention of any script injection's.
