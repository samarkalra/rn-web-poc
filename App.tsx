import {
  View,
  Text,
  Alert,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';

type User = {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  picture: string;
};

type UserServiceResponse = {
  data: User[];
};

const INITIAL_PAGE = 0;
const PER_PAGE = 10;

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [isUserListLoaderVisible, setIsUserListLoaderVisible] = useState(false);
  const [isUserListEnd, setIsUserListEnd] = useState(false);

  const fetchUsers = async () => {
    if (isUserListLoaderVisible) {
      return;
    }

    setIsUserListLoaderVisible(true);
    fetch(`https://dummyapi.io/data/v1/user?page=${page}&limit=${PER_PAGE}`, {
      headers: {
        'app-id': '6135078fdb7c40bcbb107099',
      },
    })
      .then(response => {
        setIsUserListLoaderVisible(false);
        return response.json();
      })
      .then(data => {
        if (
          data.page <= Math.floor(data.total / PER_PAGE) &&
          data.data.length > 0 &&
          data.page === page
        ) {
          setUsers(currentUserList => [...currentUserList, ...data.data]);
          setPage(currentPage => currentPage + 1);
        } else {
          setIsUserListEnd(true);
        }
      })
      .catch(error => {
        setIsUserListLoaderVisible(false);
        Alert.alert('', error.message);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderFooter = () =>
    isUserListLoaderVisible && !isUserListEnd ? (
      <ActivityIndicator size="large" color="red" />
    ) : null;

  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 32, color: 'black', textAlign: 'center'}}>
        React Native Web POC
      </Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <View style={{flexDirection: 'row', padding: 8}}>
            <View style={{justifyContent: 'center'}}>
              <Text style={{fontSize: 22, color: 'black'}}>{index + 1}</Text>
            </View>
            <View style={{marginLeft: 12}}>
              <Image
                source={{uri: item.picture}}
                resizeMode="contain"
                style={{width: 80, height: 80, borderRadius: 40}}
              />
            </View>
            <View style={{flex: 1, paddingLeft: 8, justifyContent: 'center'}}>
              <Text style={{fontSize: 18, color: 'black'}}>
                {item.firstName}
              </Text>
              <Text style={{fontSize: 18, color: 'black'}}>
                {item.lastName}
              </Text>
            </View>
          </View>
        )}
        onEndReachedThreshold={0.5}
        onEndReached={fetchUsers}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default App;
