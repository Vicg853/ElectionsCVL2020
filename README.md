### Elections CVL Lycée Pasteur
This project was a voting system webpage for my school. The idea was to make a voting website, where people would be able to vote on the candidates for the student council (Conseil de Vie Licéene in french --> CVL)...
In summary, the system worked with the verification of students registration I.D. given by the school for each one of them, that were both unique and private. The next step was to chose the candidate and finaly finish the voting. 

The full app, contains a: fontEnd service with the main voting interface and listing and three other APIs for voting, authorization/authentication and administration (candidates/voting campain/user/admini creation and management).
The system isn't live anymore, but it is supposed to run on microservices achitecture (e.g.: using Kubernetes + Docker) and using MongoDB database

> This branch only contains front_end code

## Installation (master branch: front_end)
##### First, let's download the project
_Must have: [Node.Js](https://nodejs.dev/) installed_
##### With git clone the repository (or download and extract the zip file)
```bash
git clone https://github.com/Vicg853/ElectionsCVL2020.git
cd ElectionsCVL2020
```
<details>
    <summary>_In case you downloaded and extracted the Zip file_</summary>
    <p>
        ```cd [download repository path]/ElectionsCVL2020```
    </p>
</details>

##### Then use [NPM](https://docs.npmjs.com/) package manager to download dependencies and run the project...
```bash
npm install
```
_For development run..._
```bash
gatsby develop
```
_...Or for production run_
```bash
gatsby build
gatsby serve
```
##### Now you should be able to access the project on your brwoser...
...Just access [Localhost 8000](http://localhost:8000/) if in dev mode or [Localhost 9000](http://localhost:9000/) in prod mode.

- - - - 

## Technologies used
- [Gatby.js](https://gatsbyjs.com/) React based framework for static page generation, version 2.19.7
- [Express.js](https://expressjs.com/) Node.js Web server framework, version 4.17.1
- [React](reactjs.org) Javascrip library to generate user interfaces, version 16.12.0
- [Redux](https://redux.js.org/) Javascript state management library, version 4.0.5
- [JsonWebToken](https://jwt.io/), version 8.5.1
