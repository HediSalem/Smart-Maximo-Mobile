import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Ionic from 'react-native-vector-icons/Ionicons';
import {useSurfaceScale} from '@react-native-material/core/src/hooks/use-surface-scale';
import Colors from '../../Styles/Colors';
import {useNavigation} from '@react-navigation/native';
function Card({cardData}) {
  const navigation = useNavigation();
  //console.log(cardData.worklog);
  const handlePressAttachments = () => {
    navigation.navigate('AttachmentStack', {
      screen: 'Attachment',
      params: {Attachment: cardData.doclinks.member},
    });
  };
  const handlePressTasks = () => {
    navigation.navigate('TaskStack', {
      screen: 'Task',
      params: {Woactivity: cardData.woactivity},
    });
  };
  const handlePressJournal = () => {
    navigation.navigate('JournalStack', {
      screen: 'Journal',
      params: {Journal: cardData.worklog},
    });
  };
  const scale = useSurfaceScale();

  return (
    <ScrollView style={{backgroundColor: scale(0).hex()}}>
      <View style={[styles.card, {backgroundColor: scale(0).hex()}]}>
        <Text style={styles.description}>{cardData.description}</Text>
        <Text
          style={[
            styles.text,
            {
              backgroundColor: 'lightgray',
              borderRadius: 20,
              width: '18%',
              textAlign: 'center',
            },
          ]}>
          <Text style={[styles.innerText]}>{cardData.wonum}</Text>
        </Text>
        <View style={styles.container}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Ionic name="ios-checkmark-circle-outline" size={20} />
              Status: <Text style={styles.innerText}>{cardData.status}</Text>
            </Text>
            <Text style={styles.text}>
              <Ionic name="body-outline" size={20} />
              Lead: <Text style={styles.innerText}>{cardData.lead} </Text>
            </Text>

            <Text style={styles.text}>
              <Ionic name="md-settings-outline" size={20} />
              Asset:{' '}
              <Text style={[styles.innerText, {color: Colors.navyBlue}]}>
                {cardData.assetnum}
              </Text>
            </Text>

            <Text style={styles.text}>
              <Ionic name="ios-location-outline" size={20} />
              Location:
              <Text style={[styles.innerText, {color: Colors.navyBlue}]}>
                {cardData.location}
              </Text>
            </Text>
            <TouchableOpacity onPress={handlePressAttachments}>
              <Text style={styles.text}>
                <Ionic name="attach" size={20} />
                Attachments:{''}
                {cardData.doclinks ? cardData.doclinks.member.length : 0}
              </Text>
            </TouchableOpacity>
            <Text style={styles.text}>
              <Ionic name="briefcase-outline" size={20} /> Worktype :{' '}
              <Text style={styles.innerText}>{cardData.worktype}</Text>
            </Text>
            <TouchableOpacity onPress={handlePressTasks}>
              <Text style={styles.text}>
                <Ionic name="md-list-circle-outline" size={20} />
                Tasks:
                <Text style={styles.innerText}>
                  {cardData.woactivity ? cardData.woactivity.length : 0}
                </Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePressJournal}>
              <Text style={styles.text}>
                <Ionic name="journal-outline" size={20} />
                Journal:
                <Text style={styles.innerText}>
                  {cardData.worklog ? cardData.worklog.length : 0}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.text}>
          <Ionic name="document-text-outline" size={20} />
          Long Description: {''}
          <Text style={styles.innerText}>
            {cardData.description_longdescription}
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  column: {
    flex: 1,

    alignItems: 'flex-start',
    textAlign: 'justify',
  },
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
  container: {
    flex: 1,
    flexDirection: 'row',
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
  innerText: {
    fontWeight: 'bold',
    marginTop: 7,
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.royalBlue,
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Card;
