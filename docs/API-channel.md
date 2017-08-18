# **Channel**

- [Get channel detail](#get-channel-detail)

- [Search channel](#searh-channel)

---

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

* **Example**

    `GET /channel?id=1234`

* **Success Response:**

  * **Code:** 200

    **Content:** 
    ```
    {
        name ,
        verified ,
        picture ,
        picture_large ,
        events
    }
    ```

* **Error Response:**

  * **Code:** 404, 500

    **Content:** 
    ```
    {
        "msg" : "channel not found"
    }
    ```

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
		
* **Body**

  None

*	**Example**

	```
	    You can use both keyword and keywords
	    GET /channel/search?keyword=water
	    GET /channel/search?keywords=winter,fell,down
	```

* **Success Response:**

  * **Code:** 200

    **Content:** list of match channel
    ```
    {
        channels : [{
             _id ,
             name ,
             picture
        }]
    }
    ```



* **Error Response:**

  * **Code:** 404,500

    **Content:** 
    ```
    {
        "err" : error detail
    }
    ```

---
