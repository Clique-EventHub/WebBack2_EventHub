# **Admin Event**

uses the same login system as normal users. The following below are special functions for admin event.
## Put event detail

Change details of event

* **URL**

  `/event`

* **Method:**

  `PUT`

* **Authentication**

    `Require`

*  **URL Params**

    **Required:**

    `id = event's id`

* **Body**

  `{fields : data}`

  *__fields__: about, video, location, date_start, date_end, picture, picture_large, year_require, faculty_require, tags, agreement, contact_information, joinable_start_time, joinable_end_time, joinable_amount, time_start, time_end, optional_field, require_field, show, outsider_accessible*

* **Success Response:**

  * **Code:** 201

    **Content:** `{fields : data}`

    *__fields__: msg, notification*

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---
## Get event stat

 Returns the event's statistic data.

* **URL**

  `/event/stat`

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

    *__fields__: visit, visit_per_day, notification*

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Add admin event

 Add colleagues to be an admin event. You can only add colleagues one-by-one.

* **URL**

  `/admin/event/add`

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

## Delete admin event

 Delete colleagues from being an admin event. You can only delete colleagues one-by-one.

* **URL**

  `/admin/event/delete`

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

 Event's admins can check people who clicked the join button by checking in. People who clicked the join button will be checked as being participated in the event if they check in. You can check multiple people in at once by sending an array of user ids by the field users.
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

## Delete event

 Delete the event that is specified.

* **URL**

  `/event`

* **Method:**

  `DELETE`

* **Authentication**

    `Required`
# **Admin Event**

uses the same login system as normal users. The following below are special functions for admin event.
## Put event detail

Change details of event

* **URL**

  `/event`

* **Method:**

  `PUT`

* **Authentication**

    `Require`

*  **URL Params**

    **Required:**

    `id = event's id`

* **Body**

  `{fields : data}`

  *__fields__: about, video, location, date_start, date_end, picture, picture_large, year_require, faculty_require, tags, agreement, contact_information, joinable_start_time, joinable_end_time, joinable_amount, time_start, time_end, optional_field, require_field, show, outsider_accessible*

* **Success Response:**

  * **Code:** 201

    **Content:** `{fields : data}`

    *__fields__: msg, notification*

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---
## Get event stat

 Returns the event's statistic data.

* **URL**

  `/event/stat`

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

    *__fields__: visit, visit_per_day, notification*

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Add admin event

 Add colleagues to be an admin event. You can only add colleagues one-by-one.

* **URL**

  `/admin/event/add`

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

## Delete admin event

 Delete colleagues from being an admin event. You can only delete colleagues one-by-one.

* **URL**

  `/admin/event/delete`

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

 Event's admins can check people who clicked the join button by checking in. People who clicked the join button will be checked as being participated in the event if they check in. You can check multiple people in at once by sending an array of user ids by the field users.
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

## Delete event

 Delete the event that is specified.

* **URL**

  `/event`

* **Method:**

  `DELETE`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = event's id`

* **Body**

  None

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done.", "notification":data }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Send notification to joining people

 Send more information to all people who clicked the join button.

* **URL**

  `/event/join/message`

* **Method:**

  `POST`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = event's id`

* **Body**

  `{fields : data}`

  *__fields__: description*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done.", "notification":data }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---

## Send personal notification to people who clicked join or interest button

 Send more information to specific people (only users who clicked join or interest buttons). You can specify by sending an array of user ids in request body under the field name 'people'

* **URL**

  `/event/join/message`

* **Method:**

  `POST`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = event's id`

* **Body**

  `{fields : data}`

  *__fields__: description, people*

* **Success Response:**

  * **Code:** 201

    **Content:** `{ "msg":"done.", "notification":data }`

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{msg : error detail}`
---
