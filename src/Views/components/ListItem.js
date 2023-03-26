import React from 'react';
import {View} from 'react-native';
import Divider from '@react-native-material/core/src/Divider';
import Text from '@react-native-material/core/src/Text';
import Pressable from '@react-native-material/core/src/Pressable';
import {useSurfaceScale} from '@react-native-material/core/src/hooks/use-surface-scale';
import {Stack, Button} from '@react-native-material/core';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../../config/Colors';
const ListItem = ({
  title,
  secondaryText,
  overline,
  meta,
  leadingMode = 'icon',
  leading,
  trailing,
  location,
  item,
  allData,

  pressEffect,
  pressEffectColor,
}) => {
  const navigation = useNavigation();
  const scale = useSurfaceScale();
  const handlePress = () => {
    const result = allData.find(
      element => element.WORKORDERID === item.WORKORDERID,
    );

    navigation.navigate('Details', {data: result});
  };

  return (
    <Pressable
      style={{backgroundColor: scale(0).hex()}}
      pressEffect={pressEffect}
      pressEffectColor={pressEffectColor}
      onPress={handlePress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 12,
        }}>
        {leading && (
          <View
            style={{
              width:
                leadingMode === 'icon'
                  ? 24
                  : leadingMode === 'avatar'
                  ? 56
                  : 100,
              height:
                leadingMode === 'icon'
                  ? 24
                  : leadingMode === 'avatar'
                  ? 56
                  : 56,
              justifyContent: 'center',
              alignItems: 'center',
              marginStart: leadingMode === 'image' ? 0 : 16,
            }}>
            {leading}
          </View>
        )}
        <View style={{flex: 1, marginHorizontal: 16}}>
          {overline && (
            <Text
              selectable={false}
              variant="overline"
              style={{
                marginBottom: 2,
                color: Colors.navyBlue,
                fontSize: 15,
                fontWeight: '700',
              }}>
              {overline}
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {title && (
              <Text
                selectable={false}
                variant="subtitle1"
                style={{
                  color: scale(0.87).hex(),
                  fontSize: 18,
                  fontWeight: 'bold',
                  width: '80%',
                }}>
                {title}
              </Text>
            )}
            <View
              style={{
                backgroundColor: 'lightgray',
                borderRadius: 20,
                width: '18%',
              }}>
              {meta && (
                <Text
                  selectable={false}
                  variant="caption"
                  style={{
                    color: scale(0.87).hex(),
                    fontWeight: '500',
                    textAlign: 'center',
                  }}>
                  {meta}
                </Text>
              )}
            </View>
          </View>
          {secondaryText && (
            <Text
              selectable={false}
              variant="body2"
              style={{
                marginTop: 4,
                color: scale(0.8).hex(),
                fontWeight: '400',
              }}>
              {secondaryText}
            </Text>
          )}
          {location && (
            <Text
              selectable={false}
              variant="caption"
              style={{
                color: scale(0.87).hex(),
                fontSize: 14,
                fontWeight: '500',
                marginTop: 4,
                marginBottom: 4,
              }}>
              {location}
            </Text>
          )}
          <Stack fill direction="row" spacing={4}>
            <Button title="Assist" color={Colors.navyBlue} />
            <Button title="Expert" color={Colors.navyBlue} variant="outlined" />
          </Stack>
        </View>
        {trailing && (
          <View
            style={{
              width: 24,
              height: 24,
              marginEnd: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {typeof trailing === 'function'
              ? trailing({color: scale(0.87).hex(), size: 24})
              : trailing}
          </View>
        )}
      </View>

      <Divider
        leadingInset={
          leading
            ? leadingMode === 'icon'
              ? 56
              : leadingMode === 'avatar'
              ? 88
              : 116
            : 16
        }
      />
    </Pressable>
  );
};

export default ListItem;
