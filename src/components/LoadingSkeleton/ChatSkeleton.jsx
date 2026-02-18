import React from 'react'
import Skeleton from './Skeleton/Skeleton'

const ChatSkeleton = () => {
  return (
    <div style={{ padding: 20 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton
          key={i}
          height={36}
          width={i % 2 ? "40%" : "60%"}
          radius={16}
          style={{
            marginBottom: 12,
            marginLeft: i % 2 ? "auto" : 0,
          }}
        />
      ))}
    </div>
  );
};

export default ChatSkeleton
