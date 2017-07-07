# **Picture**

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
    {"msg" : "error in finding file"}

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

* **Data Params**

	`type: form-data`
	`key: pictures , value: picture file` _accept multiple picture_


* **Success Response:**
  * **Code:** 201
    **Content:**
    `{msg : "done"}`
    `{ urls : list of picture url}`


* **Error Response:**

  * **Code:** 500,404
    **Content:**
`"something went wrong"` //should be fixed to response in msg
`{err : "error find event"}`
`{err : "event not found"`
`{err : "something went wrong"}`
`{err : "error find channel"}`
`{err : "channel not found"}`
`{ error : "event not found" }`


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
      urls : [ list of url]
  }
  ```

* **Success Response:**

  * **Code:** `200`

    **Content:** `{ msg : "done" }`

* **Error Response:**

  * **Code:** `400,500`
    **Content:**
    `{ msg : "Something went wrong" }`
---
