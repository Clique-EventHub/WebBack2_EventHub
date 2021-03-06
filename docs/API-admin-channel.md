# **Admin Channel**

uses the same login system as normal users. The following below are special functions for admin channel.
## Put channel detail

Change details of channel

* **URL**

  `/channel`

* **Method:**

  `PUT`

* **Authentication**

    `Require`

*  **URL Params**

    **Required:**

    `id = channel's id`

* **Body**

  `{fields : data}`

  *__fields__: name,picture,picture_large*

* **Success Response:**

  * **Code:** 201

    **Content:** `{fields : data}`

    *__fields__: msg, notification*

* **Error Response:**

  * **Code:** 400,403,404,500

    **Content:** `{msg : error detail}`
---
## Get channel stat

 Returns the channel's statistic data.

* **URL**

  `/channel/stat`

* **Method:**

  `GET`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = channel's id`

* **Body**

  None

* **Success Response:**

  * **Code:** 200

    **Content:** `{fields : data}`

    *__fields__: visit*

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Add admin channel

 Add colleagues to be an admin channel. You can only add colleagues one-by-one.

* **URL**

  `/admin/channel/add'

* **Method:**

  `PUT`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = channel's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done." }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Add admin event

 Channel's admins have permission to add colleagues to be an admin event. They can only add colleagues one-by-one. They can add themselves to be the admin of that event, too.

* **URL**

  `/admin/event/add'

* **Method:**

  `PUT`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = event's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done.", "notification":data }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Delete admin channel

 Delete colleagues from being an admin channel. You can only delete colleagues one-by-one.

* **URL**

  `/admin/channel/delete'

* **Method:**

  `DELETE`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = channel's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done." }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Delete admin event

 Channel's admins also have permission to delete colleagues from being an admin event. They can only delete colleagues one-by-one. They can delete themselves, too.

* **URL**

  `/admin/event/delete'

* **Method:**

  `DELETE`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = event's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done.", "notification":data }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Add admin channel by facebook id

 Add colleagues to be an admin channel. You can only add colleagues one-by-one using facebook id.

* **URL**

  `/admin/channel/addfb`

* **Method:**

  `PUT`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = channel's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done." }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Add admin event by facebook id

 Channel's admins have permission to add colleagues to be an admin event. They can only add colleagues one-by-one. They can add themselves to be the admin of that event, too. It uses facebook id.

* **URL**

  `/admin/event/addfb`

* **Method:**

  `PUT`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = event's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done.", "notification":data }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Delete admin channel by facebook id

 Delete colleagues from being an admin channel. You can only delete colleagues one-by-one using facebook id.

* **URL**

  `/admin/channel/deletefb`

* **Method:**

  `DELETE`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = channel's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done." }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Delete admin event by facebook id

 Channel's admins also have permission to delete colleagues from being an admin event. They can only delete colleagues one-by-one. They can delete themselves, too. It uses facebook id.

* **URL**

  `/admin/event/deletefb`

* **Method:**

  `DELETE`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = event's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done.", "notification":data }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Add admin channel by mongo id

 Add colleagues to be an admin channel. You can only add colleagues one-by-one using mongo id.

* **URL**

  `/admin/channel/addmg`

* **Method:**

  `PUT`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = channel's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done." }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Add admin event by facebook id

 Channel's admins have permission to add colleagues to be an admin event. They can only add colleagues one-by-one. They can add themselves to be the admin of that event, too. It uses mongo id.

* **URL**

  `/admin/event/addmg`

* **Method:**

  `PUT`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = event's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done.", "notification":data }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Delete admin channel by facebook id

 Delete colleagues from being an admin channel. You can only delete colleagues one-by-one using mongo id.

* **URL**

  `/admin/channel/deletemg`

* **Method:**

  `DELETE`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = channel's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done." }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Delete admin event by facebook id

 Channel's admins also have permission to delete colleagues from being an admin event. They can only delete colleagues one-by-one. They can delete themselves, too. It uses mongo id.

* **URL**

  `/admin/event/deletemg`

* **Method:**

  `DELETE`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = event's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done.", "notification":data }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Check-in

 Channel's admins are able to help their event's admins checking joining people in the event. People who clicked the join button will be checked as being participated in the event if they check in. You can check multiple people in at once by sending an array of user ids by the field users.
 Only an array of user ids is accepted.

* **URL**

  `/admin/check-in`

* **Method:**

  `PUT`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = event's id`

* **Body**

  `{fields : array of data}`

  *__fields__: users*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done.", "notification":data }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail, user_list(optional) : array of user ids that have problems}`
    `Note that user_list is contained only if the error detail says "error.(contains user_list)"`
---

## Delete channel

 Delete the channel that is specified. The events that were created by this channel will also be deleted.

* **URL**

  `/channel`

* **Method:**

  `DELETE`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = channel's id`

* **Body**

  None

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done.", "notification":data }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Create new event

 Create a new event for the specified channel. Some fields are required to initialize the event.

* **URL**

  `/event`

* **Method:**

  `POST`

* **Authentication**

    `Required`

* **URL Params**

  None

* **Body**

  `{fields : data}`

  *__fields__: title, channel, about, picture, picture_large, video, faculty_require, year_require, agreement, location, date_start, date_end, contact_information, tags, joinable_start_time, joinable_end_time, time_start, time_end, optional_field, require_field, joinable_amount, show, outsider_accessible*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done.", "notification":data, "id":newEvent's id }`

* **Error Response:**

  * **Code:** 400,403,404,500

    **Content:** `{msg : error detail}`
---
