# Garden Design Application 🍃
> ASP.NET & Angular Garden Design Application

<a name="top"></a>
## Table of Contents 📖
1. [Preview & Description](#preview)
2. [Installation](#installation)
3. [Register & Login](#register)
4. [User's Projects](#projects)
5. [Adding Entrance](#entrance)
6. [Adding Elements](#adding)
   - [Pavements](#pavements)
   - [Trees](#trees)
   - [Bushes](#bushes)
   - [Flowers](#flowers)
   - [Benches](#benches)
7. [Removing Elements](#remove)
8. [Setting Ground](#ground)
9. [Setting Fence](#fence)
10. [Reset Camera](#camera)
11. [2D Mode](#2d)
12. [Generating PDF File](#pdf)
13. [Profile Edit](#edit)
14. [Admin Role](#admin)
15. [Translations](#translations)
16. [Light & Dark Mode](#lightdarkmode)
17. [Setting Environment](#environment)
    - [Forest](#forest)
    - [City](#city)

<a name="preview"></a>
## 1. Preview & Description 👀

It is a garden design app to support the designers' work and save them time. It is also my project for my engineering thesis.

Idea behind the app is that the user can create projects to which they can return in the future, design the garden in a 3D visualisation, add and remove individual elements such as trees, bushes or pavements, and finally generate a PDF file with detailed documentation of the project.

Application uses ASP.NET as backend and Angular as frontend. WebGL was used to create the 3D visualisation (JavaScript library [ThreeJS](https://threejs.org/)).

Inspiration for the project came from my first programming job at Idealogic company, where I had been creating software for designing houses also using WebGL.

![preview1](https://github.com/user-attachments/assets/0ba3b173-2581-4558-8929-1655fba83d6e)

![preview2](https://github.com/user-attachments/assets/5f6c4c8c-9de1-4419-8941-1b590f85c6de)

![preview3](https://github.com/user-attachments/assets/284a54d0-2845-4f7c-ba89-5fa6c0cb5ddf)

<a name="installation"></a>
## 2. Installation 🛒

First of all, clone the repository. You can do it using this URL:

`https://github.com/patrykwitek/Garden-Design-App-.NET-Angular.git`

In order for application to run properly, you need to install modules with the command:

`npm install --legacy-peer-deps`

If an error appears, it means that there is probably no node.js on the computer. You can install it from [https://nodejs.org/en](https://nodejs.org/en).

If you have node.js on your computer and continue to get errors when trying to install modules, run the command:

`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` 

and retry with `npm install --legacy-peer-deps`.

You should also install ASP.NET, I used version 6 and .NET SDK: [https://dotnet.microsoft.com/en-us/download/dotnet/6.0](https://dotnet.microsoft.com/en-us/download/dotnet/6.0).

After cloning the repository, you can launch the application with commands

- on the frontend:
`ng serve`

- on the backend:
`dotnet watch`

If application runs, but after trying to login or register errors pop up in the console ERR_CERT_AUTHORITY_INVALID:

1. open new tab
2. paste url https://localhost:5001/api/login/register
3. click 'open anyway'
4. have fun exploring the app

<a name="register"></a>
## 3. Register & Login 🙋

A non-logged-in user accessing the site will see an initial page with the option to register and log in. 

The user skipping a field will see an appropriate message, as field validation has been implemented in the registration form. Once registered, the user is automatically logged in.

The login uses the JWT Token, which is generated on the backend side and saved in local storage.

https://github.com/user-attachments/assets/dbde3655-d1a2-43d9-ad36-2b4c042c2821

<a name="projects"></a>
## 4. User's Projects 🧑‍💻

Users can create their own designs. Garden designer can set their name, width, depth, ground type, fence type and environment type. Project owners can also delete and edit projects.

https://github.com/user-attachments/assets/f0011377-3b87-46d4-8e4c-91aff2a90bea

When browsing through the list of projects, pagination was used for optimisation purposes.

https://github.com/user-attachments/assets/44f792c7-2b64-437b-84c5-a53b7802da27

<a name="entrance"></a>
## 5. Adding entrance 🚪

Thanks to the entrance tool, the user can add entrances from all sides of the garden.

https://github.com/user-attachments/assets/108e00ca-473e-4465-8044-79e6df60b0a0

<a name="adding"></a>
## 6. Adding Elements 🌿

User can add various elements to the garden.

https://github.com/user-attachments/assets/f9bf1100-02f0-47c3-9132-55d7acca254c

<a name="pavements"></a>
### Pavements 🚶

On 2D: 

![pavements 2D](https://github.com/user-attachments/assets/e99dc0d2-d3dc-4195-a5cc-d2771ac6d533)

On 3D:

![pavements visualisation](https://github.com/user-attachments/assets/c9082e98-2c36-4a8e-be4e-533291179f0c)

Pavement position is selected by using the tool. Algorithm recognises the places where a footpath can be added - the entrances to the garden or the continuation of already placed footpaths. When cursor is close enough, pavement itself adjusts to the existing pavement or entrance.

Once a single pavement is added, the tool doesn't deactivate, but gives the option of continuously adding more walkways until user clicks the "escape" button. Users can cancel the selection of the walkway at any time by pressing the ESC button.

https://github.com/user-attachments/assets/4ebb1e93-e1df-4c0f-9a3b-b1d08f14a293

<a name="trees"></a>
### Trees 🌳

User has a choice of three tree types: pine, oak and birch. Trees, like all other elements, cannot be placed in position of another element so they do not overlap.
While tree tool is open, user can cancel the tree selection at any time by clicking the Escape button.

After the tree position has been chosen, user chooses a tree rotation.

https://github.com/user-attachments/assets/af90ce4b-d268-47af-accf-d3227f840a2c

<a name="bushes"></a>
### Bushes 🌲

https://github.com/user-attachments/assets/14565824-1405-4e0d-8839-6d93638b0d80

<a name="flowers"></a>
### Flowers 🌼

https://github.com/user-attachments/assets/da028268-c0cc-46c6-95c8-266c7d8eb46d

<a name="benches"></a>
### Benches 🪑

Benches can only be added next to the pavement. When the mouse is close enough, the tool will automatically adjust the bench next to the pavement.

https://github.com/user-attachments/assets/1d838bd8-f2e1-4623-936f-8a2a526c4431

<a name="remove"></a>
## 7. Removing Elements 🗑️

If user wants to remove a badly placed element or wants to change the garden, he can remove the placed elements. This can be done by selecting “Remove Element” button in the navbar. 

When mouse cursor hovers over an item, it is highlighted. Then when you press right mouse button, it is removed. The delete tool is closed when you press Escape.

https://github.com/user-attachments/assets/93654a3e-621b-45fd-a4eb-fcd3add8f256

<a name="ground"></a>
## 8. Setting Ground 🏡

You can change the ground of a particular garden in the top container of options. When you change the ground, it will be saved and will remain the same when you enter the project again.

https://github.com/user-attachments/assets/b8609a61-471b-4158-9581-a7fb8df2afb4

<a name="fence"></a>
## 9. Setting Fence 🧱

In the top options bar, the user has the option of setting a fence.

https://github.com/user-attachments/assets/8b350fca-b907-4af5-b3d2-cad5fdcff976

<a name="camera"></a>
## 10. Reset Camera 🎥

When the users "flies away" with the camera too far or to a place far away, they can quickly return to the centre of a particular garden by clicking the "Reset Camera" button.

You can also click "r" on the keyboard in design mode and camera will also reset its position.

https://github.com/user-attachments/assets/edd0350e-e93e-498d-95fd-82c96382ea16

<a name="2d"></a>
## 11. 2D Mode 🦅

In the top toolbar, user can switch the view to 2D mode.

https://github.com/user-attachments/assets/30e5483a-f638-4552-838c-72cacb361712

<a name="pdf"></a>
## 12. Generating PDF File 🗃️

Main purpose of the application is to generate documentation of garden project, including all informations about the design and garden elements. Once the garden has been designed as desired, user can click on the "PDF" button in the top navbar. After clicking it, the download of the design documentation in PDF form will start. Generated PDF also includes screenshots of different perspectives of the garden from the application.

https://github.com/user-attachments/assets/1c00e00a-8b89-479c-acf9-4c0480d21d52

[Download example PDF](https://github.com/user-attachments/files/17612464/city.mini.park.pdf)

<a name="edit"></a>
## 13. Profile Edit ✍️

In the top panel, user can enter the edit profile tab, where he or she can edit the username and date of birth.

https://github.com/user-attachments/assets/0105c8ab-436b-40b0-85bb-8342f653a6af

<a name="admin"></a>
## 14. Admin Role 🛡️

Each user has one of two possible roles: admin or user. Administrator has two additional functionalities: 
1. admin has access to view, edit and delete all projects from the database (while the ordinary user has access only to his own)
2. admin can give and take away the admin role from other users

Every newly created user has the role of user by default. In order to change it, this must be done by admin.

After the first start of the application, an administrator account is seeded. The username for seeded admin account is "admin" and password "AdminPassword123@".

https://github.com/user-attachments/assets/ac772445-1001-42b0-9037-5729a00543f0

https://github.com/user-attachments/assets/c072ac6b-dc5a-4552-a048-5513f4ed428f

<a name="translations"></a>
## 15. Translations 💁‍♂️

### **For logged-in user:**

The application supports English and Polish translations. Logged-in user can change application language in settings tab. After that, the selected language will be assigned to user's account (not local storage), so after changing the device, the language will be the same as previously selected.

https://github.com/user-attachments/assets/438a6c65-9242-4e63-8be9-4356299a0c8a

### **For not logged-in user:**

A non-logged-in user can select the language on the welcome page.

https://github.com/user-attachments/assets/2ebf22a0-4fe2-4f03-9246-4c0b1b6d0f58

<a name="lightdarkmode"></a>
## 16. Light & Dark Mode 🌙

The garden designer has the option to change the mode from light to dark (night) to work comfortably in the evening. When changing the dark mode, in addition to changing the interface colours to darker, the sky changes from day to night.

The dark mode information is stored in local storage, so the application will remember the state saved by the user.

https://github.com/user-attachments/assets/b966a92b-ef79-4fb6-be2c-6204d0024e7c

<a name="environment"></a>
## 17. Setting environment 🏙️

User can set the garden environment. It can be a forest, a city or an empty space.

https://github.com/user-attachments/assets/0a1ed3e4-6178-416e-b60b-d3007dc97bd8

<a name="forest"></a>
### Forest 🌳

![forest](https://github.com/user-attachments/assets/90cf6aee-fd2e-4ab3-a010-4604bbe4dedf)

<a name="city"></a>
### City 🏙️

https://github.com/user-attachments/assets/98f0b537-5539-43e6-a858-0def32623b74

[🔼 Back to top](#top)
