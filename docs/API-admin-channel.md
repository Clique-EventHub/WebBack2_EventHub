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

 Add colleagues to be an admin channel.

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
