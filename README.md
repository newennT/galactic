# Galactic

Galactic est une application d'apprentissage du gallo. Elle est structurée en chapitres, qui contiennent des leçons et des exercices interactifs.

## Installer le projet
Install with Docker :
- clone repo
- `docker compose up -d`  
- Start frontend with  `cd frontend` ans `ng serve`

## Technologies
### Frontend
- Angular 16.2.0
- Angular Material

### Backend
- Node 18
- Express
- Sequelize
- MySQL

### Deployment
- Docker

## Features
### User mode
- Connection
- Signup
- Read chapters
- Take exercises
- See feedbacks

### Admin mode
- Connection
- Create, Read, Update, Delete chapters
- Create, Read, Update, Delete Users

## Structure
### Front
In src/app : 
<ul>
    <li>about</li>
    <li>admin</li>

    <li>auth</li>
    <li>chapters</li>
    <li>core</li>
    <li>dashboard</li>
    <li>home</li>
    <li>not-found</li>
    <li>shared</li>
</ul>

### Back