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

    *__fields__: title,about,video,channel,location,date_start,expire,date_end,picture,picture_large, year_require,faculty_require,tags*

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

    *__fields:__ first , second , thrid*
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

    **Require:** `keyword = [ keyword of searching ]`

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
