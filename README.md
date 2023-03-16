# MERN-Full-Stack-Web-Application-Development-with-SQL-and-NoSQL
Backend Movies API Development with SQLite3 and MongoDB
# Movies
The following processes focused on the creation of a new user registration and logon to the Webpage of `Movie Search` function with the registered user record in term of GET function to find out the user record from the collection of `users` under the mongoDatabase `test` firstly.

**Export the express instance using the default export syntax.**

**Use Common JS module syntax.**

**The backend files structure:**
./root | # | #
--- | --- | --- 
_readme.md | | 
_app.js  | |  
_CheckUser.js | | 
_package-lock.json | | 
_package.json | | 
_route (folder) | | 
. |_index.js | 
. |_routeUser.js | 
. |_routeFilm.js
| | | 
_module(folder) | | 
.  |_user.js | 
.  |_SQLite3app.js | 
.  |_users.json | 
.  |_init_MySQL.js | 
.  |_userSqlite3.js | 
.  |_user.module.js | 
.  |_users.db (SQLite3) | 
.  |_films.db (SQLite3) | 
. | | 
_controller (folder) | | 
.  |_authController.js | 
.  |_filmController.js | 
.  |_loginController.js | 
.  |_usersController.js | 
| | | 
_config (folder) | | 
.  |_checkAuth.js | 
.  |_MongoDBkey.js | 
.  |_passport.js | 
| | | 
_assests (folder) | | 
.  |_css (folder) | 
.  .  |_bootstrap.min.css | 
.  |_cyber-security-icon.jpg | 
.  |_Patpat.gif | 
| | | 
_public | | 
.  |_index.html | 
.  |_styles.css | 
| | | 
._views (folder) | | 
.| _404.ejs |
.| _about.ejs |
.| _adduser.ejs |
.| _dash.ejs |
.| _details.ejs |
.| _edit.ejs |
.| _forgot.ejs |
.| _index.ejs |
.| _layout.ejs |
.| _login.ejs |
.| _messages.ejs |
.| _register.ejs |
.| _reset.ejs |
.| _welcome.ejs |
. |_partials (folder) | 
.| | _footer.ejs
.| | _head.ejs
.| | _nav.ejs

**STEP ONE:**
1.1 Use `npm install` to install the packages;
1.2 then use 'npm start' to execute "app.js" for for operating a new registration for a new user account;
1.3 Execute two files `./app.js` and a database file stored on MongDB Database of `test` and Collection of `users` for records and authentication purposes. In the field of password relatd to each registered end-user would be encrypted meanwhile. Then you will receive authentication email for activating a new user account via your personal email account;
1.4 when login webpage was redirected successfully, you may logon to your own user accout with your created password. During creating a new user account, the personal password is being encrypted and then save a new user document into the COLLECTION of `users` under the mongoDataBase of `test` after authentication passed successfully via the activation from the user personal email.

