import React, {useState} from 'react';
import {StyleSheet, Text, Linking, View, TouchableOpacity} from 'react-native';
import {Button} from '@react-native-material/core';

import {useSurfaceScale} from '@react-native-material/core';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import Colors from '../../Styles/Colors';
import {encode} from 'base-64';

function AttachmentScreen() {
  const scale = useSurfaceScale();
  const route = useRoute();
  const {Attachment} = route.params;

  const [attachmentFile, setAttachmentFile] = useState(null);

  const uploadAttachment = async () => {
    const url =
      'http://training.smartech-tn.com:9219/maximo/oslc/attachment/WORKORDER/1137&_lid=maxadmin&_lpwd=maxadmin123&lean=1';

    try {
      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('File:', file);
      console.log('URI:', file.uri);
      console.log('Type:', file.type);
      console.log('Name:', file.name);

      const formData = new FormData();
      formData.append('attachment', {
        uri: file[0].uri,
        type: file[0].type,
        name: file[0].name,
      });
      console.log('uri:', formData._parts[0][1].uri);
      console.log('type:', formData._parts[0][1].type);
      console.log('name:', formData._parts[0][1].name);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      console.log('Response:', response);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  console.log('Attachment', Attachment);
  const downloadFiles = attachments => {
    if (attachments && attachments.length > 0) {
      attachments.forEach(attachment => {
        const {href} = attachment;
        Linking.openURL(href);
      });
    } else {
      console.log('Download links not found');
    }
  };

  return (
    <View style={[{backgroundColor: scale(0).hex()}, styles.card]}>
      {Attachment && (
        <View>
          <Text
            style={{
              fontSize: 25,
              color: Colors.navyBlue,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
            Attachments
          </Text>
          {Attachment.map(attachment => (
            <View key={attachment.describedBy.docinfoid}>
              <Text style={styles.text}>
                Description : {attachment.describedBy.description}
              </Text>
              <Text style={styles.text}>
                Document : {attachment.describedBy.title}
              </Text>
              <Text style={styles.text}>
                Size : {attachment.describedBy.attachmentSize} bytes
              </Text>
              <Text style={styles.text}>
                Created : {attachment.describedBy.created}
              </Text>
              <Button
                title="Download File"
                style={{marginTop: 10}}
                color={Colors.navyBlue}
                onPress={() => downloadFiles([attachment])}
              />
            </View>
          ))}
        </View>
      )}

      <Button
        title="Upload Document"
        style={{marginTop: 10}}
        color={Colors.navyBlue}
        onPress={uploadAttachment}
        variant="outlined"
      />
    </View>
  );
}
styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    marginBottom: 15,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    padding: 20,
    flex: 1,
    alignItems: 'flex-start',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'monospace',
    color: Colors.black,
    marginBottom: 7,
    marginTop: 7,
    textAlign: 'left',
  },
});

export default AttachmentScreen;
