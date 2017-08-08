# **Channel**

## Get channel detail

Returns json data about detail of channel

* **URL**

  `/channel`

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

    *__fields__: name,verified,picture,picture_large,events*
---
## Search channel

 Search channel from input keyword

* **URL**

  `/channel/search  `

* **Method:**

  `GET`

* **Authentication**

    `Optional`

*  **URL Params**

   **Required:**
    `keyword/keywords = key1,key2,key3`
		
	**Example**

	```
	    You can use both keyword and keywords
	    /channel/search?keyword=water 
	    /channel/search?keywords=winter,fell,down
	```

* **Body**

  None

* **Success Response:**

  * **Code:** 200

    **Content:** `{channels : list of channels in form {fields : data}}`

    *__fields__: _id,name,picture*

* **Error Response:**

  * **Code:** 404,500

    **Content:** `{err : error detail}`
---
