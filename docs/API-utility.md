# **Utility**
- [get data](#get-data)

---

## get data 
get fields of data

* **URL**

  `/reqdata` 

* **Method:**

  `GET`

*  **URL Params**

    `fields=requestableFieldUser`

* **Data Params**

    `None`

* **Example**
    ```
    GET /reqdata?fields=requestableFieldUser
    ```

* **Success Response:**

  * **Code:** `2xx`

    **Content:**
	```
	{ fields : [ list of requestable ] }
	 *fields is same as URL params
	```

* **Error Response:**

  * **Code:** 500

    **Content:**
    ```JSON
    {"msg" : "error"}
    ```
---

