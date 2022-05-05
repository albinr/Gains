import React, {
  useCallback, useMemo, useRef, useState, useEffect,
} from 'react';
import {
  FlatList, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet,
} from 'react-native';
import {
  Button, Dialog, Portal, TextInput,
} from 'react-native-paper';

const SaveWorkout: React.FC<{ readonly title?: string, readonly isVisible: boolean, readonly onDismiss: () => void, readonly onCreate: (name: string, favourite: boolean) => void }> = ({
  isVisible, title, onDismiss, onCreate,
}) => {
  const workoutName = useRef('');

  const onCreateInternal = useCallback(() => {
    onCreate(workoutName.current, false);
  }, [onCreate]);

  const onCreatefavourite = useCallback(() => {
    onCreate(workoutName.current, true);
  }, [onCreate]);

  useEffect(() => {
    if (!isVisible) {
      workoutName.current = '';
    }
  }, [isVisible]);

  return (
    <Portal>

      <Dialog visible={isVisible} onDismiss={onDismiss}>
        <KeyboardAvoidingView>
          <Dialog.Title>{title || 'Save workout'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              onSubmitEditing={onCreateInternal}
              placeholder='Workout name'
              autoFocus
              onChangeText={(text) => { workoutName.current = text; }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismiss}>Cancel</Button>
            <Button onPress={onCreateInternal}>Create</Button>
            <Button onPress={onCreatefavourite}>Create as favourite</Button>
          </Dialog.Actions>
        </KeyboardAvoidingView>
      </Dialog>

    </Portal>
  );
};

export default SaveWorkout;
