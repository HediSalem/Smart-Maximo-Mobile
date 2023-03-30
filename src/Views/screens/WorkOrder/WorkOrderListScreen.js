import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useSurfaceScale} from '@react-native-material/core/src/hooks/use-surface-scale';
import {getWoDetail} from '../../../api/DataApis';
//import {insertDataIntoDatabase} from '../../../database/Database';
import MyFlatlist from '../../components/MyFlatlist';
import CommonHeader from '../../components/CommonHeader';
import SearchBar from '../../components/SearchBar';
const PAGE_SIZE = 10;
const WorkOrderListScreen = () => {
  const scale = useSurfaceScale();
  const [searchPhrase, setSearchPhrase] = useState('');
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const {newData, nextPage} = await getWoDetail(page, PAGE_SIZE);
    if (newData.length > 0) {
      setData(prevData => {
        const newDataFiltered = newData.filter(
          item =>
            !prevData.some(
              existingItem =>
                existingItem.workorderid === item.workorderid &&
                existingItem.wonum === item.wonum,
            ),
        );
        return [...prevData, ...newDataFiltered];
      });
      setPage(prevPage => (nextPage ? prevPage + 1 : prevPage));
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLoadMore = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return (
    <View style={{backgroundColor: scale(0).hex(), flex: 1}}>
      <View>
        <CommonHeader title="Work order list" />
        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
          setClicked={setClicked}
        />
        <MyFlatlist
          data={data}
          searchPhrase={searchPhrase}
          onEndReached={handleLoadMore}
          keyExtractor={(item, index) => item.workorderid.toString() + index}
          onEndReachedThreshold={0.1}
        />
        {loading && <ActivityIndicator size="large" />}
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
