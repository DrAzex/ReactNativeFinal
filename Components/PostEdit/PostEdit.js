import React, { useContext, useState } from 'react';
import { TextInput, Text, Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Context } from "../../App";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PostEdit() {
    const { auth, firestore, firebase } = useContext(Context)
    const [user] = useAuthState(auth)
    const [error, setError] = useState('null')
    const [modalVisible, setModalVisible] = useState(false);
    const [postInfo, setPostInfo] = useState({ content: '', imgScr: '' })
    const [height, setHeight] = useState(0);
    const sendMessage = async () => {
        
        try {
            if (!postInfo.content.length > 0) { throw new Error('content-is-null') }
            firestore.collection('posts').add({
                uid: user.uid,
                displayName: user.displayName,
                text: postInfo.content,
                img: postInfo.imgScr,
                photoURL: user.photoURL,
                createAt: firebase.firestore.FieldValue.serverTimestamp(),
                likeCount: 0,
                likeSendUsersId: [],
                commentCount: 0,
                comments: []
            })
            setPostInfo({ content: '', imgScr: '' })
            setHeight(0)
        }
        catch (e) {
            setError(e.message)
        }
    }
    const style = StyleSheet.create({
        postdesign: {
            width: 100,
            height: 40,
            flex: 1,
            backgroundColor: "white",
            justifyContent: 'center',
            alignItems: "center",
            borderRadius: 30,
            marginTop: 10,
            marginLeft: "auto",
            marginRight: "auto",
            borderColor:"black",
        },
        block: {
            fontSize: 20,
            width: 300,
            maxHeight: 50 + height,
            backgroundColor: '#e3e8e4',
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
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
            paddingVertical: 10,
            paddingHorizontal: 115,
        },
        appButtonText: {
            fontSize: 15,
            color: "#fff",
            fontWeight: "bold",
            alignSelf: "center",
            textTransform: "uppercase",
        },
    
    
    });
    return (
        <View>
            <TouchableOpacity style={style.postdesign} onPress={() => setModalVisible(true)}  ><Text>Posting</Text></TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: 'rgba(52, 52, 52, 0.8)',

                    }} >
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: 'white',
                        borderRadius: 20,
                        padding: 35, 
                        maxHeight: 250 + height

                    }}>
                        <TextInput style={style.block} multiline onContentSizeChange={(event) => { setHeight(event.nativeEvent.contentSize.height) }} value={postInfo.content} onChangeText={text => setPostInfo({ content: text, imgScr: postInfo.imgScr })}
                            placeholder='Text'></TextInput>
                        <View style = {style.view}></View>
                        <TextInput style={style.block}  value={postInfo.imgScr} onChangeText={text => setPostInfo({ content: postInfo.content, imgScr: text })}
                            placeholder='Image SCR'></TextInput>
                        <View style = {style.view}></View>
                        {(error != 'null') ? (<Text>Error , type a content</Text>) : (<></>)}
                        <TouchableOpacity style = {style.appButtonContainer} onPress={sendMessage}  ><Text style = {style.appButtonText}>Publicate</Text></TouchableOpacity>
                        <View style = {style.view}></View>
                        <TouchableOpacity style = {style.appButtonContainer} onPress={() => setModalVisible(false)}  ><Text style = {style.appButtonText}>     Close     </Text></TouchableOpacity>
                    </View>
                </View>

            </Modal>
        </View>
    );
}

