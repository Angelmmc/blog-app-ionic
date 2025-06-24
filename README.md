# Blogtris

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Angelmmc/blog-app-ionic.svg)](https://github.com/Angelmmc/blog-app-ionic/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/Angelmmc/blog-app-ionic.svg)](https://github.com/Angelmmc/blog-app-ionic/issues)

This repository contains an offline version of the blog mobile application developed during my internship.  
Built with the **Ionic Vue** framework, It includes all core features and works offline using simulated data, intended for demonstration purposes only.

## 🚀 Features

- Main views such as home, profile, blog, community and saved
- Options menu when opening a blog
- Dark and Light mode
- Log in/Sign up
- Responsive mobile UI
- Local data storage
- Clean and modern design with Ionic components
- Touch gestures for navigation

## 🛠️ Previous Requirements

To execute this project be sure to install node.js on its latest [version](https://nodejs.org/es)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Angelmmc/blog-app-ionic
cd blog-app-ionic

# Install dependencies
npm install

# Run the app
ionic serve

```

## 👨‍💻 Usage

-To log in the app use the mail `example@hotmail.com` and the password `123456`
-Note that tapping on a blog or profile redirects to a static route because there is no proper back-end implemented.

## 📦 Compilation for Android

If you want to build the app as an APK file, be sure to meet the following requisites:

- Install Android Studio and the SDK platform according to your Android version (I used Android 15 API 35).
- On Windows, create a system variable called `ANDROID_HOME` and set it to your installation path, e.g., `C:\Users\angelmmc\AppData\Local\Android\Sdk`.
- Install the Java SDK (I used the latest release, Java SDK 21).
- Like the Android SDK, create a system variable for Java called `JAVA_HOME` with a value like `C:\Program Files\Java\jdk-21`.

Once you’ve installed the previous components and ensured the app runs correctly with `ionic serve`, follow these steps:

```bash
# Add the Android platform (you just need to do this the first time)
ionic capacitor add android

# Build the app
ionic build

# Sync Android with Capacitor
ionic capacitor sync android

# Move to the android folder
cd android

# Assemble the app using gradlew
./gradlew assembleDebug
```

After correctly executing these commands, your APK file should be located at:

`blog-app-ionic\android\app\build\outputs\apk\debug\blog_app.apk`

## 📄 License
This project is under the MIT license. Check the LICENSE file for more details.

Thanks to Dr. Pepper for keeping me hydrated during the development of this project.
Made by Angelmmc 
