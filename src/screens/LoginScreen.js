import React from 'react';
import {Text, TextInput, View, Alert, ActivityIndicator} from 'react-native';
import Button from 'react-native-button';
import {AppStyles} from '../AppStyles';
import firebase from 'react-native-firebase';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import {AsyncStorage} from 'react-native';
import styles from './styles/loginStyles';
const FBSDK = require('react-native-fbsdk');
const {LoginManager, AccessToken} = FBSDK;

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: '',
    };
    GoogleSignin.configure({
      webClientId: 'your google client id here .apps.googleusercontent.com',
    });
  }

  onPressLogin = () => {
    const {email, password} = this.state;
    if (email.length <= 0 || password.length <= 0) {
      alert('Please fill out the required fields.');
      return;
    }
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        const {navigation} = this.props;
        user_uid = response.user._user.uid;
        firebase
          .firestore()
          .collection('users')
          .doc(user_uid)
          .get()
          .then(function(user) {
            if (user.exists) {
              AsyncStorage.setItem('@loggedInUserID:id', user_uid);
              AsyncStorage.setItem('@loggedInUserID:key', email);
              AsyncStorage.setItem('@loggedInUserID:password', password);
              navigation.dispatch({type: 'Login', user: user});
            } else {
              alert('User does not exist. Please try again.');
            }
          })
          .catch(function(error) {
            const {code, message} = error;
            alert(message);
          });
      })
      .catch(error => {
        const {code, message} = error;
        alert(message);
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
      });
  };

  onPressFacebook = () => {
    LoginManager.logInWithPermissions([
      'public_profile',
      'user_friends',
      'email',
    ]).then(
      result => {
        if (result.isCancelled) {
          alert('Whoops!', 'You cancelled the sign in.');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const credential = firebase.auth.FacebookAuthProvider.credential(
              data.accessToken,
            );
            const accessToken = data.accessToken;
            firebase
              .auth()
              .signInWithCredential(credential)
              .then(result => {
                var user = result.user;
                AsyncStorage.setItem(
                  '@loggedInUserID:facebookCredentialAccessToken',
                  accessToken,
                );
                AsyncStorage.setItem('@loggedInUserID:id', user.uid);
                var userDict = {
                  id: user.uid,
                  fullname: user.displayName,
                  email: user.email,
                  profileURL: user.photoURL,
                };
                var data = {
                  ...userDict,
                  appIdentifier: 'rn-android-universal-listings',
                };
                firebase
                  .firestore()
                  .collection('users')
                  .doc(user.uid)
                  .set(data);
                this.props.navigation.dispatch({
                  type: 'Login',
                  user: userDict,
                });
              })
              .catch(error => {
                alert('Please try again! ' + error);
              });
          });
        }
      },
      error => {
        Alert.alert('Sign in error', error);
      },
    );
  };

  onPressGoogle = () => {
    this.setState({loading: true});
    GoogleSignin.signIn()
      .then(data => {
        console.log('data', data);
        // Create a new Firebase credential with the token
        const credential = firebase.auth.GoogleAuthProvider.credential(
          data.idToken,
        );
        // Login with the credential
        const accessToken = data.idToken;
        AsyncStorage.setItem(
          '@loggedInUserID:googleCredentialAccessToken',
          accessToken,
        );
        return firebase.auth().signInWithCredential(credential);
      })
      .then(result => {
        this.setState({loading: false});
        var user = result.user;
        AsyncStorage.setItem('@loggedInUserID:id', user.uid);
        var userDict = {
          id: user.uid,
          fullname: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        var data = {
          ...userDict,
          appIdentifier: 'rn-android-universal-listings',
        };
        console.log('data', data);
        firebase
          .firestore()
          .collection('users')
          .doc(user.uid)
          .set(data);
        this.props.navigation.dispatch({
          type: 'Login',
          user: userDict,
        });
      })
      .catch(error => {
        const {code, message} = error;
        this.setState({loading: false}, () => {
          alert(error);
        });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, styles.leftTitle]}>Sign In</Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="E-mail or phone number"
            onChangeText={text => this.setState({email: text})}
            value={this.state.email}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={text => this.setState({password: text})}
            value={this.state.password}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <Button
          containerStyle={styles.loginContainer}
          style={styles.loginText}
          onPress={() => this.onPressLogin()}>
          Log in
        </Button>
        <Text style={styles.or}>OR</Text>
        <Button
          containerStyle={styles.facebookContainer}
          style={styles.facebookText}
          onPress={() => this.onPressFacebook()}>
          Login with Facebook
        </Button>
        {this.state.loading ? (
          <ActivityIndicator
            style={{marginTop: 30}}
            size="large"
            animating={this.state.loading}
            color={AppStyles.color.tint}
          />
        ) : (
          <GoogleSigninButton
            style={styles.googleContainer}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={this.onPressGoogle}
          />
        )}
      </View>
    );
  }
}

export default LoginScreen;
