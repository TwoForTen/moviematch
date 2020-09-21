import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../theme';

interface Props {
  icon: JSX.Element;
  endIcon: JSX.Element;
  title: string;
  helperText?: string;
  pairingId?: string;
  warning?: boolean;
  success?: boolean;
  number?: number;
  onPress: () => void;
}

const ProfileButton: React.FC<Props> = ({
  icon,
  title,
  helperText,
  pairingId,
  warning,
  success,
  number,
  endIcon,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconContainers}>
        {icon}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.text,
              {
                color: warning
                  ? theme.danger
                  : success
                  ? theme.primary
                  : theme.black,
              },
            ]}
          >
            {title}
          </Text>
          {!helperText ? null : (
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              {!!pairingId && (
                <Text
                  style={[
                    styles.helperText,
                    { fontWeight: 'bold', color: theme.danger },
                  ]}
                >
                  {pairingId}
                </Text>
              )}
              <Text
                style={[
                  styles.helperText,
                  {
                    color: warning
                      ? theme.danger
                      : success
                      ? theme.primary
                      : theme.black,
                  },
                ]}
              >
                {helperText}
              </Text>
            </View>
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
