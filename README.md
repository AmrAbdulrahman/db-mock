# db-mock

> What's better in this life than having a database mocking, for our api-mocking!
> db-mock, is an engine that is perfect for simulating a database, with
> a very simple setup, you can have a db-like and an api-mocks in matter of minutes.
> If you mock you api using Node and Express, db-mock will make your life 10x easier!

## Sample
<p align="center">
  <img align="center" src="http://s21.postimg.org/jrydvffo7/OSX_CALC.png" alt="OSX Calculator" />
</p>


## Install
```
npm install db-mock --save-dev
```

## Schema example
```
// profile.json
{
  "address": "string",
  "phone": "string"  
}
```

```
// course.json
{
  "name": "string",
  "description": "string",
  "$has": {
    "many": [{
      "relationWith": "student",
      "inject": true
    }]
  }
}
```

```
// student.json
{
  "name": {
    "type": "string",
    "required": true
  },
  "age": {
    "type": "number",
    "min": 0,
    "max": 100
  },
  "dateOfBirth": "date",
  "married": "bool",
  "sons": {
    "type": "array",
    "required": true
  },
  "$has": {
    "one": [{
      "relationWith": "profile",
      "required": true,
      "inject": true
    }],
    "many": [
      "course"
    ]
  }
}
```

## Seed example
```
// seed.js
var _ = require('lodash');

module.exports = function(db) {
  _.times(10, (i) => {
    let studentProfile = db.profile.add({
      address: 'address ' + i
    });

    db.student.add({
      name: 'student name ' + i,
      dateOfBirth: new Date(),
      profile_ID: studentProfile.ID
    });
  });
}
```

## Data types
- string
- date
- number
- bool
- array
- object

## Configurations
All optional! Create .dbmockrc on the root to configure any option.

Option                    | Default            | Description 
------------------------- | ------------------ | ---------------------
socketsPort               | 6789               | The port of engine when it runs in sockets mode
webConsolePort            | 6790               | The port of the web-console
data                      | 'db/data/'         | The directory of data (should be git ignored)
schema                    | 'db/schema/'       | Directory of the schema
seed                      | 'db/seed.js'       | File location of seed script
IDProperty                | 'ID'               | ID property
foreignIDSuffix           | '_ID'              | How should foreign IDs be. (classID, classId, class_id, or classID)
enableCreatedAtProperty   | true               | Auto insert 'created at' field
createdAtProperty         | '_createdAt'       | Name of 'created at' property if enabled
enableUpdatedAtProperty   | true               | Auto insert 'updated at' field
updatedAtProperty         | '_updatedAt'       | Name of 'updated at' property
injectResourceName        | true               | Whether to inject the resource name at retrieval, (student resource will has '$name'='student' property)
resourceNameProperty      | '_name'            | resource name property

Sample
```
{
  "data": "db-mock-data/data/",
  "schema": "db-mock-data/schema/",
  "seed": "db-mock-data/seed.js",
  "foreignIDSuffix": "ID"
}
```

## License
MIT