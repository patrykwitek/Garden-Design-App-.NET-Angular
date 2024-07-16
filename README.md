# Garden Design Application 🌳 _(early version)_
> ASP.NET & Angular Garden Design Application

### **Important Message: At the moment it is a very early version of the project and newer and newer functionalities will appear with time.**

<a name="top"></a>
## Table of Contents 📖
1. [Preview & Description](#preview)
2. [Installation](#installation)
3. [Register & Login](#register)
4. [User's Projects](#projects)
5. [Adding Elements](#adding)
6. [Removing Elements](#remove)
7. [Setting Ground](#ground)
8. [Setting Fence](#fence)
9. [Reset Camera](#camera)
10. [2D Mode](#2d)
11. [Generating PDF File](#pdf)
12. [Profile Edit](#edit)
13. [Admin Role](#admin)
14. [Translations](#translations)
15. [Light & Dark Mode](#lightdarkmode)
16. [Errors handling](#errors)

<a name="preview"></a>
## 1. Preview & Description 👀

It is a garden design app to support the designers' work and save them time. It is also my project for my engineering thesis.

Idea behind the app is that the user can create projects to which they can return in the future, design the garden in a 3D visualisation, add and remove individual elements such as trees, bushes or pavements, and finally generate a PDF file with detailed documentation of the project.

Application uses ASP.NET as backend and Angular as frontend. WebGL was used to create the 3D visualisation (JavaScript library [ThreeJS](https://threejs.org/)).

Inspiration for the project came from my first programming job at Idealogic company, where I had been creating software for designing houses also using WebGL.

![preview](https://github.com/user-attachments/assets/ed238907-07cb-4206-9558-08c1298522b0)

<a name="installation"></a>
## 2. Installation 🛒

First of all, clone the repository. You can do it using this URL:

`https://github.com/patrykwitek/Garden-Design-App-.NET-Angular.git`

You should have Angular installed

`npm install -g @angular/cli`

also install ASP.NET, I used version 6 and .NET SDK

After cloning the repository, you can launch the application with commands

- on the frontend:
`ng serve`

- on the backend:
`dotnet watch`

<a name="register"></a>
## 3. Register & Login 🙋

A non-logged-in user accessing the site will see an initial page with the option to register and log in. 

The user skipping a field will see an appropriate message, as field validation has been implemented in the registration form. Once registered, the user is automatically logged in.

The login uses the JWT Token, which is generated on the backend side and saved in local storage.

https://github.com/user-attachments/assets/a6ec2348-032f-45c2-bfcb-3a3d8644ed9c

<a name="projects"></a>
## 4. User's Projects 🧑‍💻

### Adding projects

Users can create their own designs. At the moment, he or she can give them width and depth, but the functionality for creating a new design will be extended in the future.

https://github.com/user-attachments/assets/96d7864d-bb5c-4b5b-b971-9e60eac9b506

### Editing projects

*This functionality will come in the future*

### Removing projects

*This functionality will come in the future*

<a name="adding"></a>
## 5. Adding Elements 🌿

*This functionality will come in the future*

<a name="remove"></a>
## 6. Removing Elements 🗑️

*This functionality will come in the future*

<a name="ground"></a>
## 7. Setting Ground 🏡

You can change the ground of a particular garden in the top container of options. When you change the ground, it will be saved and will remain the same when you enter the project again.

https://github.com/user-attachments/assets/52948a83-ff8c-4254-9ed0-10a47f54fe5b

<a name="fence"></a>
## 8. Setting Fence 🧱

*This functionality will come in the future*

<a name="camera"></a>
## 9. Reset Camera 🎥

When the user "flies away" with the camera too far or to a place far away, they can quickly return to the centre of a particular garden by clicking the "Reset Camera" button.

https://github.com/user-attachments/assets/9c9b2efa-033c-4b70-88a8-acdbe076d0d2

<a name="2d"></a>
## 10. 2D Mode 🦅

*This functionality will come in the future*

<a name="pdf"></a>
## 11. Generating PDF File 🗃️

*This functionality will come in the future*

<a name="edit"></a>
## 12. Profile Edit ✍️

*This functionality will come in the future*

<a name="admin"></a>
## 13. Admin Role 🛡️

*This functionality will come in the future*

<a name="translations"></a>
## 14. Translations 💁‍♂️

*This functionality will come in the future*

<a name="lightdarkmode"></a>
## 15. Light & Dark Mode 🌙

*This functionality will come in the future*

<a name="errors"></a>
## 16. Errors handling 🚑

*This functionality will come in the future*


[🔼 Back to top](#top)
