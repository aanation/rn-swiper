package com.rnswiper.swiper

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

class SwiperView(context: Context) : RelativeLayout(context) {
    private val adapter = StateAdapter(context, ArrayList<ImageData>())
    private val layoutManager =  LinearLayoutManager(
        context,
        LinearLayoutManager.HORIZONTAL,
        false
    )
    private val snapHelper = PagerSnapHelper()
    private var mRecyclerView: RecyclerView? = null

    init {
        val inflater: LayoutInflater = LayoutInflater.from(getContext())
        inflater.inflate(R.layout.swiper, this)
        mRecyclerView = findViewById<RecyclerView>(R.id.list)

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
        val lp = FrameLayout.LayoutParams(
            LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT,
        )
        layoutParams = lp
    }

    fun updateImagesByNewState(newImagesState: ArrayList<ImageData>) {
        adapter.setImages(newImagesState)
    }

    fun setCurrentSlide(id: String) {
        val images = adapter.getImages()
        val curr = images.find { it.id == id }
        if (curr != null) {
            val index = images.indexOf(curr)
            setCurrentPosition(index, false)
        }
    }

    private fun getCurrentItem(): Int {
        val s =  (layoutManager as LinearLayoutManager?)
        return s?.findFirstVisibleItemPosition() ?: 0
    }

    private fun onPageChanged(pos: Int) {
        Log.i("SLIDER", pos.toString())
    }



    private fun setCurrentPosition(position: Int, smooth: Boolean) {
        /*
        mRecyclerView?.post(Runnable {
            Log.i("DIFF_CB", "here")
            mRecyclerView?.scrollToPosition(position)
            // Here adapter.getItemCount()== child count
        })
        */
        if (smooth) mRecyclerView?.smoothScrollToPosition(position) else mRecyclerView?.scrollToPosition(
            position
        )

    }
}