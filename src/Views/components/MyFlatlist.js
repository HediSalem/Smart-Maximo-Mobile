import React from 'react';
import ListItem from './ListItem';
import {FlatList, View} from 'react-native';

function MyFlatlist({
  data,
  searchPhrase,
  onEndReached,
  keyExtractor,
  onEndReachedThreshold,
}) {
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
      item.description
        .toUpperCase()
        .includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ''))
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
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      contentContainerStyle={{paddingBottom: 160}}
    />
  );
}

export default MyFlatlist;
