import React from 'react';
import ListItem from './ListItem';
import {FlatList, View} from 'react-native';

function MyFlatlist({data, searchPhrase}) {
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
      item.DESCRIPTION.toUpperCase().includes(
        searchPhrase.toUpperCase().trim().replace(/\s/g, ''),
      )
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
      keyExtractor={workorder => workorder.workorderid.toString()}
      renderItem={renderItem}
      initialNumToRender={5}
    />
  );
}

export default MyFlatlist;
