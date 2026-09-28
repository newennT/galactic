# Galactic

Galactic is a Gallo language learning application. It is organized into chapters, each containing lessons and interactive exercises.

## Context
Galactic was developed in a professional context for the Institut du Galo, as part of a project dedicated to learning and promoting the Gallo language.

The application was developed as a functional prototype but was not deployed to production.

This repository has been adapted for public presentation:

- The Institut du Galo's visual identity has been removed.
- Logos, branding, and organization-specific content have been removed or replaced.
- References to the original organization and its production environment have been anonymized.
- The application remains representative of the technical work carried out during the project.

## Architecture
The application follows a client-server architecture:
Angular → REST API → Node.js / Express → Sequelize → MySQL
The Angular frontend communicates with a REST API developed with Node.js and Express. Sequelize is used as the ORM between the backend and the MySQL database.

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
- HTML/Sass

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

The main features are separated from shared and core functionality in order to keep the application structure modular and maintainable.

### Back
The backend exposes a REST API consumed by the Angular frontend. The main responsibilities of the API include:

- User authentication and account management
- Chapter and lesson retrieval
- Exercise management
- User progress and exercise validation
- Administrative content management

The Node.js / Express application is organized under backend/src:
- auth
- controllers
- db
- models
- routes
- services

The backend separates routing, controllers, business logic, authentication, and data models.

## Authentication 
The application distinguishes between regular users and administrators. Authentication is handled by the backend, while authorization determines which features and resources can be accessed depending on the user's role.

## Database
The application uses MySQL as its relational database. Sequelize provides the ORM layer between the Node.js application and the database, allowing application models to be mapped to relational tables and simplifying database queries and relationships.

## Testing
### Front
Runs Angular unit tests \
Run `npm test`

### Back
Runs API and business logic tests \
Run `npm run test`

## Development Notes

This repository is intended as a technical showcase of a professional development project.

Because the original application was developed for an organization and was not intended to be published as open source, organization-specific assets and content have been removed from this version.

The repository therefore focuses on the application's architecture, code organization, features, and technical implementation rather than reproducing the original project's branding or production content.

## Screenshots

<img width="400" alt="login" src="https://github.com/user-attachments/assets/62fffe5e-480f-4205-9ff2-a696f05713ab" />
<img width="400" alt="Screenshot 2026-09-28 at 22-49-47 Galactic" src="https://github.com/user-attachments/assets/5a855c6c-a9e7-46b8-8dc5-85075bcca25e" />
<img width="400" alt="Screenshot 2026-09-28 at 22-50-13 Galactic" src="https://github.com/user-attachments/assets/5d879195-ddb8-4dc1-9d6b-2d3f7ca8d0b8" />
<img width="400" alt="Screenshot 2026-09-28 at 22-48-58 Galactic" src="https://github.com/user-attachments/assets/55adb34e-e3e5-49df-adcf-161a629ed6c5" />
