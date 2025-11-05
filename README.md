# React + Vite
# Beldex Bridge Front End

This is the front end used for the beldex bridge application.

## Pre-requisites
  - Node v22.21.0
  - VITE v5.4.21
    - This can be installed using [nvm](https://github.com/nvm-sh/nvm)

## Installation

If you're using `nvm` then run:
```
nvm use
```

Install all the dependencies:
```
npm install
```

Edit `config/config.js` with your required settings.

### Development

To run the app in development mode, simply run:
```
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Production

The application needs to be built for production.
This can be done by running:
```
npm run build
```

This should build everything and place it in the `build` folder.<br>
All that needs to be done is to deploy the application.

You can deploy by running the provided server
```
npm start
```

Or you can choose your own deployment method.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
