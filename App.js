import React from 'react';
import { Text, TextInput, View, Button, StatusBar,Alert , Dimensions,Platform,TouchableOpacity, PermissionsAndroid,ScrollView,StyleSheet,PixelRatio } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PlayScreen from './PlayScreen';
import PushScreen from './PushScreen';
import { NodeMediaClient } from 'react-native-nodemediaclient';
import CheckBox from 'react-native-check-box';
import  {} from './Axiosconfig';
import axios from 'axios';
//import {BASE_URL} from './config';

//import {Login} from './Login';

const{width, height} = Dimensions.get('window'); 
var global;

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
      {
        title: "Cool Photo App Camera And Microphone Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

const RTMP_SERVER='192.168.1.17';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    global=this;
    this.props = props;
	  this.state = {
      playserver: "rtmp://"+RTMP_SERVER+"/rtmplive/",
      pushserver: "rtmp://"+RTMP_SERVER+"/rtmplive/",
      stream: 'demo_123' ,//+ (Math.floor(Math.random() * (999 - 100)) + 100),
      username: '',
      password: '',
      token: '',
      isguest:false,
    };
    
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      requestCameraPermission()
      NodeMediaClient.setLicense("ZjJhNTIzODAtNGU0ZDUzMjEtY24ubm9kZW1lZGlhLmlTaG93Uk4=-syY8+2t7utLZAKLDs1SaD0EOPC9ft3Zq2SncV7gvMg1vnuEGf6QYMDpiSWj0A7xLhbn62BJHJvi1sGLPKgRflHnT6ysuUfQM7W8fgMA75gbqSCMu4vVqssX+yWCeEIbb5uJ/WHYjSvjSOa0W69TwHB5OSxf0bgAMFo8oJjiSCG16CKRuCHeNQBF8KRh+PYuRDnd3pBmnvE8QyWMDpvtEJd1fSYrGLdwgeO8F4gBKoeXyk2/rpEHKDmm/MKAlHli0/mpz8ejlL6ifAw6rB0TqXfpUMuo6vXpx0bjV7G5wxnOMB5pubn91UWrpRoUhPjadOFiket1DmqPsZFiQGnv0iA==");
    }else if(Platform.OS === 'ios') {
      NodeMediaClient.setLicense("ZjJhNTIzODAtNGU0ZDUzMjEtY24ubm9kZW1lZGlhLmlTaG93Uk4=-CQ2OZOwxN8PmjPnqCO5jINgwytHewwXJgZ4OhYL0Hnh6TDjQJDL/ebvCV34cuN/LPn42+vEbKxVAhqv492V3RmNu2aPKL6+AlYtPNf1eWkFLYa9Q/5GwU22s98fKA6YB5IMQyG30VptasVRctQeIee/lhmGClkvo9Ib+C8rLai6HHzWst/WpfWJeJs9OYgosNcuS+VmydGAy/CkUkT4G2ew80q239GRSJ7g7KREcwgiPrGqPNiDFqtG1T08JD9SXELerQqIp71qaPRMjCDSk26L0Tg22z4/EKcp713bZGs2AnE3ye3RbsLdMfNNUU0j0Qc/PQFNpczkilbHwMDoRaA==");
    }
  }

  onPressLogin() {
     const {navigation} = this.props;
     if (navigation) {
        //this.props.navigation.navigate('Push', { 'pushserver': this.state.pushserver, 'stream': this.state.stream });
        this.login();
     }  
  }

  login(){
   // var userparam=JSON.stringify({username:this.state.username,password:this.state.password,isguest:this.state.isguest});
    //console.log('userparam:',userparam);
    axios.post('/login', {
      username: this.state.username,
      password: this.state.password,
      isguest:this.state.isguest,
    })
    .then(function (response) {
      console.log(response);
      if (response.data.success=='ok'){
         console.log('token:', response.data.datas.token);
         if (!global.state.isguest) //is guest
            global.props.navigation.navigate('Push', { 'pushserver': global.state.pushserver, 'stream': global.state.stream,'token': response.data.datas.token });
         else
            global.props.navigation.navigate('Play', { 'playserver': global.state.playserver, 'stream': global.state.stream });
      }
      else{
         console.log('登陆失败');
         Alert.alert('提示','登陆失败');
      }
      
    })
    .catch(function (error) {
       //错误处理
       console.log('err:',error);
       Alert.alert('提示','网络连接失败');
    });
      
     
  }

  render() {
    const { actions, state, navigation } = this.props;
    return (
        <ScrollView 
            contentContainerStyle={{ flex: 1 }} // 非常重要，让ScrollView的子元素占满整个区域
            keyboardDismissMode="on-drag" // 拖动界面输入法退出
            keyboardShouldPersistTaps={"never"} // 点击输入法以外的区域，输入法退出 不加这两句也可以实现点击空白处收回键盘
            scrollEnabled={false} // 当值为false的时候，内容不能滚动，默认值为true
        >
         <View style={styles.container}>
            <View style={styles.containers}>
                <Text style={styles.textStyle}>登录页面</Text>
            </View>
            <View style={{height:height/10}}></View>
            <View style={styles.inputView}>
                <View style={[styles.view, styles.lineTopBottom]}>
                  <Text style={styles.text}>手机号:</Text>
                  <TextInput
                    style={styles.textInputStyle}
                    placeholder="请输入您的手机号码"
                    clearButtonMode="while-editing"
                    secureTextEntry={false}
                    onChangeText={(text) => {
                      this.setState({
                        username: text
                      });
                    }}
                    value={this.state.username}
                  />
                </View>
                <View style={[styles.view, styles.lineTopBottom]}>
                    <Text style={styles.text}>密码:</Text>
                    <TextInput
                        style={styles.textInputStyle}
                        placeholder="请输入密码"
                        clearButtonMode="while-editing"
                        secureTextEntry
                        onChangeText={(text) => {
                            this.setState({
                                password: text
                            });
                        }}
                        value={this.state.password}
                    />
                    
                </View>
                <View style={[styles.view, styles.lineTopBottom]}>
                   <CheckBox
                        style={{flex: 1, padding: 5}}
                        onClick={()=>{
                          this.setState({
                            isguest:!this.state.isguest
                          })
                        }}
                        isChecked={this.state.isguest}
                        leftText={"游客"}
                    />
                </View>

          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onPressLogin()}
            >
              <Text style={styles.buttonText}>登 录</Text>
            </TouchableOpacity>
          </View>
         </View>
        </ScrollView>
    );

  }
}

