package com.rnswiper.swiper

import android.util.Log
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.image.ReactImageView

import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.bridge.ReadableType

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ViewGroupManager
import java.lang.IllegalArgumentException
import java.util.stream.Collectors.toMap


class ReactSwiperManager: SimpleViewManager<SwiperView>() {
    val REACT_CLASS = "RCTSwiper"

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(context: ThemedReactContext): SwiperView {
        return SwiperView(context)
    }

    @ReactProp(name = "images")
    fun setSlides(view: SwiperView, imagesProp: ReadableArray) {
        val images = ArrayList<ImageData>()

        for (index in 0 until imagesProp.size()) {
            val image = imagesProp.getMap(index)
            val id = image.getString("id")
            val src = image.getString(("src"))
            if (id !== null && src !== null) {
                images.add(ImageData(id, src))
            }
        }

        view.updateImagesByNewState(images)
    }

    @ReactProp(name = "currentId")
    fun setCurrentId(view: SwiperView, currentId: String?) {
        if (currentId is String) {
            view.setCurrentSlide(currentId)
        }
    }

}
