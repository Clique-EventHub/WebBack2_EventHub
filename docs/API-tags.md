# **Tags**

---
## Get Tag
get Tag
* **URL** 
  /tags
* **Method:**
  `GET`
*  **URL Params**
   **Required:**
    ???
    
    
* **Data Params**
  None
​
* **Success Response:**
  * **Code:** 200
    **Content:**
Sends "tags.json" 
    
​
* **Error Response:**
​
  * **Code:** 500
    **Content:** 
`{"msg" : "error in finding file"}`

---
## Modify Tag
Modify the tag in the server
* **URL** 
  /tags/modify
* **Method:**
  `POST`
*  **URL Params**
   **Required:**
    None
    
    
* **Data Params**
  `{"tags" : ["tag1" , "tag2" , ....] }`
​
* **Success Response:**
  * **Code:** 201 
    **Content:**
`{msg : "done"}`
    
​
* **Error Response:**
​
  * **Code:** 404 NOT FOUND 
    **Content:** 
`{msg : "error" }`

---


## Search Tag
Search the Tag in the server
* **URL** 
  /tags/search
* **Method:**
  `GET`
*  **URL Params**
   **Required:**
    `keywords = [keyword1,keyword2, ... ]`
    
* **Data Params**
  None
​
* **Success Response:**
  * **Code:** 201 
    **Content:**
`{events : event1, event2, ... }`
    
​
* **Error Response:**
​
  * **Code:** 404 NOT FOUND 
    **Content:** 
`{msg : "error" }`
`{msg : "event not found on tags : searchTag - tag.controllers" }`

---