#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
// push start
#import <UserNotifications/UNUserNotificationCenter.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>
//push end

@property (nonatomic, strong) UIWindow *window;

@end
