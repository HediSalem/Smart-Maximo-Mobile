import React from 'react';
import ListItem from './ListItem';
import {FlatList, View} from 'react-native';

function MyFlatlist({data, searchPhrase, setCLicked}) {
  const renderItem = ({item}) => {
    if (searchPhrase === '') {
      return (
        <View>
          <ListItem
            title={item.DESCRIPTION}
            overline={item.WONUM}
            meta={item.STATUS}
            secondaryText={item.ASSETNUM}
            location={item.LOCATION}
            item={item}
            allData={data}
          />
        </View>
      );
    }
    if (
      item.DESCRIPTION.toUpperCase().includes(
        searchPhrase.toUpperCase().trim().replace(/\s/g, ''),
      )
    ) {
      return (
        <ListItem
          title={item.DESCRIPTION}
          overline={item.WONUM}
          meta={item.STATUS}
          secondaryText={item.ASSETNUM}
          location={item.LOCATION}
          item={item}
          allData={data}
        />
      );
    }
  };
  return (
    <FlatList
      data={data}
      keyExtractor={workorder => workorder.WORKORDERID.toString()}
      renderItem={renderItem}
      initialNumToRender={5}
    />
  );
}

export default MyFlatlist;
