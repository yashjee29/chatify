import React from 'react'
import Skeleton from './Skeleton/Skeleton'

const UserListSkeleton = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <Skeleton width={40} height={40} radius={999} />
          <div style={{ flex: 1 }}>
            <Skeleton height={14} width="50%" style={{ marginBottom: 6 }} />
            <Skeleton height={12} width="30%" />
          </div>
        </div>
      ))}
    </>
  );
};

export default UserListSkeleton
