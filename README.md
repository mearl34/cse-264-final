# CSE-264 Final Project - Bookworm
## Team Members: 
Both members took on front-end and back-end developent, but particular roles taken were:
Anthony Cutrona - Database development and Backend API creation
Maisy Earl - External API support and Authentication

## Project Description
Bookworm is a platform where users can create thier own digital reading lists as well as view the reading lists of others! The primary functionallity of the app is a search page where users can search for books to add to their list, as well as a user search page were other users profiles can be viewed. When adding a book to a list, the current status of the book (read, reading, etc..) can be selected by the user, as well as a personal rating. This list can then be viewed at your own profile page, along with other information such as a bio. If viewing by other users is not desired, a profile can be set to private to remove it's ability to be searched. Aside from regular users, accounts can be set to the admin role (done manually in database for security), who can delete accounts and view hidden users. 

### Below is a breakdown of how the project meets requirements


- User Accounts & Roles: The project features user accounts which are authenticated using Google Oauth, with account information stored in our database. The project features two account roles: Users, which can access the main functions of the application, searching and list creation. Admins: which have all of the abilities as users, but are able to view hidden accounts in searches, aswell as delete accounts if nessicary.

- Database: A Supabase database was created featuring two tables: users, which stores each users data: {uid, gmail, gid (google-id), username, role, pronouns, is_private, pfp, bio} and list_entries, which houses individual entries for lists, which are then fetched by user to create thier respective list, featuring the following attributes {id, *user_id*, book_id, rating, status}. Uniquness constraints were placed on attributes such as gid and gmail to ensure account uniqueness.

- Interactive UI: Interactivity is found throughout the application, including: text fields for searching and modifying account info, dropdowns for choosing an entry's information, as well as navigation throughout the application using MUI dialogs and page routing. The application also features animations from the Framer Motion library to improve interactivity.

- New Library or Framework: Framer Motion library was utilized to provide more engaging animations in the application and to improve styling.

- Internal REST API: An internal REST API was created to safely communicate between our front-end and back-end, allowing the retreval of database values in the front-end, as well as storage of input data to the backend (and then database). Console logging was utilized in many aspects of the project to confirm API functionallity during development. API calls in the frontend are primaril done through the functions found in the API folder, with the backend's respective routes in app.js.

- External REST API: Our project primarily revolves around the use of the [Open Library API](https://openlibrary.org/developers/api), (changed from originally proposed GutenDex API, as it posed significant limitaitions) which provides an extensive library of books, able to be searched for, and provided in json. This API provides all of the book descriptions, covers, authors, and tags found in the app, aswell as ids for books, which are utilized in the database as the book_id attribute.
