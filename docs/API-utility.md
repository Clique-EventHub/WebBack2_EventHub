# **Utility**

---
## get data 
create picture in the server and response the url
* **URL**

  `/reqdata ` *use server's generated url*

* **Method:**

  `GET`

*  **URL Params**

    `None`

* **Data Params**

    `fields=requestableFieldUser`

* **Success Response:**

  * **Code:** `2xx`

    **Content:**
		{ field : ... }

* **Error Response:**

  * **Code:** 500

    **Content:**
    {"msg" : "error in finding file"}

---

