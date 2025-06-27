# Blogtris

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Angelmmc/blogtris-app-ionic.svg)](https://github.com/Angelmmc/blogtris-app-ionic/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/Angelmmc/blogtris-app-ionic.svg)](https://github.com/Angelmmc/blogtris-app-ionic/issues)

## About 
This is an offline version of the blog mobile application developed during my internship.  
Built with the **Ionic Vue** framework, It includes all core features and works using simulated data, intended for demonstration purposes only.

## Features

- Main views such as home, profile, blog, community and saved
- Options menu when opening a blog
- Dark and Light mode
- Log in/Sign up
- Responsive mobile UI
- Local data storage
- Clean and modern design with Ionic components
- Touch gestures for navigation

## Built With
<img src="https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white" />
<img src="https://img.shields.io/badge/Vue%20js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" />
<img src="https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=Capacitor&logoColor=white" />

## Getting Started

### Requirements

To execute this project be sure to install node.js on its latest [version](https://nodejs.org/es)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Angelmmc/blog-app-ionic
```
2. Navigate to the project folder
```bash
cd blog-app-ionic
```
3. Install dependencies
```bash
npm install
```
4. Run the app
```bash
ionic serve
```

### Usage

- To log in the app use the mail `example@hotmail.com` and the password `123456`
- Note that tapping on a blog or profile redirects to a static route because there is no proper back-end implemented.

### Compilation for Android

If you want to build the app as an APK file, be sure to meet the following requisites:

- Install Android Studio and the SDK platform according to your Android version (I used Android 15 API 35).
- On Windows, create a system variable called `ANDROID_HOME` and set it to your installation path, e.g., `C:\Users\angelmmc\AppData\Local\Android\Sdk`.
- Install the Java SDK (I used the latest release, Java SDK 21).
- Like the Android SDK, create a system variable for Java called `JAVA_HOME` with a value like `C:\Program Files\Java\jdk-21`.

Once you’ve installed the previous components and ensured the app runs correctly with `ionic serve`, follow these steps:

1. Add the Android platform (you just need to do this the first time)

```bash
ionic capacitor add android
```

2. Build the app
```bash
ionic build
```

3. Sync Android with Capacitor
```bash
ionic capacitor sync android
```

4. Move to the android folder
```bash
cd android
```

5. Assemble the app using gradlew
```bash
./gradlew assembleDebug
```

After correctly executing these commands, your APK file should be located at:

`blog-app-ionic\android\app\build\outputs\apk\debug\blog_app.apk`

## 📄 License
This project is under the MIT license. Check the LICENSE file for more details.

Thanks to Dr. Pepper for keeping me hydrated during the development of this project.
Made by Angelmmc 
