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

    **Optional:**

    `stat=[boolean]`

* **Body**

  None

* **Success Response:**

  * **Code:** 200

    **Content:** `{fields : data}`

    *__fields__: _id,title,about,video,channel,location,date_start,expire,refs,join,time_each_day,
		date_end,picture,picture_large,year_require,faculty_require,tags,forms,notes,who_join,who_interest,
    time_start,time_end,contact_information,optional_field,require_field,msg_after_join*

* **Error Response:**

  * **Code:** 400,500

    **Content:** `{err : detail of error}`
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

    **Optional:** `top = [number of lastest event]`

* **Body**

    None

* **Success Response:**

  * **Code:** 200

    **Content:** `[ event object ]`


* **Error Response:**

  * **Code:** 500

    **Content:** `{ "err" : error detail }`
---


## Get hot event

get the most 3 hot event

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

    **Content:** `{ fields : event }`

    *__fields:__ first , second , third*
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

*  **Example**

		```
				You can use both keyword and keywords
				/event/search?keyword=water
				/event/search?keywords=winter,fell,down
		```

* **Body**
    None

* **Success Response:**

  * **Code:** 200

    **Content:** `{ events : list of event }`


* **Error Response:**

  * **Code:** 400, 500

    **Content:** `{ "err" : error detail }`
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

* **Success Response:**

  * **Code:** 200

    **Content:** `{ events : list of event }`


* **Error Response:**

  * **Code:** 400, 500

    **Content:** `{ "err" : error detail }`
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

    **Content:** `{ events : list of events }`


* **Error Response:**

  * **Code:** 500

    **Content:** `{ "err" : Internal Error }`
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

    **Content:** `{ events : list of events }`


* **Error Response:**

 * **Code:** 500

    **Content:**
    `{ "err" : Internal Error }`
    `{ "err" : Authentication info }`
