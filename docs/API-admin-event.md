# **Admin Event**

uses the same login system as normal users. The following below are special functions for admin event.

- [Put event detail](#put-event-detail)
- [Get event stat](#get-event-stat)
- [Add admin event](#add-admin-event)
- [Delete admin event](#delete-admin-event)
- [Add admin event by facebook id](#add-admin-event-by-facebook-id)
- [Delete admin event by facebook id](#delete-admin-event-by-facebook-id)
- [Add admin event by mongo id](#add-admin-event-by-mongo-id)
- [Delete admin event by mongo id](#delete-admin-event-by-mongo-id)
- [Check-in](#check-in)
- [Delete event](#delete-event)
- [Send notification to joining people](#send-notification-to-joining-people)
- [Send personal notification to people who clicked join or interest button](#send-personal-notification-to-people-who-clicked-join-or-interest-button)
- [Choose join people](#choose-join-people)


---

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
    ```
  	{
      	'about',
    	'video',
    	'location',
    	'date_start',
    	'date_end',
    	'time_start',
    	'time_end',
    	'picture',
    	'picture_large',
    	'msg_after_join',
    	'year_require',
    	'faculty_require',
    	'tags',
    	'refs',
    	'agreement',
    	'contact_information',
    	'joinable_start_time',
    	'joinable_end_time',
    	'joinable_amount',
    	'time_start',
    	'time_end',
    	'optional_field',
    	'require_field',
    	'show',
    	'outsider_accessible',
    	'notes',
    	'time_each_day'
    }
    ```
* **Example**
    ```
    PUT /event?id=12345678
    JSON BODY{
        "about" : "hello form the other side",
        "location" : "somewhere on the earth"
    }
    ```
* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    {
        msg, 
        notification
    }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {msg : error detail}
    ```
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

* **Example**
    ```
    GET /event/stat?id=1234567890
    ```
    

* **Success Response:**

  * **Code:** 200

    **Content:**
    ```
    {
        '_id',
    	'title',
    	'about',
    	'video',
    	'channel',
    	'location',
    	'date_start',
    	'date_end',
    	'time_start',
    	'time_end',
    	'expire',
    	'refs',
    	'join',
    	'time_each_day',
    	'picture',
    	'picture_large',
    	'year_require',
    	'faculty_require',
    	'tags',
    	'forms',
    	'notes',
    	'msg_after_join',
    	'contact_information',
    	'require_field',
    	'optional_field',
    	'refs',
    	'agreement',
    	'joinable_start_time',
    	'joinable_end_time',
    	'joinable_amount',
    	'optional_field',
    	'require_field',
    	'show',
    	'outsider_accessible',
    	'who_join',
    	'who_interest',
    	'who_pending',
    	'who_accepted',
    	'who_rejected',
    	'who_completed',
    	'visit',
    	'visit_per_day',
    	'interest',
    	'interest_gender',
    	'interest_year',
    	'join',
    	'join_gender',
    	'join_year',
    	'join_per_day',
    	'join_data'
    }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {msg : error detail}
    ```
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
  ```
  { user : user's reg id }
  ```

* **Eaxmple**
    ```
    PUT /admin/event/add?id=1234567890
    JSON BODY{
        "user" : "511293837"
    }
    ```
    
* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    { 
        "msg":"done.", 
        "notification":data 
    }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {msg : error detail}
    ```
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
  ```
  { user : user's reg id }
  ```

* **Eaxmple**
    ```
    DELETE /admin/event/delete?id=1234567890
    JSON BODY{
        "user" : "511293837"
    }
    ```

* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    { 
        "msg":"done.", 
        "notification":data 
    }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {msg : error detail}
    ```
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
  ```
  { user : user's facebook id }
  ```

* **Eaxmple**
    ```
    PUT /admin/event/addfb?id=1234567890
    JSON BODY{
        "user" : "9938361028"
    }
    ```

* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    { 
        "msg":"done.", 
        "notification":data 
    }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {msg : error detail}
    ```
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
  ```
  { user : user's facebook id }
  ```

* **Eaxmple**
    ```
    DELETE /admin/event/deletefb?id=1234567890
    JSON BODY{
        "user" : "9938361028"
    }
    ```

* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    { 
        "msg":"done.", 
        "notification":data 
    }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {msg : error detail}
    ```
---

## Add admin event by mongo id

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
  ```
  { user : user's mongo id }
  ```
  
* **Example**
    ```
    PUT /admin/channel/addmg?id=123456
    JSON BODY {
        "user" : "555252515125"
    }
    ```

* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    { "msg":"done.", "notification":data }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {msg : error detail}
    ```
---

## Delete admin event by mongo id

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
  ```
  { user : user's mongo id }
  ```
  
* **Example**
    ```
    DELETE /admin/channel/deletemg?id=123456
    JSON BODY {
        "user" : "555252515125"
    }
    ```

* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    { "msg":"done." }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {msg : error detail}
    ```
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

  ```
  { users : [array of user's ? id ]  }
  ```

  *__fields__: users*

* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    { "msg":"done.", "notification":data }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {
        msg : error detail, 
        user_list(optional) : array of user ids that have problems
    }
    ** Note that user_list is contained only if the error detail says "error.(contains user_list)"
    ```
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
  
 * **Example**
    ```
    DELETE /event?id=1234567890
    ```

* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    { 
        "msg":"done.", 
        "notification":data 
    }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {msg : error detail}
    ```
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

    ```
    { description }
    ```
 * **Example**

* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    { 
        "msg":"done.", 
        "notification":data 
    }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {msg : error detail}
    ```
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

  ```
  { description, people }
  ```

* **Success Response:**

  * **Code:** 201

    **Content:** 
    ```
    { "msg":"done.", "notification":data }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {msg : error detail}
    ```
---

## Choose join people

Choose who can join the event you supervising. This function automatically send notification to people that are accepted or rejected.

* **URL**

  `/admin/event/choose`

* **Method:**

  `PUT`

* **Authentication**

    `Require`

*  **URL Params**

    **Required:**

    `id = event's id`

* **Body**

  ```
  {
    yes : [array of mongo ids of accepted people], 
    no : [array of mongo ids of rejected people]
  }
  ```
    
* **Success Response:**

  * **Code:** 201

    **Content:** 

    ```
    { msg }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```
    {msg : error detail}
    ```
---
