package com.rnswiper.swiper

import android.annotation.SuppressLint
import android.content.Context
import android.util.AttributeSet
import android.util.Log
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.View.MeasureSpec
import android.view.View.OnTouchListener
import android.view.ViewGroup
import android.widget.Button
import android.widget.FrameLayout
import android.widget.RelativeLayout
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.PagerSnapHelper
import androidx.recyclerview.widget.RecyclerView
import com.facebook.react.views.view.ReactViewGroup
import com.rnswiper.R
import java.util.ArrayList
import com.facebook.react.uimanager.events.RCTEventEmitter

import com.facebook.react.bridge.ReactContext

import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap


class SwiperView @JvmOverloads constructor(
    context: Context,
    attributeSet: AttributeSet? = null,
    defStyleAttr: Int = 0
) : RecyclerView(context, attributeSet, defStyleAttr) {
    private val adapter = StateAdapter(context, ArrayList<ImageData>())
    private val layoutManager =  LinearLayoutManager(
        context,
        LinearLayoutManager.HORIZONTAL,
        false
    )
    private val snapHelper = PagerSnapHelper()
    private var mRecyclerView: RecyclerView? = null
    private var pendingSlideId: String? = null
    private var innerSlideId: String? = null

    init {
        val inflater: LayoutInflater = LayoutInflater.from(getContext())
        mRecyclerView = this

        mRecyclerView?.adapter = adapter
        mRecyclerView?.layoutManager = layoutManager
        snapHelper.attachToRecyclerView(mRecyclerView)
        mRecyclerView?.addOnScrollListener(object : RecyclerView.OnScrollListener() {
            override fun onScrollStateChanged(recyclerView: RecyclerView, newState: Int) {
                super.onScrollStateChanged(recyclerView, newState)
                if (newState == RecyclerView.SCROLL_STATE_IDLE) {
                    val position: Int = getCurrentItem()
                    onPageChanged(position)
                }
            }
        })
        innerSlideId = getCurrentScrollItemId()
        val lp = FrameLayout.LayoutParams(
            LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT,
        )
        layoutParams = lp
    }

    private var mRequestedLayout = false

    @SuppressLint("WrongCall")
    override fun requestLayout() {
        super.requestLayout()
        // We need to intercept this method because if we don't our children will never update
        // Check https://stackoverflow.com/questions/49371866/recyclerview-wont-update-child-until-i-scroll
        if (!mRequestedLayout) {
            mRequestedLayout = true
            post {
                mRequestedLayout = false
                layout(left, top, right, bottom)
                onLayout(false, left, top, right, bottom)
            }
        }
    }

    fun updateImagesByNewState(newImagesState: ArrayList<ImageData>) {
        adapter.setImages(newImagesState)
        val pSlideId = pendingSlideId ?: return
        if (pSlideId == innerSlideId) {
            return
        }
        val pos = findPosById(pSlideId) ?: return
        slideToPos(pos, false)
        innerSlideId = pSlideId
        pendingSlideId = null
    }


    fun setCurrentSlide(id: String) {
        if (id == innerSlideId) {
            return
        }
        val pos = findPosById(id)
        if (pos != null) {
            slideToPos(pos, false)
            innerSlideId = id
            pendingSlideId = null
        } else {
            pendingSlideId = id
        }
    }

    fun setMinScale(minScale: Double) {
        adapter.setMinScale(minScale)
    }

    fun setMaxScale(maxScale: Double) {
        adapter.setMaxScale(maxScale)
    }

    private fun findPosById(id: String): Int? {
        val images = adapter.getImages()
        val curr = images.find { it.id == id } ?: return null
        return images.indexOf(curr)
    }

    private fun getCurrentScrollItemId(): String? {
        val pos =  getCurrentItem()
        val images = adapter.getImages()
        if (images.size > 0) {
            return images[pos].id
        }
        return null
    }

    private fun getCurrentItem(): Int {
        val s =  (layoutManager as LinearLayoutManager?)
        return s?.findFirstVisibleItemPosition() ?: 0
    }

    private fun onPageChanged(pos: Int) {
        val images = adapter.getImages()
        if (images.size > 0) {
            val id = images[pos].id
            innerSlideId = id
            makeChangeEvent(id)
        }
    }

    private fun slideToPos(position: Int, smooth: Boolean) {
        if (smooth) mRecyclerView?.smoothScrollToPosition(position) else mRecyclerView?.scrollToPosition(
            position
        )
    }

    private fun makeChangeEvent(slideId: String) {
        val event: WritableMap = WritableNativeMap()
        event.putString("slideId", slideId)
        val reactContext = context as ReactContext
        reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(
            id,
            "swiperIdChange",
            event
        )
    }
}