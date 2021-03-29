import * as Notifications from 'expo-notifications';
import * as firebase from 'firebase';


export const Notif = async() => {
    // check permission
    const {status} = await Notifications.getPermissionsAsync()
    finalStatus = status;

    // ask permission
    if (status !== 'granted') {
        const {status }= await Notifications.requestPermissionsAsync()
        finalStatus = status
    }

    // no permissions
    if (finalStatus !== 'granted') {return;}

    // Get notif token
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token)

    // add token to firebase
    let uid = firebase.auth().currentUser.uid;
    firebase.database().ref('users').child(uid).update({
        expoPushToken: token
    })
}