1.5 You may watch video of [![Watch the video]("Demonstration_of_Authentication & Encrypted Login Processes_API_Mini_Project_Login_CRUD_023-03-10-180613.mp4")](https://youtu.be/JiOhTotg-P0)for further reference on how to operate the backend file of app.js by opening the webpage of `localhost:10889` on the browser.

**STEP TWO:**
2.1 Use `node CheckUser.js` to manage end-user accounts with CRUD algorithms in term of GET, POST, PUT and DELETE user records one by one.
2.2 Open a broswer and type `localhost:8080/users` to list out all user records stored on the COLLECTION of users under the mongoDB of `test`.
2.3 The operation in details can watch the video of [![Watch the video](https://i.imgur.com/vKb2F1B.png)](https://youtu.be/JiOhTotg-P0) for further reference.

**STEP THREE:**
After registration of creating a new user account and logon to the Movie Search Webpage successfully, you may open POSTMAN to execute CRUD operation with the following files:
3.1. Use `node mongoDBapp.js` to get what historial movie information you want with OMDB api key, then save the movie information into the COLLECTION of `movies` under the MongoDatabase of `project` automatically. 

3.2. You operate CRUD intem of GET, POST, PUT and DELETE processess through POSTMAN to manage the movie records in the mongoDatabase one by one. The operation in details can watch the attached video of [![Watch the video](https://i.imgur.com/vKb2F1B.png)](https://youtu.be/RJzwXLdnj_0)

**STEP FOUR:**
4.1 Go to subfolder of `module` and use `node SQLite3app.js
and a database file `moviesData.db` consisting of one tables `movies`.
`./mongoDBapp.js`, `./module/SQLite3app.js` and a database file `./module/films.db` consisting of one tables `movies` in S.
The operation in details can watch the attached video of [![Watch the video](https://i.imgur.com/vKb2F1B.png)](https://youtu.be/uUOYJMKGhCk).

In step five, write APIs to perform CRUD operations on the tables `movies` containing the following columns,

**Movies Table in SQLite3 Database**

| Columns     | Type         |
| ----------- | ------------ |
| _id         | INTEGER      |
| Title       | INTEGER      |
| Year        | TEXT         |
| imdbID      | TEXT         |
| Poster      | TEXT         |
| Rating      | Int32        |
| createDate  | Date_&_Time  |


### API 1

#### Path: `/filmrecord/:movietitle`

#### Method: `GET`

#### Description:

Returns a list of all movie names you search vis OMDB api and then seaparte different data type to save in the targeted variables for storing into the movie table of films.db

#### Response

```
[
  {
    "Title": "Spiderman in Cannes",
    "Year": "2016",
    "imdbID": "tt5978586",
    "Poster": "https://m.media-amazon.com/images/M/MV5BZDlmMGQwYmItNTNmOS00OTNkLTkxNTYtNDM3ZWVlMWUyZDIzXkEyXkFqcGdeQXVyMTA5Mzk5Mw@@._V1_SX300.jpg",
    "Rating": 9.8,
    "createdDate": "2023-03-14T22:06:43+08:00"
},

  ...
]
```

### API 2

#### Path: `/addfilm/`

#### Method: `POST`

#### Description:

Creates a new movie record in the movies table. `_id` is auto-incremented

#### Request

```
{
    "Title": "WonderWoman",
    "Year": "2026",
    "imdbID": "tt03212779",
    "Poster": "null",
    "Rating": 6.8,
    "createdDate": "2023-03-14T22:06:43+08:00"
}
```

#### Response

```
Movie of WonderWoman Successfully Added
```

### API 3

#### Path: `/film/:imdb/`

#### Method: `GET`

#### Description:

Returns a particular movie record based on the movie ID of imdbID

#### Response

```
{
  "Title": "WonderWoman",
  "Year": "2026",
  "imdbID": "tt03212779",
  "Poster": "null",
  "Rating": 6.8,
  "createdDate": "2023-03-14T22:06:43+08:00"
}
```

### API 4

#### Path: `/film/:imdb/`

#### Method: `PUT`

#### Description:

Updates the Rating and Title of a targeted movie record in the movie table based on the movie ID of imdbID

#### Request

```From
{
  "Title": "Wonder-Man",
  "Year": "2026",
  "imdbID": "tt03212779",
  "Poster": "null",
  "Rating": 6.8,
  "createdDate": "2023-03-14T22:06:43+08:00"
}
Update to 
{
  "Title": "WonderWoman",
  "Year": "2026",
  "imdbID": "tt03212779",
  "Poster": "null",
  "Rating": 6.8,
  "createdDate": "2023-03-14T22:06:43+08:00"
}
```

#### Response

```
Movie of WonderWoman Was Updated Successfully

```

### API 5

#### Path: `/film/:imdb/`

#### Method: `DELETE`

#### Description:

Deletes a movie of WonderWoman from the movie table based on the movie ID of imdb

#### Response

```
Movie of WonderWoman Was Removed Successfully
```

<br/>
