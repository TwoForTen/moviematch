import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
  Button,
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';

import useFetchData from '../../hooks/useFetchData';
import ReviewStars from './ReviewStars';

const InfoModal: React.FC<any> = ({ data }) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState<boolean>(true);
  const [scrollOffset, setScrollOffset] = useState<number>();

  const { loading, response, error } = useFetchData({
    url: `/movie/${data.id}/videos`,
    method: 'get',
  });

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(e.nativeEvent.contentOffset.y);
  };

  return (
    <Modal
      onSwipeComplete={() => setShowModal(false)}
      style={styles.modal}
      isVisible={showModal}
      hasBackdrop={false}
      coverScreen={false}
      // swipeDirection={['down']}
      propagateSwipe
      scrollOffset={scrollOffset}
    >
      <View style={{ flex: 0.4 }}>
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.content}
        >
          {data && (
            <>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{data.title}</Text>
                <ReviewStars rating={data.vote_average} />
              </View>
              <Text style={styles.releaseDate}>
                {data.release_date.split('-')[0]}
              </Text>
              <Text style={styles.overview}>{data.overview}</Text>
              <Button
                title="View Trailer"
                onPress={() =>
                  navigation.navigate('Trailer', {
                    id:
                      response.results.filter(
                        (obj: any) => obj.type === 'Trailer'
                      )[0].key ||
                      response.results[0].key ||
                      '',
                  })
                }
              />
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    margin: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  releaseDate: {
    color: 'rgba(0,0,0,0.35)',
    fontWeight: 'bold',
  },
  overview: {
    marginTop: 10,
  },
});

export default InfoModal;
