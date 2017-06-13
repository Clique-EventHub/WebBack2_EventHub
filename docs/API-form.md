# **FORM**

uses the same login system as normal users. The following below are special functions for admin channel.
## Crate/Edit form  

Change details of channel

* **URL**

  `/form`

* **Method:**

  `POST`

* **Authentication**

    `Require`

*  **URL Params**

    **Optional:**

    `id = form's id`

* **Body**

	**Required**
  `{fields : data}`
	
	*__fields__: title,channel,event*
	
	**Optional**

  *__fields__: questions*

	*questions template*

		"question": *STRING here*
		"type" : *short answer/bullet/check box/spinner*
		"choices": [],  *left this field as empty list if question's type has no choice*

		

* **Success Response:**

  * **Code:** 200

    **Content:** `{fields : data}`

    *__fields__: name,verified,picture,picture_large,events*

* **Error Response:**

  * **Code:** 403,404,410,500

    **Content:** `{err : error detail}`
---
## Get channel stat

 Returns the channel's statistic data.

* **URL**

  `/channel/stat'

* **Method:**

  `GET`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = channel's id`

* **Body**

  None

* **Success Response:**

  * **Code:** 200

    **Content:** `{fields : data}`

    *__fields__: visit*

* **Error Response:**

  * **Code:** 403,404,410,500

    **Content:** `{err : error detail}`
---

## Add admin channel

 Add colleagues to be admin channel.

* **URL**

  `/user/add-admin'

* **Method:**

  `PUT`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = channel's id`

* **Body**

  `{fields : data}`

  *__fields__: user*

* **Success Response:**

  * **Code:** 202

    **Content:** `{ "msg":"done" }`

* **Error Response:**

  * **Code:** 403,404,410,500

    **Content:** `{err : error detail}`

