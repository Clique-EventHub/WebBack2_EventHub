# **Event**

## Greeting

say hello

* **URL**

  `/`

* **Method:**

  `GET`

* **Authentication**

    `Optional`

*  **URL Params**

    None

* **Body**

  None

* **Success Response:**

  * **Code:** 200

    **Content:** `hello dude`

---
## Get event detail

 Returns json data about detail of event

* **URL**

  `/event`

* **Method:**

  `GET`

* **Authentication**

    `Optional`

*  **URL Params**

   **Required:**

    `id=[string]`

* **Body**

  None

* **Success Response:**

  * **Code:** 200

    **Content:** `{fields : data}`
    
    ```JSON
    {
       _id, 
       title,
       about, 
       video,
       location,
       channel,
	   date_start, date_end,
	   time_start, time_end,
	   time_each_day,
	   refs,
	   picture, picture_large,
	   year_require, faculty_require,
	   tags,
	   forms,
	   notes,
	   admins,
	   msg_after_join,
	   contact_information,
	   require_field, optional_field,
	   agreement,
	   joinable_start_time, joinable_end_time,
	   joinable_amount,
	   outsider_accessible,
	   choose_joins
    }
    ```


* **Error Response:**

  * **Code:** 400,500

    **Content:** 
    ```JSON
    {
        "err" : detail of error
    }
    ```

---

## Get new event

get the last created event

* **URL**

  `/event/newEvent`

* **Method**

  `GET`

* **Authentication**

    `Optional`

*  **URL Params**

    **Optional:** 
    
    `top = [number of lastest event]`

* **Body**

    None

* **Example**

    `GET /event/newEvent?top=3`

* **Success Response:**

  * **Code:** 200

    **Content:** `[ list of events object ]`


* **Error Response:**

  * **Code:** 500

    **Content:** `{ "err" : error detail }`
---


## Get hot event

get the most 5 hot event

* **URL**

  `/event/hot`

* **Method**

  `GET`

* **Authentication**

    `Optional`

*  **URL Params**

    None

* **Body**

    None

* **Success Response:**

  * **Code:** 200

    **Content:** list of hot event sort from high to low
    
    ```JSON
    [{
        "_id": "5960ee01518ff40010321e45",
        "title": "eventhub",
        "momentum": 17,
        "tags": [ ],
        "picture_large": [ ],
        "picture": null
    }]
    ```

* **Error Response:**

  * **Code:** 500

    **Content:** 
    ```JSON
    {
        "err" : "Something went wrong"
    }
---


## Search event

search event

* **URL**

  `/event/search`

* **Method**

  `GET`

* **Authentication**

    `Optional`

*  **URL Params**

    **Require:** `keyword=key1,key2,key3`

* **Body**
    None

*  **Example**

	```
	You can use both keyword and keywords
	GET /event/search?keyword=water
	GET /event/search?keywords=winter,fell,down
	```


* **Success Response:**

  * **Code:** 200

    **Content:** 

    ```JSON
    {
        "events" : [list of events]
    }
    ```

* **Error Response:**

  * **Code:** 400, 500

    **Content:** 
    ```JSON
    { 
        "err" : error detail 
    }
    ```
---

## Search event by date

Return event in date period

* **URL**

  `/event/searchbydate`

* **Method**

  `GET`

* **Authentication**

    `Optional`

*  **URL Params**

    **Require:** `date_start,date_end`  *in millisec*

* **Body**

    None

* **Example**
    
    GET /event/searchbydate?date_start=1502994512740&date_end=1502995678900

* **Success Response:**

  * **Code:** 200

    **Content:** 
    
    ```JSON
    { 
        "events" : [list of event] 
    }
    ```


* **Error Response:**

  * **Code:** 400, 500

    **Content:** 
    
    ```JSON
    { 
        "err" : error detail 
    }
    ```
---

## Event for you 

Return upcoming event sort in ascending order 

* **URL**

  `/event/foryou`

* **Method**

  `GET`

* **Authentication**

    `Required`

*  **URL Params**

    `None` 

* **Body**

    `None`

* **Success Response:**

  * **Code:** 200

    **Content:** 
    
    ```JSON
    { 
        "events" : [list of events]
    }
    ```


* **Error Response:**

  * **Code:** 500

    **Content:** 
    
    ```JSON
    { 
        "err" : "Internal Error"
    }
    ```
---

## Upcoming event

Return upcoming event sort in ascending order 

* **URL**

  `/event/upcoming`

* **Method**

  `GET`

* **Authentication**

    `Optional`

*  **URL Params**

    `None` 

* **Body**

    `None`

* **Success Response:**

  * **Code:** 200

    **Content:** 
    
    ```JSON
    { 
        "events" : [list of events] 
    }
    ```


* **Error Response:**

 * **Code:** 500

    **Content:**
    
    ```JSON
    { 
        "err" : "Internal Error"/Authentication info
    }
    ```