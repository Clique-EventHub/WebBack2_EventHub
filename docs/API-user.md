# User

---
## Login by facebook

Login user by facebook.
If user login first time, system will register new user and save it to database.
Otherwise, server will use registered user.

* **URL**

  `/login/facebook`

* **Method:**

  `GET`

* **Authentication**

    None

*  **URL Params**

    **Require**
    `id = [facebook's id]`
    `access_token = [facebook's access_token]`

* **Body**

    None


* **Success Response:**

  * **Code:** 200

    **Content:** `{"msg" : "done",access_token : server's access token}`


* **Error Response:**

  * **Code:** 400, 500

    **Content:** `{err : detail of error}`
    *__detail of error:__ " invalid facebook's access token " , etc.*

---


## Get User profile

 Returns json data about detail of user

* **URL**

  `/user`

* **Method:**

  `GET`

* **Authentication**

    `Require`

*  **URL Params**

    None

* **Body**

    None

* **Success Response:**

  * **Code:** 200

    **Content:** `{fields : data}`

    *__fields__: firstName,lastName,picture,shirt_size,twitterUsername,lineId,disease,birth_day,allergy*

* **Error Response:**

  * **Code:** 403

    **Content:** `{err : detail of error}`

---


# User

## Edit User profile

Edit user profile

* **URL**

  `/user`

* **Method:**

  `PUT`

* **Authentication**

    `Require`

*  **URL Params**

    None

* **Body**

    `{fields : data}`

    **Optional**
      *__fields__: nick_name, picture, phone , shirt_size, allergy, disease, profileUrl, twitterUsername, lineId, admin_channels, subscribe_channels, join_events, interest_events*

* **Success Response:**

  * **Code:** 200

    **Content:** `{"msg" : "done"}`


* **Error Response:**

  * **Code:** 400, 403, 500

    **Content:** `{err : detail of error}`
---

## Join event

save event that user press join

* **URL**

  `/user/join`

* **Method:**

  `GET`

* **Authentication**

    `Require`

*  **URL Params**

    **Require**
    `id = [event's id]`


* **Body**

    None


* **Success Response:**

  * **Code:** 200

    **Content:** `{"msg" : "done"}`


* **Error Response:**

  * **Code:** 400,403,500

    **Content:** `{err : detail of error}`
---
