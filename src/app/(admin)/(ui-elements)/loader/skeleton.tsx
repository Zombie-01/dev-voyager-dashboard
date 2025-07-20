import React from "react";
import clsx from "clsx";

interface SkeletonProps {
  className?: string;
  rounded?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "", rounded = true }) => {
  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-200 dark:bg-gray-700",
        rounded ? "rounded-md" : "",
        className
      )}
    />
  );
};

export default Skeleton;
