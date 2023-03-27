import React from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import {useSurfaceScale} from '@react-native-material/core/src/hooks/use-surface-scale';
import Colors from '../../Styles/Colors';

function Card({cardData}) {
  const scale = useSurfaceScale();
  return (
    <ScrollView style={{backgroundColor: scale(0).hex()}}>
      <View style={[styles.card, {backgroundColor: scale(0).hex()}]}>
        <Text style={styles.description}>{cardData.DESCRIPTION}</Text>
        <Text
          style={[
            styles.text,
            {
              backgroundColor: 'lightgray',
              borderRadius: 20,
              width: '18%',
              paddingLeft: '1.5%',
            },
          ]}>
          <Text style={styles.innerText}>{cardData.WONUM}</Text>
        </Text>
        <View style={styles.container}>
          <View style={styles.column}>
            <Text style={styles.text}>
              Status: <Text style={styles.innerText}>{cardData.STATUS}</Text>
            </Text>
            <Text style={styles.text}>
              Lead: <Text style={styles.innerText}>{cardData.LEAD}</Text>
            </Text>
            <Text style={styles.text}>
              Phone: <Text style={styles.innerText}>{cardData.PHONE}</Text>
            </Text>
            <Text style={styles.text}>
              Asset number:{' '}
              <Text style={[styles.innerText, {color: Colors.navyBlue}]}>
                {cardData.ASSETNUM}
              </Text>
            </Text>

            <Text style={styles.text}>
              Problem code:{' '}
              <Text style={styles.innerText}>{cardData.PROBLEMCODE}</Text>
            </Text>
            <Text style={styles.text}>
              Failure code:{' '}
              <Text style={styles.innerText}>{cardData.FAILURECODE}</Text>
            </Text>
            <Text style={styles.text}>
              Site:{' '}
              <Text style={[styles.innerText, {color: Colors.navyBlue}]}>
                {cardData.SITEID}
              </Text>
            </Text>
            <Text style={styles.text}>
              Work Type:{' '}
              <Text style={styles.innerText}>{cardData.WORKTYPE}</Text>
            </Text>
            <Text style={styles.text}>
              Priority:{' '}
              <Text style={styles.innerText}>{cardData.WOPRIORITY}</Text>
            </Text>

            <Text style={styles.text}>
              Material description:{' '}
              {cardData &&
                cardData.WPMATERIAL &&
                cardData.WPMATERIAL.map((item, index) => (
                  <Text key={index} style={styles.innerText}>
                    {item.DESCRIPTION}
                  </Text>
                ))}
            </Text>
            <Text style={styles.text}>
              Location description:{' '}
              <Text style={styles.innerText}>
                {cardData.LOCATIONS[0].DESCRIPTION}
              </Text>
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              Organization ID:{' '}
              <Text style={styles.innerText}>{cardData.ORGID}</Text>
            </Text>
            <Text style={styles.text}>
              Account:{' '}
              <Text style={styles.innerText}>{cardData.GLACCOUNT}</Text>
            </Text>
            <Text style={styles.text}>
              Reported by:{' '}
              <Text style={styles.innerText}>{cardData.REPORTEDBY}</Text>
            </Text>
            <Text style={styles.text}>
              Reported at:{' '}
              <Text style={styles.innerText}>{cardData.REPORTDATE}</Text>
            </Text>
            <Text style={styles.text}>
              Scheduled at:{' '}
              <Text style={styles.innerText}>{cardData.SCHEDSTART}</Text>
            </Text>
            <Text style={styles.text}>
              Required Date:
              {cardData &&
                cardData.WPMATERIAL &&
                cardData.WPMATERIAL.map((item, index) => (
                  <Text key={index} style={styles.innerText}>
                    {item.REQUIREDATE}
                  </Text>
                ))}
            </Text>
            <Text style={styles.text}>
              Estimated duration:
              <Text style={styles.innerText}>{cardData.ESTDUR}</Text>
            </Text>
          </View>
        </View>
        <Text style={styles.text}>
          Long Description: {''}
          <Text style={styles.innerText}>
            {cardData.DESCRIPTION} {cardData.DESCRIPTION} {cardData.DESCRIPTION}{' '}
            {cardData.DESCRIPTION} {cardData.DESCRIPTION} {cardData.DESCRIPTION}{' '}
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
