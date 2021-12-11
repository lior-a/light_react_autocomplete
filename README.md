# How to run project

1. npm install
2. npm start
3. open http://localhost:3000/

Important developer notes:
1. app.js is our "demo" page and src/autocomplete is our component with 2 examples of functional and class component. 
2. in production we'll want to bundle, build and export /src/autocomplete and of course choose functional or class component as our design.
3. inside src/autocomplete we have functionalcomponentAC.js and classComponentAC.js (it's the bonus, in production ready we'll have one of those. not two)


# Run json mock api server
1. cd /json-mock-api
2. npm i
3. npm start
4. curl http://localhost:3004/names
5. change /src/app lines with axios to fetch data from json server