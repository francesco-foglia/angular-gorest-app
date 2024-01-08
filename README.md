# Angular Gorest App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Other resources used

[Angular Material](https://material.angular.io/) <br>
[Tailwind CSS](https://tailwindcss.com/)

## Functionality

### Login

To log in, the screen only accepts a special token which must be generated by accessing this page with your browser https://gorest.co.in/consumer/login. The token is then used for session control in the Angular application and to invoke the REST API via HTTP Bearer Token.

### Main page – User list

View users with basic information. Ability to view a number of records of your choice and perform searches. On this page you can add or remove a user.

### User detail page

User detail page with all available information. The list of posts of the displayed user and the comments relating to each post are also available on the page. Ability to insert comments on each post.

### Post list

View all posts in the system with the possibility of carrying out searches. You can view comments on each post. You can also insert new posts.

### Multi-module and lazy loading

The application is created by separating the functionalities into modules, downloaded in lazy loading.

### Logout

Provides the logout functionality for the user.

## Try the app

https://angular-gorest-app.vercel.app

## Project setup

### Install [Node.js](https://nodejs.org/)

### Clone the repository

```
git clone https://github.com/francesco-foglia/angular-gorest-app
```

### Install the dependencies

```
npm install
```

### Run the app

```
ng serve
```

## Screenshots

### Login

![Login](/src/assets/readme-img/login.png)

### Main page – User list

![User list](/src/assets/readme-img/user-list.png)

### User detail page

![User page](/src/assets/readme-img/user-page.png)

### Post list

![Post list](/src/assets/readme-img/post-list.png)
