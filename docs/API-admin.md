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

  *__fields__: name,picture,picture_large,events,events_bin,admins,tokenDelete*

* **Success Response:**

  * **Code:** 200

    **Content:** `{fields : data}`

    *__fields__: name,verified,picture,picture_large,events*

* **Error Response:**

  * **Code:** 404,500

    **Content:** `{err : error detail}`
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

  * **Code:** 404,500

    **Content:** `{err : error detail}`
---

## Add admin channel

 Add colleagues to be admin channel.

* **URL**

  `/user/add-admin'

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

  * **Code:** 202

    **Content:** `{ "msg":"done" }`

* **Error Response:**

  * **Code:** 404,500

    **Content:** `{err : error detail}`
---

## Post new event

 Create new event to the channel.

* **URL**

  `/event'

* **Method:**

  `POST`

* **Authentication**

    `Required`

*  **URL Params**

    None

* **Body**

  `{fields : data}`

  *__fields__: title,about,channel,picture,picture_large,video,faculty_require,
  year_require,agreement,location,date_start,date_end,contact_information,
  tags,admins,Creator*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done", "id":"newEvent_id" }`

* **Error Response:**

  * **Code:** 400,403,500

    **Content:** `{err : error detail}`
---
## Get event stat

 Returns the event's statistic data.

* **URL**

  `/event/stat'

* **Method:**

  `GET`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = event's id`

* **Body**

  None

* **Success Response:**

  * **Code:** 200

    **Content:** `{fields : data}`

    *__fields__: visit,visit_per_day*

* **Error Response:**

  * **Code:** 400,403,500

    **Content:** `{err : error detail}`
---
