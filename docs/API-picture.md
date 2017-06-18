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

  `/picture:name`

* **Method:**

  `POST`

*  **URL Params**

   **Required:**

    `field=[event/channel]`

    `size=[small/large]`

* **Data Params**

	`type: form-data`
	`key: picture , value: picture file` 

* **Success Response:**
  * **Code:** 201 
    **Content:**
    `{msg : "done"}`
    `{ url : "link of the picture"}`


* **Error Response:**

  * **Code:** 404 NOT FOUND 
    **Content:** 
`"something went wrong"` //should be fixed to response in msg
`{msg : "error find event : postPicture - picture.controllers"}`
`{msg : "event not found : postPicture - picture.controllers"}`
`{msg : "something went wrong"}`
`{msg : "error find channel : postPicture - picture.controllers"}`
`{msg : "channel not found : postPicture - picture.controllers"}`
`{ error : "event not found" }`


---


## Delete picture
Delete picture

* **URL** 

  `/picture/:name` *use server's generated url*

* **Method:**

  `DELETE`

*  **URL Params**

   `id=[id]`
	 
* **Data Params**
		
	`None`

* **Success Response:**

  * **Code:** `201`

    **Content:** `{ msg : "done" }`

* **Error Response:**

  * **Code:** `404 NOT FOUND`
    **Content:** 
    `{ msg : "event not found" }`
    `{ msg : "error" }`
    `{ msg : "error1" }`
    `{ msg : "error2" }`
    `{ msg : "picture is not found" }`
---

