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
## 📦 Compilation for Android 

if you want to build the app as an apk file be sure to meet the following requisites 

-Install android studio and the SDK platform according to your android version (I used android 15 API 35)
-On Windows, create a system variable called "ANDROID_HOME" and use the path of your instalation as the value like  `C:\Users\angelmmc\AppData\Local\Android\Sdk`
-Install the Java SDK, i used the latest release of the 21 SDK 
-Like the android SDK, create a system variable for java called "JAVA_HOME" with a value like this  `C:\Program Files\Java\jdk-21`

Once you´ve installed the previous componentes and make sure the app runs correctly with ionic serve

```bash
# Add the android platform (you just need to do the first time)
ionic capacitor add android

# Build the app
ionic build

# Sync Android with capacitor
ionic capacitor sync android

#Move to the android folder
cd android

#Assamble the app using gradlew
./gradlew assembleDebug

```

After correcly executing the codes, your apk file should be in the next route `blog-app-ionic\android\app\build\outputs\apk\debug\blog_app.apk`

> **Note:** I did not have the necessary hardware to build the app on iOS and therefore there is only an android tutorial.

## 📄 License
This project is under the MIT license, check the LICENSE file for more details.

Made by Ángel Medina 

