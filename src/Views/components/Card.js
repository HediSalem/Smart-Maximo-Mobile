import React from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import {useSurfaceScale} from '@react-native-material/core/src/hooks/use-surface-scale';
import Colors from '../../Styles/Colors';

function Card({cardData}) {
  const scale = useSurfaceScale();
  console.log(cardData);
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
              Status: <Text style={styles.innerText}>{cardData.status}</Text>
            </Text>
            <Text style={styles.text}>
              Lead:{' '}
              {typeof cardData.lead === 'undefined' ? (
                <Text style={styles.innerText}>Not yet defined</Text>
              ) : (
                <Text style={styles.innerText}>{cardData.lead} </Text>
              )}
            </Text>

            <Text style={styles.text}>
              Asset number:{' '}
              <Text style={[styles.innerText, {color: Colors.navyBlue}]}>
                {cardData.assetnum}
              </Text>
            </Text>

            <Text style={styles.text}>
              Location:{' '}
              <Text style={[styles.innerText, {color: Colors.navyBlue}]}>
                {cardData.location}
              </Text>
            </Text>
            <Text style={styles.text}>
              Tasks:
              {cardData &&
                cardData.woactivity &&
                cardData.woactivity.map((item, index) => (
                  <Text key={index} style={styles.innerText}>
                    {'\n'}
                    {item.description}
                  </Text>
                ))}
            </Text>
            <Text style={styles.text}>
              Attachments:
              {cardData &&
                cardData.doclinks &&
                cardData.doclinks.map((item, index) => (
                  <Text key={index} style={styles.innerText}>
                    {'\n'}
                    {item.href}
                  </Text>
                ))}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              Worktype :{' '}
              <Text style={styles.innerText}>{cardData.worktype}</Text>
            </Text>

            <Text style={styles.text}>
              Journal:
              {cardData &&
                cardData.worklog &&
                cardData.worklog.map((item, index) => (
                  <Text key={index} style={styles.innerText}>
                    {'\n'}
                    {item.description}
                  </Text>
                ))}
            </Text>
          </View>
        </View>
        <Text style={styles.text}>
          Long Description: {''}
          {typeof cardData.description_longdescription === 'undefined' ? (
            <Text style={styles.innerText}>Yet to be determined</Text>
          ) : (
            <Text style={styles.innerText}>
              {cardData.description_longdescription}
            </Text>
          )}
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
    fontWeight: '400',
    fontFamily: 'monospace',
    color: Colors.black,
    marginBottom: 7,
    marginTop: 7,
    textAlign: 'left',
  },
  innerText: {
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.royalBlue,
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Card;
