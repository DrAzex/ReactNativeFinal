import React, {useContext} from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import {useCollection} from "react-firebase-hooks/firestore";
import {Context} from "../../App";
import {useAuthState} from "react-firebase-hooks/auth";

import PostEdit from "../PostEdit/PostEdit";
import Loader from "../Loader/Loader";
import Comments from '../Comments/Comments'

export default function HomeScreen() {
    const {firestore, auth} = useContext(Context)
    const [user] = useAuthState(auth)
    const [messages,loading] = useCollection(
        firestore.collection('posts').orderBy('createAt')
    )
    const Liking = (m)=>{
        if(!m.data().likeSendUsersId.includes(user.uid)){
            firestore.doc(m.ref.path).update({'likeCount':m.data().likeCount+1})
            firestore.doc(m.ref.path).update({'likeSendUsersId':[...m.data().likeSendUsersId,user.uid]})
        }
        else{
            firestore.doc(m.ref.path).update({'likeCount':m.data().likeCount-1})
            let a =m.data().likeSendUsersId;
            a.pop(a.indexOf(user.uid))
            firestore.doc(m.ref.path).update({'likeSendUsersId':[...a]})
        }
    }
    if(loading){
        return <Loader />
    }
    return (
        <ScrollView style = {{backgroundColor: "#e3e8e4"}}>
            <PostEdit />
                {
                    messages.docs.map(message =>
                    <View style = {{backgroundColor: "white", marginTop:10,marginBottom:10}}>
                    <View style={{borderSize:"30px",margin:20}} key = {message.id}>
                        <View style = {style.info}>
                            <Image style = {style.img} source={{
                                    uri: message.data().photoURL,
                                    width: 60,
                                    height: 60,
                                    resizeMode:"contain",
                            }} />
                            <Text style = {style.textDesign}>{message.data().displayName}</Text>
                        </View>
                        <View>
                            <Text style = {{marginTop:10}}>{message.data().text}</Text>
                            {(message.data().img)? <Image style = {{marginBottom:10,marginTop:10}}source={{
                                uri: message.data().img,
                                width: 350,
                                height: 350,
                                defaultSource : 'http://www.dermalina.com/wp-content/uploads/2020/12/no-image.jpg',
                                resizeMode:"contain"
                            }} /> : <></>}
                        </View>
                        <View style = {style.comments}>
                                <View style = {style.like}> 
                                <Text>Likes {message.data().likeCount}</Text>
                                <TouchableOpacity onPress={()=> Liking(message)} ><AntDesign  name={(message.data().likeSendUsersId.includes(user.uid))?'like1': 'like2'} size={24} color="black" /></TouchableOpacity>
                                </View>
                                 <View>
                                    <Text>Comment {message.data().commentCount}</Text>    
                                </View>
                                
                            </View>
                            <View>
                                    <Comments message ={message} />
                                </View>
                    </View>
                </View>
                )}
        </ScrollView>
    );
}

const style = StyleSheet.create({
    info: {
        width:'50%',
        flex:1,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
    },
    img: {
        borderRadius:50,
        marginRight:10,
    },
    view: {
        width:'100%',
        height:4,
        backgroundColor:'black',
        marginBottom:10,
    },
    textDesign: {
        fontSize:30,

    },
    like: {
        width: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
    },
    comments: {
        width: "100%",
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
});