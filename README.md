## REST API - Based on blogging website

#### Tech Stack - `NodeJS ExpressJS MongoDB`

#### Libraries Used :

```
- Mongoose - MongoDB Connections
- Node-Mailer - Sending password reset links
- @hapi/Joi - Validation checks
- JsonWebToken - Authentication
- bcrypt - Hashing Passwords
- ExpressJs - Framework
- dotenv - Environement Variables
- morgan - Logging Calls
```

#### Available Routes :

```
POST http://localhost:3000/api/user/register
Content-Type: application/json

{
    "email": "",
    "username": "",
    "password": ""
}
```


```
POST http://localhost:3000/api/user/login
Content-Type: application/json

{
    "email": "",
    "password":""
}
```



```
POST http://localhost:3000/api/posts/create
Content-Type: application/json
Access-Token: Bearer <accessToken>

{
    "title":"",
    "content": ""
}
```


```
POST http://localhost:3000/api/posts/delete/<postId>
Content-Type: application/json
Access-Token: Bearer <accessToken>
```


```
GET http://localhost:3000/api/posts/<postId>
Content-Type: application/json
Access-Token: Bearer <accessToken>
```


```
GET http://localhost:3000/api/user/posts
Content-Type: application/json
Access-Token: Bearer <accessToken>
```


```
GET http://localhost:3000/api/user/
Content-Type: application/json
Access-Token: Bearer <accessToken>
```


```
POST http://localhost:3000/api/posts/<postId>/comment
Content-Type: application/json
Access-Token: Bearer <accessToken>


{
    "comment":""
}
```


```
POST http://localhost:3000/api/posts/<postId>/delete/comment/<commentId>
Content-Type: application/json
Access-Token: Bearer <accessToken>
```


```
POST http://localhost:3000/api/user/forgotpwd
Content-Type: application/json

{
    "email":""
}
```


```
POST http://localhost:3000/api/user/reset/<resetToken>
Content-Type: application/json

{
    "password": ""
}
```


```
POST http://localhost:3000/api/posts/<postId>/like
Content-Type: application/json
Access-Token: Bearer <accessToken>
```

```
POST http://localhost:3000/api/posts/<postId>/dislike
Content-Type: application/json
Access-Token: Bearer <accessToken>
```







