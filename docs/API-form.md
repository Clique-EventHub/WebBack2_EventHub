# **FORM**
---

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

    `id=form's id`
		
    **Optional:**

	`opt=responses`	
    

* **Body**

    None

* **Example**
	```
    GET /form?id=123456789
    GET /form?id=123456789&opt=responses
	```

* **Success Response:**

  * **Code:** 202

    **Content:** 
    
    ```JSON
    {
    "msg": "OK",
    "form": {
        "_id": "599518e87ee4650030b23f7b",
        "event": "599518137ee4650030b23f7a",
        "channel": "599516237ee4650030b23f78",
        "lastModified": 1502942512724,
        "created_date": 1502942512724,
        "questions": [
            {
                "question": "Where do you wanna go?",
                "_id": "599518e87ee4650030b23f7d",
                "choices": [],
                "type": "short answer"
            },
            {
                "question": "What do you wanna eat?",
                "_id": "599518e87ee4650030b23f7c",
                "choices": [
                    "Dak galbi",
                    "Kouen",
                    "Oishi grand",
                    "KFC",
                    "BBQ plaza"
                ],
                "type": "check box"
            }
        ],
        "title": "test form"
    },
    "code": 200
    }
    ```
    

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    
    ```JSON
    {
        "err" : error detail
    }
    ```
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
                        "question" : "Where do you wanna go?",
                        "choices" : [],
                        "type" : "short answer"
                },
                {
                        "question" : "What do you wanna eat?",
                        "choices" : ["Dak galbi","Kouen","Oishi grand","KFC","BBQ plaza"],
                        "type" : "check box"
                },
                {
                        "question" : "Who is your daddy?",
                        "choices" : ["Jon","Therian","Jamie"],
                        "type" : "bullet"
                },
                {
                        "question" : "Which weapon do you prefer?",
                        "choices" : ["Sword","Dragon","Arrow","Hammer","Run"],
                        "type" : "spinner"
                },
        ]
    }
    ```
	
* **Success Response:**

  * **Code:** 200

    **Content:** 
    ```JSON
    {
        "msg": "done",
        "id": "5995ed0fcb0d840079dc174c",
        "form": obj detail of created form
    }
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```JSON
    {
        "err" : error detail
    }
    ```

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

  `{question : answer}` 

* **Example**
    ```
    PUT /form?id=1234567890
    ```
    with JSON body
    ```JSON	
    {
		"Where do you wanna go?" : "go to home",
		"What do you wanna eat?" : ["Kouen", "Oishi grand"],
		"Who is your daddy?" : ["No one"]
	}
	```
	
* **Success Response:**

  * **Code:** 200

    **Content:** 
    
    ```JSON
    {"msg" : "done"}
    ```

* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    
    ```JSON
    {"err" : error detail}
    ```
	
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

* **Example**
    
    ```
    DELETE /form?id=1234567890
    ```

* **Success Response:**

  * **Code:** 200

    **Content:** 
    ```JSON
    {"msg" : "done"}
    ```


* **Error Response:**

  * **Code:** 403,404,500

    **Content:** 
    ```JSON
    {"err" : error detail}
    ```
---
