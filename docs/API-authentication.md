# Authentication

- [Login by facebook](https://github.com/Clique-EventHub/WebBack2_EventHub/blob/develop/docs/API-authentication.md#login-by-facebook)
- [Revoke access token](https://github.com/Clique-EventHub/WebBack2_EventHub/blob/develop/docs/API-authentication.md#revoke-access-token)

---

## Login by facebook

Login user by facebook.
If user login first time, system will register new user and save it to database. Otherwise, server will use registered user.
Refresh token will regenerate everytime user login by Facebook.


* **URL**

  `/login/facebook`
  
* **Method:**

  `GET`

* **Authentication**

    None

*  **URL Params**

    **Require**
    `id = facebook's id`
    `access_token = facebook's access_token`

* **Body**

    None

* **Example**
    
    `GET /login/facebook?id=1234&access_token=abcde`

* **Success Response:**

  * **Code:** 200

    **Content:** 
    ```
    {
        "msg" : "done",
        "access_token" : server's access token,
        "refresh_token" : servers's refresh_token
    }   
    ```

* **Error Response:**

  * **Code:** 400, 500

    **Content:**
    ```
    {
        "msg" : detail of error
    }   
    ```
    
    *__detail of error:__ " invalid facebook's access token " , etc.*
    



---

## Revoke access token

get new access token

* **URL**

  `/auth/revoke`

* **Method:**

  `POST`

* **Authentication**

    `Require`

*  **URL Params**

    None

* **Body**

   ```
   {
        "refresh_token" : refresh token
   }
   ```

* **Success Response:**

  * **Code:** 200

    **Content:** 

    ```
    {
        "msg" : "OK",
        "access_token" : new access token
    }
    ```

* **Error Response:**

  * **Code:** 400, 403, 500

    **Content:** 
    
    ```
    {
        "err" : detail of error
    }
    ```

	**detail of error**

	```
		500 : Internal Error, Something went wrong
		400 : no token provide      = invalid params/body
			  Invalid Token 	    = no user in db/fake token
			  Invalid refresh token = refresh token don't match
		403 : refresh token expired					
	```

---

response from possible response from authentication

```    
Please login
jwt expired
```
