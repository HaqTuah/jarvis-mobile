import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Linking, Alert, AppState, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const SERVER_URL = 'https://jarvis-server-production-692e.up.railway.app';

const APP_SCHEMES = {
  phone:'tel:', messages:'sms:', mail:'mailto:', maps:'maps:', music:'music:',
  photos:'photos-redirect:', camera:'camera:', settings:'app-settings:',
  youtube:'youtube:', spotify:'spotify:', twitter:'twitter:', instagram:'instagram:',
  facebook:'fb:', whatsapp:'whatsapp:', telegram:'tg:', linkedin:'linkedin:',
  netflix:'nflx:', gmail:'googlegmail:', outlook:'ms-outlook:', teams:'msteams:',
  zoom:'zoommtg:', calendar:'calshow:', notes:'mobilenotes:',
};

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef(null);
  const bgTaskRef = useRef(null);
  const [authToken, setAuthToken] = useState(null);

  // Get or create auth token (XLIX-style encrypted connection)
  useEffect(() => {
    (async () => {
      try {
        let token = await SecureStore.getItemAsync('jarvis_token');
        if (!token) {
          const res = await fetch(SERVER_URL + '/api/auth', { method: 'POST' });
          const data = await res.json();
          token = data.token;
          await SecureStore.setItemAsync('jarvis_token', token);
        }
        setAuthToken(token);
      } catch (_) { }
    })();
  }, []);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
  });

  // XLIX: File upload from phone
  const pickAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
      if (result.canceled || !result.assets?.[0]) return;
      const file = result.assets[0];
      const formData = new FormData();
      formData.append('file', { uri: file.uri, name: file.name, type: file.mimeType } as any);
      formData.append('name', file.name);
      const res = await fetch(SERVER_URL + '/api/upload', {
        method: 'POST',
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'uploaded') {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: `📁 Sent ${file.name} to your PC`, timestamp: Date.now() }]);
      }
    } catch (_) { }
  };

  // XLIX: Camera capture
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permission needed', 'Camera access required'); return; }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.7, base64: true });
      if (result.canceled) return;
      const photo = result.assets[0];
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: '📸 Photo captured', timestamp: Date.now(), image: photo.uri }]);
      handleSend('I just took a photo. Can you help me analyze what you see?');
    } catch (_) { }
  };

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
    checkConnection();
    registerPush();
    bgTaskRef.current = setInterval(() => fetch(SERVER_URL+'/api').catch(()=>{}), 60000);
    const sub = AppState.addEventListener('change', s => { if (s === 'active') checkConnection(); });
    return () => { Speech.stop(); clearInterval(bgTaskRef.current); sub.remove(); };
  }, []);

  const registerPush = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;
      const token = await Notifications.getExpoPushTokenAsync();
      await fetch(SERVER_URL+'/api/register-push', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({token:token.data,platform:'ios'}) }).catch(()=>{});
    } catch(_) {}
  };

  const checkConnection = async () => {
    try {
      const res = await fetch(SERVER_URL+'/api');
      const data = await res.json();
      if (data.status === 'ok') { setIsConnected(true); loadHistory(); }
    } catch(_) { setIsConnected(false); }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch(SERVER_URL+'/history?count=30');
      const data = await res.json();
      if (data.history?.length > 0) setMessages(data.history.map((e,i) => ({id:e.key||i.toString(),role:e.role||'user',text:e.content||e.message||'',timestamp:e.timestamp||Date.now()})));
      else welcomeMsg();
    } catch(_) { welcomeMsg(); }
  };

  const welcomeMsg = () => setMessages([{id:'welcome',role:'assistant',text:"Hello! I'm Jarvis, your AI assistant. I can search the web, open apps, send messages, and answer questions.",timestamp:Date.now()}]);

  const toolAction = async (name, args) => {
    const app = (args?.app||args?.app_name||'').toLowerCase();
    if (name === 'launch_app' || name === 'open_app') {
      const scheme = APP_SCHEMES[app];
      if (scheme !== undefined) await Linking.openURL(scheme+(args?.action||'')).catch(()=>Alert.alert('Not Found',`${app} not installed.`));
    }
    if (name === 'send_message') {
      const to = args?.to||args?.receiver;
      const msg = args?.message||args?.message_text;
      if (to && msg) await Linking.openURL(`sms:${to}?body=${encodeURIComponent(msg)}`).catch(()=>{});
    }
  };

  const handleSend = async (text = inputText) => {
    if (!text.trim() || !isConnected || isProcessing) return;
    setMessages(prev => [...prev, {id:Date.now().toString(),role:'user',text:text.trim(),timestamp:Date.now()}]);
    setInputText(''); setIsProcessing(true);
    try {
      let location = null;
      try { const {status} = await Location.requestForegroundPermissionsAsync(); if (status==='granted') { const loc = await Location.getCurrentPositionAsync({}); location = {lat:loc.coords.latitude,lng:loc.coords.longitude}; } } catch(_) {}
      const res = await fetch(SERVER_URL+'/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message:text.trim(),location,platform:'ios'}) });
      const data = await res.json();
      if (data.response) {
        speak(data.response);
        if (data.toolAction) await toolAction(data.toolAction.name, data.toolAction.args);
        setMessages(prev => [...prev, {id:(Date.now()+1).toString(),role:'assistant',text:data.response,timestamp:data.timestamp||Date.now(),emotion:data.emotion}]);
      }
    } catch(error) { setMessages(prev => [...prev, {id:(Date.now()+1).toString(),role:'assistant',text:`Error: ${error.message}`,timestamp:Date.now(),emotion:'error'}]); }
    setIsProcessing(false);
  };

  const speak = async (text) => {
    const voices = await Speech.getAvailableVoicesAsync();
    // Match PC Jarvis: deep, calm voice - prefer Samantha or any Enhanced English
    const en = voices.find(v => v.language.startsWith('en') && v.name.includes('Samantha'))
      || voices.find(v => v.language.startsWith('en') && v.quality === 'Enhanced')
      || voices.find(v => v.language.startsWith('en'));
    await Speech.speak(text, { rate: 0.82, pitch: 0.92, voice: en?.identifier });
  };

  const handleVoice = async () => {
    try {
      setIsListening(true); setIsRecording(true);
      if (await Speech.isSpeakingAsync()) await Speech.stop();
      // Opens the keyboard for voice typing - iOS native dictation
      Alert.alert('Voice Input', 'Tap the microphone on your keyboard and speak.', [
        { text: 'Cancel', style: 'cancel', onPress: () => { setIsListening(false); setIsRecording(false); } },
        { text: 'OK', onPress: () => { setIsRecording(false); setIsListening(false); } },
      ]);
    } catch (_) { setIsListening(false); setIsRecording(false); }
  };

  const launchApp = async name => {
    const scheme = APP_SCHEMES[name.toLowerCase()];
    if (scheme !== undefined) await Linking.openURL(scheme).catch(()=>Alert.alert('Not Found',`${name} not installed.`));
    else handleSend(`Open ${name}`);
  };

  const renderMsg = ({item}) => {
    const u = item.role === 'user';
    return (
      <View style={[s.row, u ? s.uRow : s.aRow]}>
        {!u && <View style={s.av}><Ionicons name="sparkles" size={14} color="#6c5ce7" /></View>}
        <View style={[s.bubble, u ? s.uBub : s.aBub]}>
          <Text style={[s.txt, u ? s.uTxt : s.aTxt]}>{item.text}</Text>
          <Text style={s.time}>{new Date(item.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</Text>
        </View>
      </View>
    );
  };

  const quickApps = [
    {n:'Phone',i:'call-outline',c:'#4cd137'},{n:'Messages',i:'chatbubbles-outline',c:'#00a8ff'},
    {n:'Mail',i:'mail-outline',c:'#fbc531'},{n:'Maps',i:'map-outline',c:'#4cd137'},
    {n:'Music',i:'musical-notes-outline',c:'#ff6b6b'},{n:'YouTube',i:'logo-youtube',c:'#ff4757'},
    {n:'WhatsApp',i:'logo-whatsapp',c:'#2ed573'},{n:'Spotify',i:'musical-note',c:'#1dd1a1'},
  ];

  return (
    <SafeAreaView style={s.c}>
      <View style={s.h}>
        <TouchableOpacity onPress={()=>router.back()} style={s.b}><Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.6)" /></TouchableOpacity>
        <View style={s.hi}><View style={[s.dot,{backgroundColor:isConnected?'#00e676':'#e74c3c'}]} /><View><Text style={s.hn}>Jarvis</Text><Text style={s.hs}>{isConnected?'Connected':'Offline'}</Text></View></View>
        <TouchableOpacity style={s.sb} onPress={()=>router.push('/settings')}><Ionicons name="settings-outline" size={20} color="rgba(255,255,255,0.5)" /></TouchableOpacity>
      </View>
      <FlatList ref={flatListRef} data={messages} renderItem={renderMsg} keyExtractor={i=>i.id} style={s.ml} contentContainerStyle={s.mlc} onContentSizeChange={()=>flatListRef.current?.scrollToEnd()} />
      {messages.length<=2&&<View style={s.qc}><Text style={s.ql}>Quick Launch</Text><View style={s.qg}>{quickApps.map(a=><TouchableOpacity key={a.n} style={s.qi} onPress={()=>launchApp(a.n)}><View style={[s.qic,{backgroundColor:a.c+'20'}]}><Ionicons name={a.i} size={20} color={a.c} /></View><Text style={s.qn}>{a.n}</Text></TouchableOpacity>)}</View></View>}
      {isProcessing&&<View style={s.pc}><ActivityIndicator size="small" color="#6c5ce7" /><Text style={s.pt}>Thinking...</Text></View>}
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} keyboardVerticalOffset={Platform.OS==='ios'?90:0}>
        <View style={s.ic}>
          <TouchableOpacity style={[s.vb,isListening&&s.vba]} onPress={handleVoice} disabled={isProcessing}><Ionicons name={isRecording?'mic':'mic-outline'} size={22} color={isRecording?'#fff':'rgba(255,255,255,0.6)'} /></TouchableOpacity>
          <TouchableOpacity style={s.att} onPress={pickAndUpload} disabled={isProcessing}><Ionicons name="attach" size={20} color="rgba(255,255,255,0.5)" /></TouchableOpacity>
          <TouchableOpacity style={s.att} onPress={takePhoto} disabled={isProcessing}><Ionicons name="camera-outline" size={20} color="rgba(255,255,255,0.5)" /></TouchableOpacity>
          <TextInput style={s.ti} value={inputText} onChangeText={setInputText} placeholder="Message Jarvis..." placeholderTextColor="rgba(255,255,255,0.3)" multiline maxLength={500} onSubmitEditing={()=>handleSend()} returnKeyType="send" />
          <TouchableOpacity style={[s.snd,!inputText.trim()&&s.sndd]} onPress={()=>handleSend()} disabled={!inputText.trim()||isProcessing}><Ionicons name="send" size={18} color={inputText.trim()?'#fff':'rgba(255,255,255,0.3)'} /></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#0a0a1a'},h:{flexDirection:'row',alignItems:'center',paddingHorizontal:12,paddingVertical:10,borderBottomWidth:1,borderBottomColor:'rgba(255,255,255,0.05)'},
  b:{width:36,height:36,borderRadius:18,backgroundColor:'rgba(255,255,255,0.05)',justifyContent:'center',alignItems:'center',marginRight:8},
  hi:{flexDirection:'row',alignItems:'center',gap:8,flex:1},dot:{width:8,height:8,borderRadius:4},
  hn:{fontSize:16,fontWeight:'600',color:'#fff'},hs:{fontSize:11,color:'rgba(255,255,255,0.4)'},
  sb:{width:36,height:36,justifyContent:'center',alignItems:'center'},
  ml:{flex:1},mlc:{padding:16,paddingBottom:8},
  row:{flexDirection:'row',marginBottom:16,alignItems:'flex-end'},uRow:{justifyContent:'flex-end'},aRow:{justifyContent:'flex-start'},
  av:{width:28,height:28,borderRadius:14,backgroundColor:'rgba(108,92,231,0.2)',justifyContent:'center',alignItems:'center',marginRight:8},
  bubble:{maxWidth:'80%',padding:12,borderRadius:16},uBub:{backgroundColor:'#6c5ce7',borderBottomRightRadius:4},aBub:{backgroundColor:'rgba(255,255,255,0.06)',borderBottomLeftRadius:4},
  txt:{fontSize:15,lineHeight:21},uTxt:{color:'#fff'},aTxt:{color:'rgba(255,255,255,0.9)'},
  time:{fontSize:10,color:'rgba(255,255,255,0.3)',marginTop:4,alignSelf:'flex-end'},
  qc:{paddingHorizontal:16,paddingVertical:8},ql:{fontSize:12,color:'rgba(255,255,255,0.3)',marginBottom:8,textTransform:'uppercase',letterSpacing:1},
  qg:{flexDirection:'row',flexWrap:'wrap',gap:8},qi:{alignItems:'center',width:'23%',marginBottom:8},
  qic:{width:44,height:44,borderRadius:12,justifyContent:'center',alignItems:'center'},qn:{fontSize:11,color:'rgba(255,255,255,0.5)',marginTop:4},
  pc:{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingVertical:8,gap:8},pt:{fontSize:13,color:'rgba(255,255,255,0.4)'},
  ic:{flexDirection:'row',alignItems:'center',paddingHorizontal:12,paddingVertical:8,borderTopWidth:1,borderTopColor:'rgba(255,255,255,0.05)',backgroundColor:'#0a0a1a'},
  vb:{width:40,height:40,borderRadius:20,backgroundColor:'rgba(255,255,255,0.05)',justifyContent:'center',alignItems:'center'},
  vba:{backgroundColor:'#e74c3c'},att:{width:36,height:36,borderRadius:18,backgroundColor:'rgba(255,255,255,0.04)',justifyContent:'center',alignItems:'center',marginRight:2},ti:{flex:1,backgroundColor:'rgba(255,255,255,0.05)',borderRadius:20,paddingHorizontal:16,paddingVertical:10,marginHorizontal:8,color:'#fff',fontSize:15,maxHeight:100},
  snd:{width:40,height:40,borderRadius:20,backgroundColor:'#6c5ce7',justifyContent:'center',alignItems:'center'},
  sndd:{backgroundColor:'rgba(255,255,255,0.05)'},
});