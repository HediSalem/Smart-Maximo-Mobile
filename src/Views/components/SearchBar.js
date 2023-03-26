import React from 'react';
import {StyleSheet, TextInput, View, Keyboard} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import {Button} from '@react-native-material/core';
import Colors from '../../../config/Colors';
const SearchBar = ({clicked, searchPhrase, setSearchPhrase, setClicked}) => {
  return (
    <View style={styles.container}>
      <View
        style={
          clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
        }>
        <Ionic name="search" size={20} color="black" style={{marginLeft: 1}} />

        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {clicked && (
          <Ionic
            name="close-circle"
            size={20}
            color="black"
            style={{padding: 1}}
            onPress={() => {
              setSearchPhrase('');
            }}
          />
        )}
      </View>
      {clicked && (
        <View>
          <Button
            variant="outlined"
            title="Cancel"
            color={Colors.navyBlue}
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}></Button>
        </View>
      )}
    </View>
  );
};
export default SearchBar;

const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: 'row',
    width: '95%',
    backgroundColor: Colors.mystic,
    borderRadius: 15,
    alignItems: 'center',
    height: '87%',
  },
  searchBar__clicked: {
    height: '87%',
    padding: 10,
    flexDirection: 'row',
    width: '80%',
    backgroundColor: Colors.mystic,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: '90%',
    marginBottom: -10,
  },
});
