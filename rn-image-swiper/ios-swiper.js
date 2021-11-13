import * as React from 'react';
import {
  FlatList,
  VirtualizedList,
  StyleSheet,
  View,
  Image,
} from "react-native"

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



const calcWindow = ({ images, currIndex, pendingId }) => {
  const window = images.length && currIndex !== -1 ? getWindow(currIndex, images) : []
  const windowHasPendingId = window.some((i) => {
    return i.id === pendingId
  })
  if (!pendingId || windowHasPendingId) return window

  // дополняем window элементом к которому хотим проскролить 
  const pendingIndex = images.findIndex((i) => i.id === pendingId)
  const pendingImage = images[pendingIndex]

  if (pendingId > currIndex) {
    return [...window, pendingImage]
  }

  return [pendingImage, ...window]
}

export const IosSwiper = ({ onChange, images, currentId }) => {
  const [width, setWidth] = React.useState(null)
  const [innerId, setInnerId] = React.useState(currentId)
  const [initialIndex, setInitialIndex] = React.useState()
  const [pendingId, setPendingId] = React.useState(null)
  const [clearPendingId, setClearPendingId] = React.useState(false)
  const imagesList = React.useRef(null)
  const layoutReady = width !== null

  const currIndex = images.findIndex((i) => i.id === innerId)
  const initialScrollIndex = typeof initialIndex === "number"
    ? initialIndex
    : currIndex !== -1 ? currIndex : undefined

  React.useEffect(() => {
    if (typeof initialIndex !== "number" && typeof initialScrollIndex === "number") {
      setInitialIndex(initialScrollIndex)
    }
  })

  const window = calcWindow({ images, currIndex, pendingId })

  React.useEffect(() => {
    const pendingIndex = window.findIndex((i) => i.id === pendingId)
    if (pendingIndex !== -1 && imagesList.current) {
      console.log(`scroll to index ${pendingIndex}`)
      imagesList.current.scrollToIndex({
        index: pendingIndex,
        animated: false,
      })
      setClearPendingId(true)
    }
  }, [window, pendingId, innerId])

  React.useEffect(() => {
    if (clearPendingId) {
      setInnerId(pendingId)
      setPendingId(null)
      setClearPendingId(false)
    }
  }, [clearPendingId, pendingId])

  React.useEffect(() => {
    // set initial id
    if (currentId && !innerId) {
      setInnerId(currentId)
      return
    }

    // external id changed 
    if (currentId && innerId !== currentId) {
      setPendingId(currentId)
      return
    }

    // init inner id
    if (!innerId && images.length) {
      setInnerId(images[0].id)
    }
  }, [currentId, innerId, images])

  React.useEffect(() => {
    const innerIdNotFound = !images.some((i) => i.id === currentId)
    if (innerIdNotFound && images.length) {
      setInnerId(images[0].id)
      emitCurrentId(images[0].id)
    }
  }, [images, innerId])

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


  const renderItem = ({ item }) => {
    return (
      <View style={imageWrapStyles}>
        <Image
          style={{ width, height: 200 }}
          source={{
            uri: item.src,
          }}
        />
      </View>
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
          // initialScrollIndex={initialSlideIndex}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={initialScrollIndex}
          // getItem={(_, index) => images[index]}
          // getItemCount={() => images.length}
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
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'green'
  }
});
