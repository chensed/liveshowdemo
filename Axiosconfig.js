import axios from 'axios';

axios.defaults.baseURL = "http://192.168.1.4:8005/liveshow/";
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json'; //application/x-www-form-urlencoded
axios.defaults.timeout=2000;

