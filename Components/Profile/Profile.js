import React, { useContext } from "react";
import { TouchableOpacity, Text, View, Image, ScrollView, StyleSheet } from 'react-native';

import { Context } from "../../App";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Loader from "../Loader/Loader";

export default function Messenger() {
    const { firestore, auth } = useContext(Context)
    const [user] = useAuthState(auth)
    const [messages, loading] = useCollection(
        firestore.collection('posts').orderBy('createAt')
    )
    if (loading) {
        return <Loader />
    }
    let postCount = messages.docs.filter(post => post.data().uid == user.uid).length;
    let likeCount = 0
    messages.docs.filter(post => post.data().uid == user.uid).map(mes => { likeCount += mes.data().likeCount });
    const style = StyleSheet.create({
        info: {
            width: '50%',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        img: {
            borderRadius: 50,
            marginRight: 10,
        },
        view: {
            marginTop: 10,
        },
        textDesign: {
            fontSize: 30,

        },
        like: {
            width: 80,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        comments: {
            width: "100%",
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        signOut: {
            width: 100,
            height: 40,
            backgroundColor: "white",
            justifyContent: 'center',
            alignItems: "center",
            borderRadius: 30,
            marginTop: 10,
            marginLeft: "auto",
            marginRight: "auto",
            borderColor: "black",
            marginBottom: 10,
        },
        appButtonText1: {
            fontSize: 18,
            color: "black",
            fontWeight: "bold",
            alignSelf: "center",
            textTransform: "uppercase",
        },
        appButtonContainer1: {
            elevation: 8,
            backgroundColor: "white",
            borderRadius: 10,
            width: "100%",
            height: 50,
            alignItems: "center",
            justifyContent: "center",
        },
    });
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <ScrollView>
                <View>

                    <Text style={{ color: "#009688", fontSize: 16 ,marginLeft:15}}>Your name is {user.displayName}</Text>
                    <View style={style.view}></View>
                    <Text style={{ color: "#009688", fontSize: 16,marginLeft:15 }}>Post count {postCount}</Text>
                    <View style={style.view}></View>
                    <Text style={{ color: "#009688", fontSize: 16 ,marginLeft:15}}>Likes count {likeCount}</Text>
                    <View style={style.view}></View>
                    <View style={style.appButtonContainer1}>
                        <Text style={style.appButtonText1}>Your posts</Text>
                    </View>
                </View>

                {
                    messages.docs.filter(post => post.data().uid == user.uid).map(message =>
                        <View style={{ backgroundColor: "white", marginTop: 10, marginBottom: 10 }}>
                            <View style={{ borderSize: "30px", margin: 20 }} key={message.id}>
                                <View style={style.info}>
                                    <Image style={style.img} source={{
                                        uri: message.data().photoURL,
                                        width: 60,
                                        height: 60,
                                        resizeMode: "contain",
                                    }} />
                                    <Text style={style.textDesign}>{message.data().displayName}</Text>
                                </View>
                                <View>
                                    <Text style={{ marginTop: 10 }}>{message.data().text}</Text>
                                    {(message.data().img) ? <Image style={{ marginBottom: 10, marginTop: 10 }} source={{
                                        uri: message.data().img,
                                        width: 350,
                                        height: 350,
                                        defaultSource: 'http://www.dermalina.com/wp-content/uploads/2020/12/no-image.jpg',
                                        resizeMode: "contain"
                                    }} /> : <></>}
                                </View>

                            </View>
                        </View>
                    )}

            </ScrollView>

            <TouchableOpacity style={style.signOut} title='Sing out' onPress={() => console.log(auth.signOut())}><Text>Sing out</Text></TouchableOpacity>
        </View>
    );
}


