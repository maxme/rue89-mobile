## What ?

This is a Rue89 reader. Rue89 is a french website: http://www.rue89.com
Based on html5 and jquery-mobile and wrapped with cordova ios and cordova android. Should also work on other Cordova supported devices (Balckberry, Windows phone 8, ...)

## Build
### iOS:

    $ ios/cordova/build

### Android

    $ android/cordova/build

## Run
### iOS

    $ ios/cordova/emulate # run in iOS simulator

### Android

    $ android/cordova/run # run in Android emulator

## Install
### iOS
Run XCode and open project ios/rue89.xcodeproj, then build and run for device.

### Android

    $ adb install android/bin/rue89-debug.apk

