# 此例子为了使新手少走弯路，ios/android 均测试通过，具体api还请参考官方的 https://github.com/zo0r/react-native-push-notification

# ios 集成步骤
yarn add react-native-push-notification
按照官网里的增加配置,以下只针对0.69版本的配置
增加AppDelegate
最后，要启用对 App Delegate 的支持和事件，您需要扩充 AppDelegate.notificationregister

### 一、更新AppDelegate.h
在文件顶部：
```
#import <UserNotifications/UNUserNotificationCenter.h>
```
然后，将“UNUser通知中心委派”添加到协议中：
```
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>
```
### 二、更新或AppDelegate.mAppDelegate.mm
在文件顶部：
```
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
```
然后，在应用程序委托实施中，添加以下内容：
```
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
  {
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  }
  // Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
  fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
  {
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
  }
  // Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
  {
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
  }
  // Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
  didReceiveNotificationResponse:(UNNotificationResponse *)response
  withCompletionHandler:(void (^)(void))completionHandler
  {
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
  }
  ```
  然后添加以下行：
```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
  {
  ...
  // Define UNUserNotificationCenter
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  return YES;
  }

//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}
```
以上代码已经在本例子中添加完成

### 三、xcode 必须开启通知
```
    Capabilities ---> Push Notification --- ON
```
![xcode_push.png](readmeImg%2Fxcode_push.png)

# android 集成步骤! 
查看例子中 rnpush start 注释的内容

    android/build.gradle
    ext {
        googlePlayServicesVersion = "<Your play services version>" // default: "+"
        firebaseMessagingVersion = "<Your Firebase version>" // default: "21.1.0"
        // Other settings
        compileSdkVersion = <Your compile SDK version> // default: 23
        buildToolsVersion = "<Your build tools version>" // default: "23.0.1"
        targetSdkVersion = <Your target SDK version> // default: 23
        supportLibVersion = "<Your support lib version>" // default: 23.1.1
    }

注意：localNotification（） 无需更改应用程序部分，而 localNotificationSchedule（） 仅适用于以下更改：
    在你的android/app/src/main/AndroidManifest.xml 加入通知权限
```
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
```
    
将值更改为true，以便在接收远程通知时启用前台弹出窗口（为了防止在显示本地通知时重复，请将此设置为false）
```
    <meta-data
    android:name="com.dieam.reactnativepushnotification.notification_foreground"
    android:value="false" /> <!-- 将资源名称更改为应用程序的重音颜色-或您想要的任何其他颜色 -->
    <meta-data
    android:name="com.dieam.reactnativepushnotification.notification_color"
    android:resource="@color/white" /> <!-- or @android:color/{name} to use a standard color -->
    <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationActions" />
    <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationPublisher" />
    <receiver
    android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationBootEventReceiver"
    android:exported="true" >
    <intent-filter>
    <action android:name="android.intent.action.BOOT_COMPLETED" />
    <action android:name="android.intent.action.QUICKBOOT_POWERON" />
    <action android:name="com.htc.intent.action.QUICKBOOT_POWERON" />
    </intent-filter>
    </receiver> 
```

如果不对项目使用内置的 Android 颜色 （）。 在（如果文件不存在，则创建该文件）。@android:color/{name}notification_colormeta-dataandroid/app/src/main/res/values/colors.xml
```
<resources>
    <color name="white">#FFF</color>
</resources>
```
主要Android 手机要打开应用的通知权限
