# **FORM**


## Get form

Return detail of form.

**parameters:**

*no param:* return title,event,channel,questions

*responses:* include responses

*export:* return csv of responses



* **URL**

  `/form`

* **Method:**

  `GET`

* **Authentication**
    
    `Optional` *as default*

    `Required` *when desire responses in return*

*  **URL Params**

   **Required:**

    `id = form's id`

* **Body**

    None

* **Success Response:**

  * **Code:** 202

    **Content:** `{ "fields": ... }`
    
    *__fields__: title, event, channel, questions, responses*

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{err : error detail}`
---



## Create/Edit form  

If id is provide in params then API will edit the form.

Otherwise, API will create a new form by use body as data.

{ formTitle: formId } will automatically attach to forms field in event detail.


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

    `{fields : ...}`
	
	*__Required fields__: title, channel, event*
	
	*__Optional fields__: questions*

	*__questions template__:* object with following fields

    "question": *STRING here*

    "type" : *short answer/bullet/check box/spinner*

    "choices": [String]  *left this field as empty list if question's type has no choice*
    
    *__Example__*
    ```JSON
    {
        "title" : "test form",
        "channel" : "5940251ee7b3640011dbe34f",
        "event" : "5940256930a51800266b0cfb",
        "questions" : [
                {
                        "question" : "how old are you",
                        "choices" : [],
                        "type" : "short answer"
                },
                {
                        "question" : "supp?",
                        "_id" : ObjectId("5940286930a51800266b0cfd"),
                        "choices" : ["1","2","3","4"],
                        "type" : "bullet"
                }
        ]
    }
    ```
	
* **Success Response:**

  * **Code:** 200

    **Content:** `{fields : ...}`

    *__fields__: msg, id*

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{err : error detail}`

---

## Save form's response

 save user's response to database

* **URL**

  `/form`

* **Method:**

  `PUT`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = form's id`

* **Body**

  `{_${question} : answer}` *insert _ for preventing object from sorting questions*

* **Success Response:**

  * **Code:** 200

    **Content:** `{"msg" : "done"}`

	**Example**
	```JSON
	{
		"Where do you wanna go?" : "go to home",
		"What do you wanna eat?" : ["Kouen", "Oishi grand"]
	}
	```
	
* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{err : error detail}`
	

---

## Delete form

 delete form from database

* **URL**

  `/form`

* **Method:**

  `DELETE`

* **Authentication**

    `Required`

*  **URL Params**

   **Required:**

    `id = form's id`

* **Body**

  `None`

* **Success Response:**

  * **Code:** 200

    **Content:** `{"msg" : "done"}`


* **Error Response:**

  * **Code:** 403,404,500

    **Content:** `{err : error detail}`
---

