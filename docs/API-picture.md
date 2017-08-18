# **Picture**
- [Get Picture](#get-picture)
- [Post Picture](#post-picture)
- [Delete picture](#delete-picture)
---
## Get Picture
create picture in the server and response the url
* **URL**

  `/picture/(name_of_the_picture) ` *use server's generated url*

* **Method:**

  `GET`

*  **URL Params**

    `None`

* **Data Params**

    `None`

* **Success Response:**

  * **Code:** `2xx`

    **Content:**
    Sends the picture file

* **Error Response:**

  * **Code:** 500

    **Content:**
    ```
    {"err" : "error in finding file"}
    ```
    
---

## Post Picture

create picture in the server and response the url
If repost small picture, server will automatically remove the old one.
If post large picture, server will add a new one to the list.

* **URL**

  `/picture`

* **Method:**

  `POST`

*  **URL Params**

   **Required:**

    `field=[event/channel]`
    `size=[small/large]`
    `id=[event's id]`

* **Body**
    
    ```    
    type: form-data
	key: pictures 
    value: pictures file (allow multiple pictures)
    ```
    
* **Example**
    ```
    POST /picture?field=event&size=small&id=1234567890
    ```

* **Success Response:**
  * **Code:** 201
    **Content:**
    ```
    {
        msg : "done"
        urls : list of picture url
    }
    ```

* **Error Response:**

  * **Code:** 500,404
    **Content:**
    ```
    {"err" : detail of error}
    ```

---


## Delete picture
Delete picture

url in list must belong to the same event/channel

* **URL**

  `/picture/

* **Method:**

  `DELETE`

* **Authentication:**

  `Require`

*  **URL Params**

    `None`

* **Data Params**

	```JSON
  {
      "urls" : [
               "https://api.cueventhub.com/picture/cl595fdb9aa87059006ee48817nfc521499459423556.jpg",
               "https://api.cueventhub.com/picture/cl595fdb9aa87059006ee48817j5ot71499459423744.jpg",
               "https://api.cueventhub.com/picture/cl595fdb9aa87059006ee48817eozo61499459423804.jpg",
               "https://api.cueventhub.com/picture/cl595fdb9aa87059006ee488174d40y1499459423941.jpg"
           ]
  }
  ```

* **Success Response:**

  * **Code:** `200`

    **Content:** 
    ```
    { msg : "done" }
    ```

* **Error Response:**

  * **Code:** `400,500`
    **Content:**
    ```
    { err : detail of error }
    ```
---
