## Description

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">DEVELOPING API WITH NODEJS</h3>

  <p align="center">
    A backend application built with NodeJS (Javascript)
    <br />
    <a href="https://github.com/10deyon/Node-Projects.git">Report Bug</a>
    ·
    <a href="https://github.com/10deyon/Node-Projects.git">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Stack](#stack)
- [Getting Started](#getting-started)
  - [Documentation](#documentation)
  - [Initial setup](#initial-setup)
  - [Running the project](#running-the-project)
  - [Environment Variables](#environment-variables)
  - [Command List](#command-list)
- [Authors](#authors)

## Stack

This application was built with:

- [NodeJS](https://nodejs.org/en/)
- [Postman](https://www.postman.com/)

<!-- GETTING STARTED -->
## Getting Started

Please check the official lumen installation guide for server requirements before you start. [Official Documentation](https://lumen.laravel.com/docs/8.x)

### Documentation

Documentation can be found via [Postman Collection](https://documenter.getpostman.com/view/3903375/UVyvwvBy)

### Initial setup

1. To clone the repo on your local machine,

   `open the bash terminal`

- Type the command: with **https** </br>
  `git clone https://github.com/10deyon/Node-Projects.git`

- or with **ssh**
  `git clone git@github.com:10deyon/sociabl-backend.git`

2. Switch to the repo folder
   `cd sociabl-backend`
   
3. Install all the dependencies using composer
   `npm install`

4. Copy the example env file and make the required configuration changes in the .env file
   `cp config.env.example config.env`

5. Set the necessary keys in config.env file

### Running the project
   `npm run start:dev`

   `npm run start:prod`

   The root url of the api is:
   `http://localhost:3000/api/`

### Environment variables
   `.env` - ***Note*** : You can quickly set the database information and other variables in this file and have the application fully working.

### TL;DR Command List
   `git clone https://github.com/10deyon/Node-Projects.git`

   `cd sociabl-backend`
   
   `npm install`
   
   `cp .env.example .env`
   
   **Make sure you set the correct database connection information before running the migrations in the .env file** [Environment variables](#environment-variables)
   
   `php artisan migrate`
   
   `php artisan db:seed`
   
   `npm run start:dev`
   
   `npm run start:prod`

<!-- Authors -->
## Authors
1. <a href="https://github.com/10deyon" target="_blank">Emmanuel Deyon, Avoseh</a>
