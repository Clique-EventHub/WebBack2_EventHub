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

  `/channel/stat'

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

## Check-in

 Channel's admins are able to help their event's admins checking joining people in the event. People who clicked the join button will be checked as being participated in the event if they check in. You can check multiple people in at once by sending an array of user ids by the field users.
 Only an array of user ids is accepted.

* **URL**

  `/admin/check-in'

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
