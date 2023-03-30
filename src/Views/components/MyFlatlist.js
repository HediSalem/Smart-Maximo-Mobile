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
            title={item.description}
            overline={item.wonum}
            meta={item.status}
            secondaryText={item.assetnum}
            location={item.location}
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
          title={item.description}
          overline={item.wonum}
          meta={item.status}
          secondaryText={item.assetnum}
          location={item.location}
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