const Stack = createStackNavigator();

function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        headerMode="none"
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'liveshow' }}
        />
        <Stack.Screen
          name="Play"
          component={PlayScreen}
        />
        <Stack.Screen
          name="Push"
          component={PushScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  textStyle:{
      fontSize:36,
      textAlign:'center',   
      backgroundColor:'#FFFFFF',
      color:'#1874CD'
  },   
  containers:{
      height:height/4,
      justifyContent: 'flex-end',
      alignItems:'center',
      backgroundColor:'#FFFFFF'
  },
  container: {
      flex: 1,
      justifyContent: 'center',
  },
  buttonView: {

      alignItems:'center',
      flex: 3
  },
  inputView: {
      padding: 5,
      backgroundColor: '#fff',
      alignItems:'center',
      justifyContent: 'center',
  },
  /*
lineBottom: {
      borderBottomWidth: 5 / PixelRatio.get(),
      borderColor: 'rgb(208,208,208)'
   },*/
  button: {
      marginTop: 30,
      width:width*0.8,
      height: 44,
      borderRadius: 10,
      backgroundColor: '#1874CD',
      justifyContent: 'center',
      alignItems:'center'
  },
  buttonText: {
      fontSize: 22,
      textAlign: 'center',
      color: 'white',

  },
  text: {
      lineHeight: 44,
      fontSize: 14,
  },
  texts: {
      lineHeight: 44,
      fontSize: 16,
      color:'#1874CD'
  },
  view: {
      flexDirection: 'row',
      height: 44,
      width:width*0.8
  },
  textInputStyle: {
      flex: 5,
      marginRight: 10,
      marginLeft:20,
      fontSize: 16,
      marginTop: 4,
      
  },
  lineTopBottom: {
      borderBottomWidth: 3 / PixelRatio.get(),
      borderColor: 'rgb(208,208,208)',
  },
  centering: {
      alignItems: 'center',
      justifyContent: 'center'
  }
})

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
