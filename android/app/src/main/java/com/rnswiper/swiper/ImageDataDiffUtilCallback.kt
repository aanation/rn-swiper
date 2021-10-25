package com.rnswiper.swiper

import android.util.Log
import androidx.recyclerview.widget.DiffUtil
import kotlin.reflect.typeOf

class ImageDataDiffUtilCallback(oldList: List<ImageData>, newList: List<ImageData>) : DiffUtil.Callback() {
    private val oldList: List<ImageData> = oldList
    private val newList: List<ImageData> = newList

    override fun getNewListSize(): Int {
        return newList.size
    }

    override fun getOldListSize(): Int {
        return oldList.size
    }

    override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        val oldImage = oldList[oldItemPosition]
        val newImage = newList[newItemPosition]

        return oldImage.id == newImage.id
    }

    override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        val oldImage = oldList[oldItemPosition]
        val newImage = newList[newItemPosition]

        return oldImage.id == newImage.id && oldImage.src == newImage.src
    }


}