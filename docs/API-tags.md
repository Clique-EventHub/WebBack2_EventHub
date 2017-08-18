# **Tags**
- [Get Tag](#get-tag)
- [Modify Tag](#modify-tag)
- [Search Tag](#search-tag)

---

## Get Tag
get all of tag categories

* **URL**
  `/tags`

* **Method:**
  `GET`

*  **URL Params**

   None


* **Data Params**
  None

* **Success Response:**
  * **Code:** 200
    **Content:**
    ```
    {
        tags : [ list of possible tags ]
    }
    ```



* **Error Response:**

  * **Code:** 500
    **Content:**
    ```
    {"msg" : "error in finding file"}
    ```

---
## Modify Tag
Modify the tag in the server

* **URL**
  /tags/modify

* **Method:**
  `POST`

*  **URL Params**
    None


* **Body**
    ```
    {
     "possible_tag" : ["concert" , "garden" , "tag3", ....] 
    }
    ```

* **Success Response:**
  * **Code:** 201
    **Content:**
    ```    
    {msg : "done"}
    ```


* **Error Response:**

  * **Code:** 404 NOT FOUND
    **Content:**
    ```    
    {msg : "error" }
    ```
---


## Search Tag
Search the Tag in the server

* **URL**
  `/tags/search`

* **Method:**
  `GET`

*  **URL Params**
   **Required:**
    `keywords = [keyword1,keyword2, ... ]`

* **Data Params**
  None

* **Success Response:**
  * **Code:** 201
    **Content:**
    ```
    {
        events : [ event1, event2, ... ]
    }
    ```

* **Error Response:**

  * **Code:** 404 NOT FOUND
    **Content:**
    ```    
        { msg : detail of error }
        detail : "error", "event not found",
    ```         
---
