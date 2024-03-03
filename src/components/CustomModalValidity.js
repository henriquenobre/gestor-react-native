import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { TextComponent } from './TextComponent';

const CustomModal = ({ visible, onConfirm, text }) => {
  return (
    <Modal transparent visible={visible} onRequestClose={onConfirm}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <View style={styles.body}>
            <TextComponent color='#FFFFFF' size={20} style={{ textAlign: 'center' }}>{text}</TextComponent>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <TextComponent color='#FFFFFF'>OK</TextComponent>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: "100%",
    backgroundColor: '#0CBC8B',
    borderRadius: 30
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  body: {
    padding: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default CustomModal;
