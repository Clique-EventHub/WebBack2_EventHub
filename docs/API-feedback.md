# **FORM**

- [get feedbacks](#get-feedbacks)
- [Send a new feedback](#send-a-new-feedback)
- [Mark as read](#mark-as-read)

---

## Get feedbacks

get all feedbacks, sort by date

* **URL**

  `/feedback`

* **Method:**

  `GET`

* **Authentication**
    
    `Optional` 

*  **URL Params**

    `NONE`

* **Body**

    `NONE`

* **Example**
    ```
    GET /feedbacks
    ```

* **Success Response:**

  * **Code:** 200

    **Content:** 
    
    ```JSON
    {
        "feedbacks": [
        {
            "_id": "5a0b354350c48d02eea4f00f",
            "__v": 0,
            "created_date": 1510683867634,
            "read": false,
            "text": "i love youuuu",
            "type": null
        },
        {
            "_id": "5a0b332658cff4026ee26c22",
            "__v": 0,
            "created_date": 1510683427661,
            "read": false,
            "text": "i love you2",
            "type": "bug"
        },
    
    }
    ```
* **Success Response:**

* **Code:** 500

**Content:** 
    
    ```JSON
    {
        "err" : "Internal Error"
    }
    ```
    
---

## Send a new feedback

Save new feedback

* **URL**

  `/feedback`

* **Method:**

  `POST`

* **Authentication**
    
    `Optional` 

*  **URL Params**

    `NONE`

* **Body**

    ```JSON
    "type" : "bug",
    "text" : "there is a bug"
    ```

* **Example**
    ```
    POST /feedbacks
    ```

* **Success Response:**

    return saved feedback

  * **Code:** 200

    **Content:** 
    
    ```JSON
    {
    "__v": 0,
    "_id": "5a0b354350c48d02eea4f00f",
    "created_date": 1510683867634,
    "read": false,
    "text": "there is a bug",
    "type": bug
    }
    ```
* **Error Response:**
    ```JSON
    {
        "err" : "Internal Error"
    }
    ```
---

## Mark as read

set read flag of feedback

* **URL**

  `/feedback`

* **Method:**

  `PUT`

* **Authentication**
    
    `Optional` 

*  **URL Params**

    `NONE`

* **Body**
    ```JSON
    {
        "feedbacks" : [
            {
                "id" : "5a0b317a1b029c018ea3d4b3",
                "read" : true
            },
            {
                "id" : "5a0b322a32670b01ae8236b8",
                "read" : false
            }   
        ]
    }
    ```

* **Example**
    ```
    PUT /feedbacks
    ```

* **Success Response:**

    return updated feedback

  * **Code:** 200

    **Content:** 
    ```JSON
      {
        "feedbacks": [
            {
                "_id": "5a0b317a1b029c018ea3d4b3",
                "__v": 0,
                "created_date": 1510682810014,
                "read": true,
                "text": null,
                "type": null
            },
            {
                "_id": "5a0b322a32670b01ae8236b8",
                "__v": 0,
                "created_date": 1510683172210,
                "read": false,
                "text": null,
                "type": null
            }
        ]
    }
    ```
* **Error Response:**
    ```JSON
    {
        "err" : "Internal Error"
    }
    ```
---