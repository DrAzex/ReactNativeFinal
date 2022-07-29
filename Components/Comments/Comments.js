import React, {useContext, useState} from 'react';
import {TextInput, Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Context} from "../../App";
import {useAuthState} from "react-firebase-hooks/auth";
import { FontAwesome } from '@expo/vector-icons';

export default function PostEdit({message}) {
    const {auth,firestore } = useContext(Context)
    const [user] = useAuthState(auth)
    const [error,setError] = useState('null')
    const [visible, setVisible] = useState(false);
    const [postInfo,setPostInfo] = useState({content:'',imgScr:''})
    const [height, setHeight] = useState(0);
    const sendMessage = async ()=>{
        try {
            if (postInfo.content.length <=0){throw new Error('content-is-null')}

            firestore.doc(message.ref.path).update({'commentCount':message.data().commentCount+1})
            firestore.doc(message.ref.path).update({'comments':[...message.data().comments,{
                    displayName: user.displayName,
                    text: postInfo.content,
                    photoURL: user.photoURL,
                }]})

            setPostInfo({content: '', imgScr: ''})
            setHeight(0)
            setError('null')
        }
        catch (e){
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
            width: "100%",
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
        info: {
            width:'40%',
            flex:1,
            flexDirection:'row',
            justifyContent: 'space-between',
            alignItems:'center',
        },
        img: {
            width:50,
            height:50,
            borderRadius:50,
            marginRight:10,
        },
        textDesign: {
            fontSize:18,
        },
    
    });
    return (
        <View>
            <TouchableOpacity onPress={()=> setVisible(!visible)}>{(!visible)?<FontAwesome name="comments" size={24} color="black" /> :<FontAwesome name="comments-o" size={24} color="black" /> }</TouchableOpacity>
                <View style={{display:(visible)?"block" : "none" } }  >
                    <View style={{
                        maxHeight: 250 +height
                    }}> 
                        <View style = {style.view}></View>
                        <TextInput  style = {style.block} multiline onContentSizeChange={(event) => {setHeight(event.nativeEvent.contentSize.height)}}  value={postInfo.content} onChangeText={text => setPostInfo({content:text,imgScr:postInfo.imgScr})}
                                    placeholder='Text'></TextInput>

                        {(error !='null')?(<Text>Error , type a content</Text>):(<></>)}
                        <View style = {style.view}></View>
                        <TouchableOpacity  style = {style.appButtonContainer} onPress={sendMessage}  ><Text style = {style.appButtonText}>Publicate</Text></TouchableOpacity>
                        <View style = {style.view}></View>
                    </View>

                    <View>
                        {message.data().comments.map((m,index)=>
                            <View key={index}>
                                <View style = {style.info}>
                                <Image style = {style.img}source={{
                                    uri: m.photoURL,
                                    width: 60,
                                    height: 60,
                                    resizeMode:"contain"
                                }} />
                                <Text style = {{fontSize: 25}}>{m.displayName}</Text>
                                </View>
                                <View style = {style.view}>
                                <Text>{m.text}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

        </View>

    );
}

