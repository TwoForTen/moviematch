import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import axios from '../../../axiosInstance';

import ReviewStars from './ReviewStars';

const InfoModal: React.FC<any> = ({ data }) => {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [scrollOffset, setScrollOffset] = useState<number>();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(e.nativeEvent.contentOffset.y);
  };

  useEffect(() => {
    data && axios.get(`/movie/${data.id}/videos`).then(({ data }) => {});
  }, [data]);

  return (
    <Modal
      onSwipeComplete={() => setShowModal(false)}
      style={styles.modal}
      isVisible={showModal}
      hasBackdrop={false}
      coverScreen={false}
      swipeDirection={['down']}
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
    marginTop: 18,
  },
});

export default InfoModal;
