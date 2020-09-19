import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../theme';

interface Props {
  icon: JSX.Element;
  endIcon: JSX.Element;
  title: string;
  helperText?: string;
  warning?: boolean;
  number?: number;
}

const ProfileButton: React.FC<Props> = ({
  icon,
  title,
  helperText,
  warning,
  number,
  endIcon,
}) => {
  return (
    <TouchableOpacity style={styles.button}>
      <View style={styles.iconContainers}>
        {icon}
        <View style={styles.textContainer}>
          <Text style={[styles.text, { color: warning ? 'red' : 'black' }]}>
            {title}
          </Text>
          {!helperText ? null : (
            <Text
              style={[styles.helperText, { color: warning ? 'red' : 'black' }]}
            >
              {helperText}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.iconContainers}>
        {number !== undefined ? (
          <Text style={styles.number}>{number}</Text>
        ) : null}
        {endIcon}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
  },
  iconContainers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
  },
  helperText: {
    fontSize: 12,
    color: theme.secondary,
  },
  number: {
    marginHorizontal: 10,
    textAlign: 'right',
  },
});

export default ProfileButton;
