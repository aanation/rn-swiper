package com.rnswiper.swiper

import androidx.recyclerview.widget.RecyclerView
import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.recyclerview.widget.DiffUtil
import com.koushikdutta.ion.Ion
import com.rnswiper.R
import java.util.*
import java.util.List
import kotlin.collections.ArrayList
import com.jsibbold.zoomage.ZoomageView

data class ImageData(val id: String, val src: String)

class StateAdapter(context: Context, states: ArrayList<ImageData>) : RecyclerView.Adapter<StateAdapter.ViewHolder>() {
    private val inflater: LayoutInflater = LayoutInflater.from(context)
    private var images = states
    private var maxScale = 8.0
    private var minScale = 0.6

    fun setMinScale(value: Double) {
        minScale = value
    }

    fun setMaxScale(value: Double) {
        maxScale = value
    }

    fun setImages(newImagesState: ArrayList<ImageData>) {
        val diffUtilsCallback = ImageDataDiffUtilCallback(images, newImagesState)
        val diff = DiffUtil.calculateDiff(diffUtilsCallback)
        images = newImagesState
        diff.dispatchUpdatesTo(this)
    }

    fun getImages(): ArrayList<ImageData> {
        return images
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view =  inflater.inflate(R.layout.slide, parent, false)
        val viewHolder = ViewHolder(view)
        viewHolder.setMinScale(minScale)
        viewHolder.setMaxScale(maxScale)
        return viewHolder
    }


    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val image = images[position]
        holder.setMinScale(minScale)
        holder.setMaxScale(maxScale)
        val imageView = holder.imageView

        Ion.with(imageView)
            .load(image.src)
    }

    override fun getItemCount(): Int {
        return images.size
    }

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val imageView: ZoomageView = view.findViewById(R.id.imageView)
        private var maxScale = 8.0
        private var minScale = 0.6

        fun setMinScale(value: Double) {
            minScale = value
            imageView.setScaleRange(minScale.toFloat(), maxScale.toFloat())
        }

        fun setMaxScale(value: Double) {
            maxScale = value
            imageView.setScaleRange(minScale.toFloat(), maxScale.toFloat())
        }
    }

}