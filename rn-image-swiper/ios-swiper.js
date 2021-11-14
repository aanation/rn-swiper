import * as React from 'react';
import {
  FlatList,
  VirtualizedList,
  StyleSheet,
  View,
  Image,
  Dimensions
} from "react-native"
import { ReactNativeZoomableView } from '@dudigital/react-native-zoomable-view'


const getWindow = (index, images) => {
  if (images.length < 3) {
    return images
  }

  if (index === 0) {
    return images.slice(0, 3)
  }

  if (index === images.length - 1) {
    return images.slice(index - 2, index + 2)
  }

  return images.slice(index - 1, index + 2)
}



const calcWindow = ({ images, currIndex }) => {
  const window = images.length && currIndex !== -1 ? getWindow(currIndex, images) : []
  return window
}

const Slide = ({ style, width, uri, scrollEnabled, setScrollEnabled }) => {
  const zoomableImage = React.useRef(null)

  const handleZoomChanges = (a, b, { zoomLevel }) => {
    if (zoomLevel === 1 && !scrollEnabled) {
      setScrollEnabled(true)
      return
    }

    if (zoomLevel > 1 && scrollEnabled) {
      setScrollEnabled(false)
      return
    }
  }

  return (
    <View style={style}>
      <ReactNativeZoomableView
        ref={zoomableImage}
        maxZoom={1.5}
        minZoom={1}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
        captureEvent={true}
        onDoubleTapBefore={handleZoomChanges}
        onDoubleTapAfter={handleZoomChanges}
        onShiftingBefore={handleZoomChanges}
        onShiftingEnd={handleZoomChanges}
        onZoomBefore={handleZoomChanges}
        onZoomEnd={handleZoomChanges}
      // onZoomAfter={this.logOutZoomState}
      >
        <Image style={{ flex: 1, width, height: '100%' }}
          source={{
            uri,
          }}
          resizeMode="contain" />
      </ReactNativeZoomableView>
    </View>
  )
}

export const IosSwiper = ({ onChange, images, currentId }) => {
  const [width, setWidth] = React.useState(null)
  const [innerId, setInnerId] = React.useState(currentId)
  const [initialIndex, setInitialIndex] = React.useState()
  const scrollToItemRef = React.useRef(null)
  const imagesList = React.useRef(null)
  const [scrollEnabled, setScrollEnabled] = React.useState(true)
  const layoutReady = width !== null
  const [_, forceUpdate] = React.useReducer((c) => c + 1, 0)

  const currIndex = images.findIndex((i) => i.id === innerId)
  const initialScrollIndex = typeof initialIndex === "number"
    ? initialIndex
    : currIndex !== -1 ? currIndex : undefined

  React.useEffect(() => {
    if (typeof initialIndex !== "number" && typeof initialScrollIndex === "number") {
      setInitialIndex(initialScrollIndex)
    }
  })



  const window = calcWindow({ images, currIndex })
  const scrollAfterRender = React.useCallback((p) => {
    const item = p || scrollToItemRef.current
    if (imagesList.current && item) {
      imagesList.current.scrollToItem({
        item,
        animated: false,
      })
      scrollToItemRef.current = null
    }
  }, [])

  React.useLayoutEffect(() => {
    setTimeout(() => {
      scrollAfterRender()
    }, 30)
  }, [innerId])

  React.useEffect(() => {
    // set initial id
    if (currentId && !innerId) {
      setInnerId(currentId)
      return
    }

    // external id changed 
    if (currentId && innerId !== currentId) {
      const inCurrWindow = window.some((i) => i.id === currentId)
      const currItem = images.find((i) => i.id === currentId)
      if (inCurrWindow) {
        scrollAfterRender(currItem)
      } else {
        scrollToItemRef.current = currItem
        /*
        setTimeout(() => {
          scrollAfterRender(currItem)
        }, 200)
        */
      }
      setInnerId(currentId)
      return
    }

    // init inner id
    if (!innerId && images.length) {
      setInnerId(images[0].id)
    }
  }, [currentId, innerId, images, window])


  const emitCurrentId = (slideId) => {
    if (onChange) {
      onChange({ nativeEvent: { slideId } })
    }
  }


  const imageWrapStyles = StyleSheet.flatten([styles.imageWrap, {
    width,
  }])

  const onLayout = (e) => {
    const { width } = e.nativeEvent.layout
    setWidth(width)
  }

  const onScroll = (event) => {
    const {
      nativeEvent: {
        contentOffset: { x: scrollX },
      },
    } = event

    const nextIndex = Math.round(scrollX / width)
    const nextId = window[nextIndex].id

    if (innerId !== nextId) {
      setInnerId(nextId)
    }

    if (nextId !== currentId) {
      emitCurrentId(nextId)
    }
  }

  const lockScroll = () => {
    if (scrollEnabled) {
      setScrollEnabled(false)
    }
  }

  const unlockScroll = () => {
    if (!scrollEnabled) {
      setScrollEnabled(true)
    }
  }


  const renderItem = ({ item }) => {
    return (
      <Slide
        style={imageWrapStyles}
        width={width}
        uri={item.src}
        scrollEnabled={scrollEnabled}
        setScrollEnabled={setScrollEnabled}
      />
    )
  }

  const showList = Boolean(
    layoutReady &&
    window.length &&
    typeof innerId === "string" &&
    typeof initialIndex === "number"
  )

  return (
    <View style={styles.sliderWrap} onLayout={onLayout}>
      {showList && (
        <FlatList
          ref={imagesList}
          data={window}
          horizontal
          pagingEnabled
          scrollEnabled={scrollEnabled}
          // initialScrollIndex={initialSlideIndex}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={initialScrollIndex}
          // getItem={(_, index) => images[index]}
          // getItemCount={() => images.length}
          // onViewableItemsChanged={scrollAfterRender}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={renderItem}
          // onMomentumScrollEnd={onScroll}
          keyExtractor={(item) => item.id}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: -999,
          }}
          onMomentumScrollEnd={onScroll}
        />
      )}
    </View>
  )
};


const styles = StyleSheet.create({
  sliderWrap: {
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
  },
  imageWrap: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  }
});
