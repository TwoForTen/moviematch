import React from 'react';
import { View, StyleSheet, Image, Text, StatusBar } from 'react-native';
import Modal from 'react-native-modal';

import theme from '../theme';
import { SnackbarType } from '../screens/Splash';

interface Props {
  isVisible: boolean;
  image: string;
  movieTitle: string;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarType>>;
}

const SNACKBAR_DURATION = 5000;
const imageUrl: string = 'https://image.tmdb.org/t/p/w500';

const Snackbar: React.FC<Props> = ({
  isVisible,
  image,
  movieTitle,
  setSnackbar,
}) => {
  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      hasBackdrop={false}
      coverScreen={false}
      animationIn="slideInDown"
      animationOut="slideOutUp"
      useNativeDriver
      hideModalContentWhileAnimating
      onModalShow={() =>
        setTimeout(
          () => setSnackbar({ show: false, image: '', movieTitle: '' }),
          SNACKBAR_DURATION
        )
      }
    >
      <View style={styles.content}>
        <Image style={styles.image} source={{ uri: imageUrl + image }} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>It's a match!</Text>
          <Text style={styles.subtitle}>{movieTitle}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    justifyContent: 'flex-start',
    paddingTop: StatusBar.currentHeight,
  },
  content: {
    backgroundColor: theme.darkTransparent,
    borderRadius: 150,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    height: 55,
    width: 55,
    resizeMode: 'cover',
    borderRadius: 150,
  },
  infoContainer: {
    marginHorizontal: 15,
  },
  title: {
    color: theme.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: theme.secondary,
  },
});

export default Snackbar;
