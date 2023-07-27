import React, {Component, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

 const IPush = () => {
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const type = 'notification';
    PushNotificationIOS.addEventListener(type, onRemoteNotification);
    return () => {
      PushNotificationIOS.removeEventListener(type);
    };
  });

  const onRemoteNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
      // Navigate user to another screen
    } else {
      // Do something else with push notification
    }
    // Use the appropriate result based on what you needed to do for this notification
    const result = PushNotificationIOS.FetchResult.NoData;
    notification.finish(result);
  };
};

 export default IPush;
