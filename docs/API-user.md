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

## Get user profile

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

    *__fields__: _id, firstName, lastName, picture, picture_200px, gender, shirt_size, phone, regId, facebookId, twitterUsername, lineId, disease, birth_day, allergy, notification, firstNameTH, lastNameTH, major, emer_phone, admin_events, admin_channels, join_events, interest_events, subscribe_channels, already_joined_events, tag_like, dorm_bed, dorm_building, dorm_room*

* **Error Response:**

  * **Code:** 403

    **Content:** `{err : detail of error}`

---

## Edit user profile

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

      *__fields__: nick_name, picture, picture_200px, birth_da, twitterUsername, phone, shirt_size, allergy, disease, emer_phone, tag_like, dorm_room, dorm_building, dorm_bed, twitterUsername, lineId, notification*

* **Success Response:**

  * **Code:** 201

    **Content:** `{"msg" : "done"}`


* **Error Response:**

  * **Code:** 403, 404, 500

    **Content:** `{err : detail of error}`
---

## Get join events

Returns events that user pressed join button.

* **URL**

  `/user/join`

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

    **Content:** `{events : [ event's title : {fields : data} ]}`

    *__fields__: channel, picture, channel_picture, channel_id*

* **Error Response:**

  * **Code:** 400,403,500

    **Content:** `{err : detail of error}`
---

## Join an event

Saves data when user presses the join button.

* **URL**

  `/user/join`

* **Method:**

  `PUT`

* **Authentication**

    `Require`

*  **URL Params**

    **Require**
    `id = event's id`

* **Body**

    `{fields : data}`

      *__fields__: require_field, optional_field*

* **Success Response:**

  * **Code:** 201

    **Content:** `{"msg" : "done."}`

    *__fields__: channel, picture, channel_picture, channel_id*

* **Error Response:**

  * **Code:** 400, 403, 404, 500

    **Content:** `{err : detail of error}`
---
