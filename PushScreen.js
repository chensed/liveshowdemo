import React from 'react';
import { Text, TextInput, View, Button, StatusBar, StyleSheet,Alert } from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
var  global=null;

class PushScreen extends React.Component {
  static navigationOptions = {
    title: 'Push',
  };

  constructor(props) {
    super(props);
    this.state = { 'flashenable': false,roomno:0,publishstatus:0};//stop publish
    global=this;
    this.createroom();
  }

  createroom(){
     console.log('create room');
     axios.post('/createroom', {}, {
      headers: {
        'token':this.props.route.params.token
      }
    })
	.then(function (response) {
       console.log('resp data:',response.data);
       if (response.data.success=='ok'){
         //global.state.roomno=response.data.datas;
         global.setState({roomno:response.data.datas});
         console.log('roomno:',global.state.roomno);
         if (global.state.roomno==-1){
            console.log('createroom failed');
            Alert.alert('提示','创建房间失败');    
         }
       }
	})
	.catch(function (error) {
       //错误处理
       console.log('err:',error);
       Alert.alert('提示','网络连接失败');
    });
  }

  sendpublishstatus(status){
    console.log('sendpublishstatus');
    axios.post('/sendpublishstatus', {roomno:this.state.roomno,status:status}, {
     headers: {
       'token':this.props.route.params.token
     }
   })
  .then(function (response) {
        console.log('resp data:',response.data);
        if (response.data.success=='ok'){
           console.log('send status ok');
        }
  })
  .catch(function (error) {
        //错误处理
        console.log('err:',error);
        Alert.alert('提示','网络连接失败');
    });
  }

  changepubmode(){
    if (this.state.roomno==-1)
       return ;

    var status=0;
    if (this.state.publishstatus==0){
      status=1;
      this.setState({publishstatus:status}); //start publish
      this.vb.start();
    }
    else{
      this.setState({publishstatus:status}); //stop publish
      this.vb.stop();
    }

    this.sendpublishstatus(status);
  }

  render() {

    var publishtitle='';
    if (this.state.publishstatus==0)
       publishtitle='Publish'
    else
       publishtitle='Stop'

    return (
      <View style={{ flex: 1, backgroundColor: '#333' }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#6a51ae"
        />
        <NodeCameraView
          style={{ flex: 1 }}
          ref={(vb) => { this.vb = vb }}
          outputUrl={this.props.route.params.pushserver + this.props.route.params.stream+'?roomno='+this.state.roomno+'&token='+this.props.route.params.token}
          camera={{ cameraId: 1, cameraFrontMirror: true }}
          audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
          video={{ preset: 1, bitrate: 500000, profile: 1, fps: 15, videoFrontMirror: false }}
          smoothSkinLevel={3}
          autopreview={true}
          onStatus={(code, msg) => {
            console.log("onStatus=" + code + " msg=" + msg);
          }}
        />
        <ActionButton
          buttonColor="#1abc9c"
          offsetY={32}
          offsetX={16}
          size={32}
          hideShadow={true}
          verticalOrientation='down'

        >
          <ActionButton.Item buttonColor='#9b59b6' title="Reverse Camera" onPress={() => {
            this.vb.switchCamera();
            this.state.flashenable = false;
          }}>
            <Icon name="ios-reverse-camera-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Switch Flashlight" onPress={() => {
            this.state.flashenable = !this.state.flashenable;
            this.vb.flashEnable(this.state.flashenable);
          }}>
            <Icon name="ios-bulb-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#e6ce28' title={publishtitle} onPress={() => { this.changepubmode()}}>
            <Icon name="ios-paper-plane-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#e74c3c' title="Close" onPress={() => { this.props.navigation.goBack() }}>
            <Icon name="ios-power-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View >
    );
  }

  componentWillUnmount() {
    this.vb.stop();
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default PushScreen;
