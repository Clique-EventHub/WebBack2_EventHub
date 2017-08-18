# User
- [Get user profile](#get-user-profile)
- [Edit user profile](#edit-user-profile)
- [Get join events](#get-join-events)
- [Join an event](#join-an-event)
- [Subscribe a channel](#subscribe-a-channel)
- [Get all subscribed channels](#get-all-subscribed-channels)
- [Unsubscribe a channel](#unsubscribe-a-channel)
- [Interest an event](#interest-an-event)
- [Get all interesting events](#get-all-interesting-events)
- [Uninterest an event](#uninterest-an-event)
- [Register reg chula](#register-reg-chula)
- [Show admin events](#show-admin-events)
- [Show admin channels](#show-admin-channels)
- [Read notification](#read-notification)
- [Get user profile from Facebook ID](#get-user-profile-from-facebook-id)
- [Get user profile from Mongo ID](#get-user-profile-from-mongo-id)
- [Get user profile from Reg Chula ID](#get-user-profile-from-reg-chula-id)


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
    ```
    {
        _id,
        firstName, lastName, nick_name,
        picture, picture_200px,
        email,
    	gender,
    	phone,
    	shirt_size,
    	birth_day,
    	allergy,
    	disease,
    	major,
    	emer_phone,
    	admin_events,
    	admin_channels,
    	join_events,
    	interest_events,
    	subscribe_channels,
    	already_joined_events,
    	tag_like,
    	dorm_bed, dorm_room, dorm_building,
    	regId,
    	facebookId,
    	twitterUsername,
    	lineId,
    	notification,
    	firstNameTH,
    	lastNameTH,
    	accepted_events
    }
    ```

* **Error Response:**

  * **Code:** 403

    **Content:** 
    ```
    {err : detail of error}
    ```

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

* **Body:** JSON
   ```
   {
   	'nick_name',
	'picture',
	'picture_200px',
	'birth_day',
	'twitterUsername',
	'phone',
	'shirt_size' ,
	'allergy',
	'disease',
	'emer_phone',
	'tag_like',
	'dorm_room',
	'dorm_building',
	'dorm_bed',
	'twitterUsername',
	'lineId',
	'notification',
	'facebookLink'
   }
   ```

* **Example**
    ```
    PUT /user
    JSON BODY {
        "phone" : "191",
        "nickname" : "sup"
    }
    ```


* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    {
        "msg" : "done.",
        "notification" : data
    }
    ```


* **Error Response:**

  * **Code:** 403, 404, 500

    **Content:** 
    ```
    {err : detail of error}
    ```
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

    **Content:** 
    ```
    {
        events : [
            {
                event's title : {
                    channel, 
                    picture, 
                    channel_picture, 
                    channel_id
                } 
            }
        ]
    }
    ```

* **Error Response:**

  * **Code:** 400,403,500

    **Content:** 
    ```
    {msg : detail of error}
    ```
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

    **Content:** `{"msg" : "done.", "notification" : data}`


* **Error Response:**

  * **Code:** 400, 403, 404, 500

    **Content:** `{msg : detail of error}`
---

## Subscribe a channel

Saves data when user presses subscribe button.

* **URL**

  `/user/subscribe`

* **Method:**

  `PUT`

* **Authentication**

    `Require`

*  **URL Params**

    **Require**
    `id = channel's id`

* **Body**

    None

* **Success Response:**

  * **Code:** 201

    **Content:** `{"msg" : "done.", "notification" : data}`


* **Error Response:**

  * **Code:** 403, 404, 500

    **Content:** `{msg : detail of error}`
---

## Get all subscribed channels

Returns all channels that user subscribed.

* **URL**

  `/user/subscribe`

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

    **Content:** `{channel_name : { fields : data }, "notification" : data}`
    *__fields__: channel_picture, channel_id*

* **Error Response:**

  * **Code:** 403, 404, 500

    **Content:** `{msg : detail of error}`
---

## Unsubscribe a channel

Saves data when user presses unsubscribe button.

* **URL**

  `/user/unsubscribe`

* **Method:**

  `PUT`

* **Authentication**

    `Require`

*  **URL Params**

    **Require**
    `id = channel's id`

* **Body**

    None

* **Success Response:**

  * **Code:** 201

    **Content:** `{"msg" : "done.", "notification" : data}`


* **Error Response:**

  * **Code:** 403, 404, 500

    **Content:** `{msg : detail of error}`
---

## Interest an event

Saves data when user presses interest button.

* **URL**

  `/user/interest`

* **Method:**

  `PUT`

* **Authentication**

    `Require`

*  **URL Params**

    **Require**
    `id = event's id`

* **Body**

    None

* **Success Response:**

  * **Code:** 201

    **Content:** `{"msg" : "done.", "notification" : data}`


* **Error Response:**

  * **Code:** 403, 404, 500

    **Content:** `{msg : detail of error}`
---

## Get all interesting events

Returns all events that user clicked interest button.

* **URL**

  `/user/interest`

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

    **Content:** `{events : [event_title : {fields : data}], "notification" : data}`
    *__fields__: picture, event_id, channel, channel_picture, channel_id*

* **Error Response:**

  * **Code:** 403, 404, 500

    **Content:** `{msg : detail of error}`
---

## Uninterest an event

Saves data when user uninterest an event.

* **URL**

  `/user/uninterest`

* **Method:**

  `PUT`

* **Authentication**

    `Require`

*  **URL Params**

    **Require**
    `id = event's id`

* **Body**

    None

* **Success Response:**

  * **Code:** 201

    **Content:** `{"msg" : "done.", "notification" : data}`


* **Error Response:**

  * **Code:** 403, 404, 500

    **Content:** `{msg : detail of error}`
---

## Register reg chula

Check username and password with reg chula system and store the returned data in the database.

* **URL**

  `/user/reg`

* **Method:**

  `PUT`

* **Authentication**

    `Require`

*  **URL Params**

    None

* **Body**

    **Require**
    ```
    {
        username, 
        password
    }
    ```
    

* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    {
        firstName,
        lastName,
        firstNameTH,
        lastNameTH,
        gender,
        regId
    }
    ```

* **Error Response:**

  * **Code:** 400, 403, 404, 500

    **Content:** 
    ```
    {msg : detail of error}
    ```
---

## Show admin events

 Returns all events that user is an admin.

* **URL**

  `/user/show-admin-events`

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

    **Content:** `{ "event_info" : [{ fields : data }], "notification" : data }`

    *__fields__: event_picture, event_title, event_id, channel_id, channel_name*

* **Error Response:**

  * **Code:** 403, 500

    **Content:** `{msg : detail of error, event_list/channel_list : data }`
    `Note that detail of error will specify "error.(contains event_list)" or "error.(contains channel_list)" if the return code is 500.`

---

## Show admin channels

 Returns all channels that user is an admin.

* **URL**

  `/user/show-admin-channels`

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

    **Content:** `{ "channels" : [{ fields : data }], "notification" : data }`

    *__fields__: channel_id, channel_name*

* **Error Response:**

  * **Code:** 403, 500

    **Content:** `{msg : detail of error, (optional)channel_list : data }`

---

## Read notification

Read the new notification. That notification will become 'seen'.

* **URL**

  `/saw-noti`

* **Method:**

  `PUT`

* **Authentication**

    `Require`

*  **URL Params**

    None

* **Body**

    `{fields : data}`
      *__fields__: notification(send an array of notifications which contains the whole notification object)*

* **Success Response:**

  * **Code:** 201

    **Content:** `{"msg" : "done.", "notification" : data}`


* **Error Response:**

  * **Code:** 403, 404, 500

    **Content:** `{msg : detail of error}`

---

## Get user profile from Facebook ID

 Returns json data about detail of user from facebook id

* **URL**

  `/findfb`

* **Method:**

  `GET`

* **Authentication**

    `Optional`

*  **URL Params**

    user = fb id

* **Body**

    None

* **Success Response:**

  * **Code:** 200

    **Content:** `{fields : data}`

    *__fields__: _id,firstName,lastName,nick_name,picture,picture_200px,firstNameTH,lastNameTH,regId,facebookLink*

* **Error Response:**

  * **Code:** 404, 500

    **Content:** `{msg : detail of error}`

---

## Get user profile from Mongo ID

 Returns json data about detail of user from Mongo id

* **URL**

  `/findmg`

* **Method:**

  `GET`

* **Authentication**

    `Optional`

*  **URL Params**

    user

* **Body**

    None

* **Success Response:**

  * **Code:** 200

    **Content:** `{fields : data}`

    *__fields__: _id,firstName,lastName,nick_name,picture,picture_200px,firstNameTH,lastNameTH,regId*

* **Error Response:**

  * **Code:** 404, 500

    **Content:** `{msg : detail of error}`

---

## Get user profile from Reg Chula ID

 Returns json data about detail of user from reg chula id

* **URL**

  `/findreg`

* **Method:**

  `GET`

* **Authentication**

    `Optional`

*  **URL Params**

    user

* **Body**

    None

* **Success Response:**

  * **Code:** 200

    **Content:** `{fields : data}`

    *__fields__: _id,firstName,lastName,nick_name,picture,picture_200px,firstNameTH,lastNameTH,regId*

* **Error Response:**

  * **Code:** 404, 500

    **Content:** `{msg : detail of error}`

---
