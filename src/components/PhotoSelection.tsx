import  React, {useState} from 'react'
import { FlatList, Image, View } from 'react-native';
import { Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker'

export default function PhotoSelection(){
    const [images, setImages]= useState([]);

    const pickImages = async () =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            selectionLimit: 1,
            aspect:[4,3],
            quality:1
        })
    };
    return(
        <FlatList
        data = {images}
        renderItem= {({item}) =>(
            <Image
            source={{uri: item.uri}}
            style={{width:430, height:250}}
            />
        )}
        keyExtractor={(item)=>item.uri}
        ListHeaderComponent={
            <View>
                <Button title="Pick images" onPress={pickImages} />
            </View>
        }
        />
    )
}