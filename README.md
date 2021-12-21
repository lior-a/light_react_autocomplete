# How to run project

1. cd /storybook/
2. npm i
3. npm run storybook
4. open http://localhost:6006/ 
5. work inside storybook/stories/LightAutocomplete

Publish a new version
1. npm i
2. edit package.json and bump a version
3. npm run build (this command execute production build with webpack and puts the files at dist folder)
4. npm publish


# Run json mock api server
1. cd /json-mock-api
2. npm i
3. npm start
4. curl http://localhost:3004/names
5. change /src/app lines with axios to fetch data from json server

# How to use LightAutocomplete
1. npm install light-react-autocomplete
2. write use this example:

```
let mock = ['user1' , 'user 2'];
let asyncMock = () => Promise.resolve({data: mock});

let autocompleteStyle = {
  width: 300
}

let listStyle = {
  width: 330
}
const myComp = () => {
    return <LightAutocomplete
    asyncCall={asyncMock}
    onSubmit={(e,selectedItem) => console.log('submit form!', e,selectedItem)}
    autocompleteStyle={autocompleteStyle}
    listStyle={listStyle}
    inputToRender={(params) => <input type="text"
            {...params}
        />
        }
    />
}
```