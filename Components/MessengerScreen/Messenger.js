import React, { useContext, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, TextInput, Modal, Image, StyleSheet ,KeyboardAvoidingView } from 'react-native';
import { Context } from "../../App";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { AntDesign } from '@expo/vector-icons';
import Loader from "../Loader/Loader";

export default function Profile() {
    const { firebase, firestore, auth } = useContext(Context)
    const [user] = useAuthState(auth)
    const [error, setError] = useState('null')
    const [showChat, setShowChat] = useState(false);
    const [infoChat, setInfoChat] = useState('');
    const [info, setInfo] = useState({ email: '', name: '' })
    const [height, setHeight] = useState(0);
    const [messages, loading] = useCollection(
        firestore.collection('direct').orderBy('createAt')
    )
    const StartNewChat = async (secondMembereMail, chatName) => {
        try {
            messages.docs.forEach(message => {
                if ((message.data().members.includes(secondMembereMail) && message.data().members.includes(user.email))
                    || user.email == secondMembereMail
                    || info.email.length == 0 || info.name.length == 0
                ) { throw new Error('Recurring mail') }
            })
            firestore.collection('direct').add({
                createAt: firebase.firestore.FieldValue.serverTimestamp(),
                chatName: chatName,
                members: [user.email, secondMembereMail],
                content: []
            })
            setInfo({ email: '', name: '' })
            setError('null')
        }
        catch (e) {
            setError(e.message)
        }

    }

    const sendChatMessage = (message) => {
        try {
            if (infoChat.length <= 0) throw new Error('lenght')
            firestore.doc(message.ref.path).update({ 'content': [...message.data().content, { text: infoChat, photoURL: user.photoURL, uid: user.uid, displayName: user.displayName }] })
            setInfoChat('')
            setError('null')
            setHeight(0)
        }
        catch (e) {
            setError(e.message)
        }

    }
    if (loading) {
        return <Loader />
    }
    const styles = StyleSheet.create({
        block: {
            fontSize: 20,
            width: 300,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            borderColor: "#009688",
            borderWidth: 2,
        },
        components: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: '#e3e8e4',
            alignItems: "center",
            justifyContent: "center",
        },
        view: {
            margin: 6,
        },
        button: {
            width: 300,
            height: 50,
            backgroundColor: "blue"
        },
        appButtonContainer: {
            elevation: 8,
            backgroundColor: "#009688",
            borderRadius: 10,
            width: 300,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
        },
        appButtonContainer1: {
            elevation: 8,
            backgroundColor: "white",
            borderRadius: 10,
            width: 300,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
        },
        appButtonText: {
            fontSize: 18,
            color: "#fff",
            fontWeight: "bold",
            alignSelf: "center",
            textTransform: "uppercase",
        },
        appButtonText1: {
            fontSize: 18,
            color: "#009688",
            fontWeight: "bold",
            alignSelf: "center",
            textTransform: "uppercase",
        },
        info: {
            width: '40%',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        img: {
            width: 50,
            height: 50,
            borderRadius: 50,
            marginRight: 10,
        },
        textDesign: {
            fontSize: 18,
        },
    });
    return (
        <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>
            <View>
                <TextInput style={styles.block} value={info.email} onChangeText={(e) => setInfo({ email: e, name: info.name })} placeholder='Member Email'></TextInput>
                <View style={styles.view}></View>
                <TextInput style={styles.block} value={info.name} onChangeText={(e) => setInfo({ email: info.email, name: e })} placeholder='Chat name'></TextInput>
                <View style={styles.view}></View>
                <TouchableOpacity style={styles.appButtonContainer} onPress={() => StartNewChat(info.email, info.name)}><Text style={styles.appButtonText}>Start new chat</Text></TouchableOpacity>
                {(error != 'null') ? <Text> Error,Check if the data is correct</Text> : <></>}
                <View style={styles.view}></View>
                <View style={styles.appButtonContainer1}><Text style={{ color: "black", fontSize: 18 }}>Chats</Text></View>
            </View>
            <ScrollView>
                {messages.docs.filter(post => post.data().members.includes(user.email)).map((message) =>
                    <View key={message.id}>

                        <View>
                            <View style={styles.view}></View>
                            <TouchableOpacity style={styles.appButtonContainer1} onPress={() => setShowChat(message.id)}><Text style={styles.appButtonText1}>{message.data().chatName}</Text></TouchableOpacity>
                        </View>

                        {(showChat == message.id) ?
                            <Modal transparent={false} visible={showChat != null} animationType='slide'>
                                <View style={{ paddingTop: 50, paddingBottom: 80, flex: 1 }}>
                                    <View style={{ justifyContent: "space-around", alignItems: "center", width: "100%", flexDirection: "row", }}>
                                        <Text style={{ color: "#009688", fontSize: 18, }}>{message.data().chatName}</Text>
                                        <TouchableOpacity onPress={() => setShowChat(false)} ><AntDesign name="closecircleo" size={24} color="#009688" /></TouchableOpacity>
                                    </View>
                                    <ScrollView style={{ padding: 20,}}>
                                        {
                                            message.data().content.map((mess, i) =>

                                                <View style={(mess.uid != user.uid)? {
                                                    width: "100%", borderColor: "#009688",
                                                    borderWidth: 2, borderRadius: 5, marginTop: 10, padding: 10
                                                } :{width: "100%", borderColor: "red",
                                                borderWidth: 2, borderRadius: 5, marginTop: 10, padding: 10}} key={i}>

                                                    <View style={styles.info}>

                                                        <Image style={styles.img} source={{
                                                            uri: mess.photoURL,
                                                            width: 60,
                                                            height: 60,
                                                            resizeMode: "contain"
                                                        }} />
                                                        <Text style={{ fontSize: 18 }}>{mess.displayName}</Text>
                                                    </View>
                                                    <View style={styles.view}></View>
                                                    <Text style={{ color: "gray" }}>{mess.text}</Text>
                                                </View>)}

                                    </ScrollView>
                                    <KeyboardAvoidingView
                                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                                    style={{flex:1,marginTop:150}}
                                    >
                                        <View style={{ alignItems: "center", justifyContent: "flex-end", flexDirection: 'column' }}>
                                            <TextInput style={styles.block} multiline onContentSizeChange={(event) => { setHeight(event.nativeEvent.contentSize.height) }} placeholder='Type a message' value={infoChat} onChangeText={setInfoChat}></TextInput>
                                            <View style={styles.view}></View>
                                            <TouchableOpacity onPress={() => sendChatMessage(message)} style={styles.appButtonContainer}><Text style={styles.appButtonText}>Send</Text></TouchableOpacity>
                                        </View>
                                    </KeyboardAvoidingView>
                                </View>
                            </Modal> : <></>}
                    </View>
                )}


            </ScrollView>
        </View>
    );
}
