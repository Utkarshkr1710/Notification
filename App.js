import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, BackHandler, ToastAndroid, StatusBar } from 'react-native';
import firebase from 'react-native-firebase';
import type, { Notification, NotificationOpen } from 'react-native-firebase';
// Your Other import lines as per your use case
 
export default class App extends Component {
    subscribeToNotificationListeners() {
        const channel = new firebase.notifications.Android.Channel(
            'notification_channel_name', // To be Replaced as per use
            'Notifications', // To be Replaced as per use
            firebase.notifications.Android.Importance.Max
        ).setDescription('A Channel To manage the notifications related to Application');
        firebase.notifications().android.createChannel(channel);
        
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            console.log('onNotification notification-->', notification);
            console.log('onNotification notification.data -->', notification.data);
            console.log('onNotification notification.notification -->', notification.notification);
            // Process your notification as required
            this.displayNotification(notification)
        });
    }
 
    displayNotification = (notification) => {
        if (Platform.OS === 'android') {
            const localNotification = new firebase.notifications.Notification({
                sound: 'default',
                show_in_foreground: true,
            }).setNotificationId(notification.notificationId)
                .setTitle(notification.title)
                .setSubtitle(notification.subtitle)
                .setBody(notification.body)
                .setData(notification.data)
                .android.setChannelId('notification_channel_name') // e.g. the id you chose above
                .android.setSmallIcon('ic_notification_icon') // create this icon in Android Studio
                .android.setColor(colors.colorAccent) // you can set a color here
                .android.setPriority(firebase.notifications.Android.Priority.High);
 
            firebase.notifications()
                .displayNotification(localNotification)
                .catch(err => console.error(err));
 
        }
    }
 
    componentDidMount() {
        firebase.messaging().hasPermission().then(hasPermission => {
            if (hasPermission) {
                this.subscribeToNotificationListeners()
            } else {
                firebase.messaging().requestPermission().then(() => {
                    this.subscribeToNotificationListeners()
                }).catch(error => {
                    console.error(error);
 
                })
            }
        })
    }
 
    componentWillUnmount() {
        this.notificationListener();
    }
 
 
/* Change return block below as per Your Application Logic */
    render() {
        return (
            <View>
                
            </View>
        );
    }
}
 
 


// import React, { Component } from "react";

// import { FCM} from "react-native-fcm";

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//   }

//   componentDidMount() {
    
//     // this method generate fcm token.
//     // FCM.requestPermissions();
//     FCM.getFCMToken().then(token => {
//       console.warn("TOKEN (getFCMToken)", token);
//     });
    
//     // This method get all notification from server side.
//     FCM.getInitialNotification().then(notif => {
//       console.warn("INITIAL NOTIFICATION", notif)
//     });
    
//     // This method give received notifications to mobile to display.
//     this.notificationUnsubscribe = FCM.on("notification", notif => {
//       console.warn("a", notif);
//       if (notif && notif.local_notification) {
//         return;
//       }
//       this.sendRemote(notif);
//     });
    
//     // this method call when FCM token is update(FCM token update any time so will get updated token from this method)
//     this.refreshUnsubscribe = FCM.on("refreshToken", token => {
//       console.warn("TOKEN (refreshUnsubscribe)", token);
//       this.props.onChangeToken(token);
//     });
//   }
  
//   // This method display the notification on mobile screen.
//   sendRemote(notif) {
//     console.warn('send');
//     FCM.presentLocalNotification({
//       title: notif.title,
//       body: notif.body,
//       priority: "high",
//       click_action: notif.click_action,
//       show_in_foreground: true,
//       local: true
//     });
//   }

//   componentWillUnmount() {
//     this.refreshUnsubscribe();
//     this.notificationUnsubscribe();
//   }
//   render() {
//     return null;
//   }
// }