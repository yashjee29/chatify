import React from 'react'
import styles from "./Skeleton.module.css"

const Skeleton = ({width, height, radius = 12, style}) => {
  return (
    <div className={styles.skeleton} style={{width, height, borderRadius: radius, ...style}}>
        
    </div>
  )
}

export default Skeleton
