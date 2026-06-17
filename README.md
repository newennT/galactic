# Galactic

Galactic is a Gallo language learning application. It is organized into chapters, each containing lessons and interactive exercises.

## Architecture
Angular → REST API → Node.js / Express → Sequelize → MySQL

## Install 
### Prerequisites
- Docker
- Docker compose
- Node.js 18
- Angular CLI

## Setup
- clone repo `git clone https://github.com/newennT/galactic.git`
- `cd galactic`
- `docker compose up -d`  
- Start frontend with  `cd frontend` and `ng serve`
- Open in http://localhost:4200

## Technologies
### Frontend
- Angular 16.2.0
- Angular Material

### Backend
- Node.js 18
- Express
- Sequelize
- MySQL

### Deployment
- Docker

## Features
### User mode
- Login
- Signup
- Read lessons
- Complete interactive exercises
- View exercise feedback

### Admin mode
- Log in
- Manage chapters
- Manage lessons
- Manage users
- Publish content

## Structure
### Front
In frontend/src/app : 
- about
- admin
- auth
- chapters
- core
- dashboard
- home
- not-found
- shared

### Back
In `backend/src`:
- auth
- controllers
- db
- models
- routes
- services

## Test
### Front
Runs Angular unit tests \
Run `npm test`

### Back
Runs API and business logic tests \
Run `npm run test`