# Obesity Control App (frontend)

## Description
This is the frontend repository for the Obesity Control App project.

Obesity Control App is a personal project that consists of a web application for a supposed obesity clinic interested in providing obesity treatments to its patients.

The application allows:
- That patients enter weekly data on their physical state and can consult the treatment that is being assigned to these states.
- That doctors can assign treatments to the physical states of patients who have not yet been assigned treatment, as well as search for patients to consult their history of states.
- That the office staff can manage the users of the application.
- That the administrator can do the same tasks as doctors and office personnel, and also be able to manage the treatments offered by the entity.

The frontend is a SPA developed with <a href="https://vuejs.org/" target="_blank"> <img src="public/favicon.ico"> </a> version **2**, which connects to the backend invoking its endpoints and is in charge of maintaining the user state.
The backend is in this [repository](https://github.com/noxxic3/o-c-a-backend).

## Project Set Up

### Installation & Set Up

1. Install Vue CLI
```
npm install -g @vue/cli
```

2. Install dependencies
```
npm install
```

### Edit files

1. In `/src/main.js`, put the correct URL of the backend API:
```
axios.defaults.baseURL = 'http://your-domain/public/api/'; 
```

2. In `/src/store/index.js`, put the correct URL of the backend & the backend storage folder:
```
backendURL: 'http://your-domain/public/',
backendStorageURL: 'http://your-domain/public/storage/',
```

### Run development server

* Compiles and hot-reloads for development
```
npm run serve
```

### Building for Production

* Generate production build
```
npm run build
```

### Credentials

Users access:

* Patient
| Email       | Password          |
| :---        | :---              |
| patient_a@m | password_patientA |
| patient_b@m | password_patientB |

* Doctor
| Email       | Password          |
| :---        | :---              |
| doctor_a@m  | password_doctorA  |

* Office Staff 
| Email       | Password          |
| :---        | :---              |
| office_a@m  | password_officeA  |

* Administrator
| Email       |  Password         |
| :---        | :---              |
| admin_a@m   | password_adminA   |

(This default data can be seen in the backend database).

## Contribution (Forking)
De momento nada

## Licensing
De momento nada

### Credits
This project includes graphic resources taken from the following sites: 
<a href="https://www.freepik.com/" target="_blank">Freepik</a>, 
<a href="https://pixabay.com/" target="_blank">Pixabay</a>, 
<a href="https://thenounproject.com/" target="_blank">The Noun Project</a>, and 
<a href="https://fontawesome.com/" target="_blank">Font Awesome</a>, all licensed with attribution.