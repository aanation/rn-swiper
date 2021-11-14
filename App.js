/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';
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

import { RnImageSwiper } from './rn-image-swiper';
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

const images = [
  "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
  "https://cdn02.nintendo-europe.com/media/images/06_screenshots/games_5/nintendo_switch_download_software_2/nswitchds_lostinrandom/NSwitchDS_LostInRandom_06.jpg",
  "https://cdn02.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_download_software_1/H2x1_NSwitchDS_LostInRandom_image1600w.jpg",
  "https://lizaonair.com/random/images/preview.jpg",
  "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F13%2F2015%2F04%2F05%2Ffeatured.jpg&q=85",
  "https://hatrabbits.com/wp-content/uploads/2016/12/rare-combinaties.jpg"
]

const getRandImageSrc = () => images[Math.floor(Math.random() * images.length)]

const createImage = ({ width, height }) => {
  return {
    id: randomString(10),
    src: `https://picsum.photos/${width}/${height}?t=${randomString(10)}`,
  };
};

const createImages = ({ count, width, height }) => {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push(createImage({ width, height }));
  }
  return images;
};

const initImages = (() => {
  return createImages({ count: 4, width: 200, height: 800 });
})();

const App: () => Node = () => {
  const [images, setImages] = React.useState(initImages);
  const [currentId, setCurrentId] = React.useState(undefined);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const addToStart = () => {
    const newImages = createImages({ count: 5, width: 300, height: 900 });
    const updated = [...newImages, ...images]
    setImages(updated);
    if (!currentId) {
      setCurrentId(updated[0].id)
    }
  };

  const addToEnd = () => {
    const newImages = createImages({ count: 5, width: 1000, height: 800 });
    setImages([...images, ...newImages]);
  };

  const toLastItem = () => {
    if (!images.length) {
      return;
    }

    const { id } = images[images.length - 1];
    setCurrentId(id);
  };

  const deleteCurrent = () => {
    if (currentId) {
      setImages(images.filter((i) => i.id !== currentId))
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Modal visible style={{ width: '100%', height: 900 }}>
        <View style={{ width: '100%', flexDirection: 'column' }}>
          <View style={styles.sliderWrap}>
            <RnImageSwiper
              currentId={currentId}
              onChange={setCurrentId}
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
    height: 400,
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
