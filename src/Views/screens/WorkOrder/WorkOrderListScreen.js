import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';

import MyFlatlist from '../../components/MyFlatlist';

import CommonHeader from '../../components/CommonHeader';
import SearchBar from '../../components/SearchBar';

const WorkOrderListScreen = () => {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [clicked, setClicked] = useState(false);
  const route = useRoute();
  const {responseDetail} = route.params || {};
  const title = 'Work order list';

  return (
    <View>
      <View style={{backgroundColor: '#FFFFFF'}}>
        <CommonHeader title={title} />
        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
          setClicked={setClicked}
        />
        <MyFlatlist
          data={responseDetail}
          setClicked={setClicked}
          searchPhrase={searchPhrase}
        />
      </View>
    </View>
  );
};

styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  List: {
    fontSize: 16,
  },
});
export default WorkOrderListScreen;
