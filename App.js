/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';

import {AndroidSwiper} from './AndroidSwiper';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function randomString(length = 10) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const createImage = ({width, height}) => {
  return {
    id: randomString(10),
    src: `https://picsum.photos/${width}/${height}?t=${randomString(10)}`,
  };
};

const createImages = ({count, width, height}) => {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push(createImage({width, height}));
  }
  return images;
};

const initImages = (() => {
  return createImages({count: 4, width: 600, height: 800});
})();

const App: () => Node = () => {
  const [images, setImages] = React.useState(initImages);
  const [currentId, setCurrentId] = React.useState(
    initImages[initImages.length - 1].id,
  );

  console.log(currentId);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const addToStart = () => {
    const newImages = createImages({count: 5, width: 300, height: 900});
    setImages([...newImages, ...images]);
  };

  const addToEnd = () => {
    const newImages = createImages({count: 5, width: 1000, height: 800});
    setImages([...images, ...newImages]);
    const {id} = newImages[newImages.length - 1];
    setCurrentId(id);
  };

  const toLastItem = () => {
    if (!images.length) {
      return;
    }

    const {id} = images[images.length - 1];
    setCurrentId(id);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Modal visible style={{width: '100%', height: 900}}>
        <View style={{width: '100%', flexDirection: 'column'}}>
          <View style={styles.sliderWrap}>
            <AndroidSwiper
              currentId={currentId}
              onChange={setCurrentId}
              style={styles.slider}
              images={images}
            />
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Button title="add items to start" onPress={addToStart} />
            <Button title="add items to end" onPress={addToEnd} />
            <Button title="to last item" onPress={toLastItem} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  wrap: {
    flex: 1,
  },
  slider: {
    minWidth: '100%',
    height: '100%',
  },
  sliderWrap: {
    width: '100%',
    height: 700,
    backgroundColor: 'red',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
